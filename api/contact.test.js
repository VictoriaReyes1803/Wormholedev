import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import handler from './contact.js'

const originalEnv = process.env
let requestIndex = 0

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
  headers: {
    'cf-connecting-ip': `192.0.2.${requestIndex += 1}`,
  },
  body: {
    name: 'Jane Client',
    email: 'Jane@Example.com',
    company: 'Acme',
    service: 'Web Application',
    budgetCurrency: 'USD',
    budget: 'USD $2,000 - $5,000',
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
      TURNSTILE_SECRET_KEY: '',
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

  test('verifies Turnstile before sending email when secret is configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret'
    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      })
      .mockResolvedValueOnce({ ok: true })
    const res = createResponse()

    await handler(createPostRequest({ turnstileToken: 'valid-turnstile-token' }), res)

    expect(res.statusCode).toBe(200)
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      1,
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }),
    )
    expect(String(globalThis.fetch.mock.calls[0][1].body)).toContain('response=valid-turnstile-token')
    expect(globalThis.fetch.mock.calls[1][0]).toBe('https://api.brevo.com/v3/smtp/email')
  })

  test('rejects contact request when Turnstile verification fails', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret'
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: false }),
    })
    const res = createResponse()

    await handler(createPostRequest({ turnstileToken: 'invalid-turnstile-token' }), res)

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({ message: 'Security verification failed. Please try again.' })
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  test('rate limits repeated requests from the same ip', async () => {
    const ip = '198.51.100.10'
    const responses = []

    for (let i = 0; i < 6; i += 1) {
      const res = createResponse()
      responses.push(res)
      await handler({
        ...createPostRequest(),
        headers: { 'cf-connecting-ip': ip },
      }, res)
    }

    expect(responses.at(-1).statusCode).toBe(429)
    expect(responses.at(-1).body).toEqual({ message: 'Too many requests. Please wait a minute and try again.' })
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
