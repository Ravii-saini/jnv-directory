import { useEffect, useState } from 'react'
import { getAlumniWhatsAppLink, getBatchWhatsAppLink } from '../firebase/appConfig'
import { ACTIVE_BATCH } from '../types'

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.76 13.33L3 21l3.77-1.24a8.93 8.93 0 0 0 5.28 1.7h.01a8.94 8.94 0 0 0 6.32-15.14ZM12.06 20a7.4 7.4 0 0 1-3.79-1.04l-.27-.16-2.83.93.93-2.75-.18-.28A7.44 7.44 0 1 1 19.5 12.5 7.42 7.42 0 0 1 12.06 20Zm4.08-5.56c-.22-.11-1.3-.64-1.5-.72s-.35-.11-.5.11-.57.72-.7.87-.26.17-.48.06a6.1 6.1 0 0 1-1.79-1.1 6.7 6.7 0 0 1-1.24-1.54c-.13-.22 0-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37a.4.4 0 0 0 0-.39c-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43a.82.82 0 0 0-.6.28 2.5 2.5 0 0 0-.78 1.86 4.34 4.34 0 0 0 .91 2.3 9.94 9.94 0 0 0 3.8 3.36c.53.23.94.36 1.26.47a3 3 0 0 0 1.39.09 2.28 2.28 0 0 0 1.5-1.06 1.87 1.87 0 0 0 .13-1.06c-.06-.1-.2-.16-.42-.27Z" />
    </svg>
  )
}

export default function WhatsAppButtons({ compact = false }: { compact?: boolean }) {
  const [batchLink, setBatchLink] = useState<string | null>(null)
  const [alumniLink, setAlumniLink] = useState<string | null>(null)

  useEffect(() => {
    getBatchWhatsAppLink(ACTIVE_BATCH).then(setBatchLink)
    getAlumniWhatsAppLink().then(setAlumniLink)
  }, [])

  const openOrCopy = async (link: string, label: string) => {
    const win = window.open(link, '_blank', 'noopener,noreferrer')
    if (!win) {
      try {
        await navigator.clipboard.writeText(link)
        alert(`Couldn't open WhatsApp automatically. ${label} link copied — paste it in your browser.`)
      } catch {
        prompt(`Copy this ${label} link:`, link)
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', gap: 10 }}>
      <button
        type="button"
        className="btn"
        style={{ background: '#25D366', color: '#04210f' }}
        onClick={() => batchLink && openOrCopy(batchLink, 'Batch group')}
      >
        <WhatsAppIcon />
        Join {ACTIVE_BATCH} WhatsApp Group
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => alumniLink && openOrCopy(alumniLink, 'JNV Alumni group')}
      >
        <WhatsAppIcon />
        Join JNV Alumni WhatsApp Group
      </button>
    </div>
  )
}
