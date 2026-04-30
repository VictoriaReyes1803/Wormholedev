import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import handler from './contact.js'

const originalEnv = process.env

const createResponse = () => {
  const res = {
    statusCode: undefined,
    body: undefined,
    headers: {},
    status: jest.fn(code => {
      res.statusCode = code
      return res
    }),
    json: jest.fn(body => {
      res.body = body
      return res
    }),
    setHeader: jest.fn((name, value) => {
      res.headers[name] = value
    }),
  }

  return res
}

const createPostRequest = body => ({
  method: 'POST',
  body: {
    name: 'Jane Client',
    email: 'Jane@Example.com',
    company: 'Acme',
    service: 'Web Application',
    budget: '$5,000 - $15,000',
    message: 'I need a new client portal.',
    ...body,
  },
})

describe('contact api handler', () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      BREVO_API_KEY: 'test-api-key',
      CONTACT_TO_EMAIL: 'info@wormholedev.space',
      CONTACT_FROM_EMAIL: 'info@wormholedev.space',
      CONTACT_FROM_NAME: 'WormholeDev',
    }

    globalThis.fetch = jest.fn().mockResolvedValue({ ok: true })
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  test('sends a contact request through Brevo', async () => {
    const res = createResponse()

    await handler(createPostRequest(), res)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'api-key': 'test-api-key',
          'content-type': 'application/json',
        }),
      }),
    )

    const payload = JSON.parse(globalThis.fetch.mock.calls[0][1].body)
    expect(payload.sender).toEqual({ name: 'WormholeDev', email: 'info@wormholedev.space' })
    expect(payload.to).toEqual([{ email: 'info@wormholedev.space' }])
    expect(payload.replyTo).toEqual({ email: 'jane@example.com', name: 'Jane Client' })
    expect(payload.subject).toBe('New contact request from Jane Client')
    expect(payload.textContent).toContain('I need a new client portal.')
  })

  test('escapes html in submitted content', async () => {
    const res = createResponse()

    await handler(createPostRequest({
      name: '<script>Jane</script>',
      message: 'Line one\n<img src=x onerror=alert(1)>',
    }), res)

    const payload = JSON.parse(globalThis.fetch.mock.calls[0][1].body)
    expect(payload.htmlContent).toContain('&lt;script&gt;Jane&lt;/script&gt;')
    expect(payload.htmlContent).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(payload.htmlContent).toContain('Line one<br />')
  })

  test('rejects non-post methods', async () => {
    const res = createResponse()

    await handler({ method: 'GET' }, res)

    expect(res.statusCode).toBe(405)
    expect(res.headers.Allow).toBe('POST')
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  test('returns configuration error when Brevo api key is missing', async () => {
    delete process.env.BREVO_API_KEY
    const res = createResponse()

    await handler(createPostRequest(), res)

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ message: 'Email service is not configured' })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  test('validates required contact fields', async () => {
    const res = createResponse()

    await handler(createPostRequest({ email: 'not-an-email' }), res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ message: 'Please provide a valid name, email, and message' })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  test('silently accepts honeypot submissions without calling Brevo', async () => {
    const res = createResponse()

    await handler(createPostRequest({ website: 'https://spam.example' }), res)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  test('returns bad gateway when Brevo rejects the request', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'invalid sender' }),
    })
    const res = createResponse()

    await handler(createPostRequest(), res)

    expect(res.statusCode).toBe(502)
    expect(res.body).toEqual({ message: 'Could not send email' })
    expect(console.error).toHaveBeenCalledWith('Brevo contact email failed:', 'invalid sender')
  })
})
