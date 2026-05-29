// Minimal JSONP helper — lets a static site READ data from a Google Apps Script
// web app (which doesn't send CORS headers, so normal fetch can't read responses).
let counter = 0

export function jsonp(baseUrl, params = {}, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const cb = `__bfd_jsonp_${Date.now()}_${counter++}`
    const script = document.createElement('script')

    const cleanup = () => {
      delete window[cb]
      if (script.parentNode) script.parentNode.removeChild(script)
      clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP request timed out'))
    }, timeoutMs)

    window[cb] = (data) => {
      cleanup()
      resolve(data)
    }
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP network error'))
    }

    const qs = new URLSearchParams({ ...params, callback: cb }).toString()
    script.src = baseUrl + (baseUrl.includes('?') ? '&' : '?') + qs
    document.body.appendChild(script)
  })
}
