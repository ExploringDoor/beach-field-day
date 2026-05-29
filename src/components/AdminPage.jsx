import { useEffect } from 'react'
import { REGISTRATION_ENDPOINT } from '../config.js'

// The admin is now served directly by Google Apps Script (password-gated, read/write,
// and immune to browser extensions / CORS). This page just forwards there.
export default function AdminPage() {
  useEffect(() => {
    if (REGISTRATION_ENDPOINT) {
      window.location.replace(REGISTRATION_ENDPOINT)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
      <div>
        <img src="/logo.png" alt="" className="mx-auto mb-4 h-20 w-20 object-contain" />
        <p className="text-[16px] text-ink-soft">Opening the admin dashboard…</p>
        {REGISTRATION_ENDPOINT && (
          <a href={REGISTRATION_ENDPOINT} className="btn-primary mt-5 inline-flex">
            Continue to admin →
          </a>
        )}
      </div>
    </div>
  )
}
