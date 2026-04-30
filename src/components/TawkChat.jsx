import { useEffect } from 'react'

const TAWK_PROPERTY_ID = '69f2b1a7db9e841c36b06c4d'
const TAWK_WIDGET_ID = '1jne0btrp'
const TAWK_SCRIPT_ID = 'tawk-to-widget'

export default function TawkChat() {
  useEffect(() => {
    if (document.getElementById(TAWK_SCRIPT_ID)) return

    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    script.id = TAWK_SCRIPT_ID
    script.async = true
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')

    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
