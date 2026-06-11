import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18nStore } from '../stores/i18nStore'
import type { LocaleEntry } from '../i18n/config'

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm5.7-10a7 7 0 0 0-1.4-3.7h-2.1c.3 1.1.5 2.4.6 3.7h2.9Zm-4.8 0a18 18 0 0 0-.6-3.7h-.6a18 18 0 0 0-.6 3.7h1.8Zm-3.7 0c.1-1.3.3-2.6.6-3.7H7.7A7 7 0 0 0 6.3 11h2.9Zm-2.9 2a7 7 0 0 0 1.4 3.7h2.1A17 17 0 0 1 9.2 13H6.3Zm4.8 0c.1 1.4.3 2.6.6 3.7h.6c.3-1.1.5-2.3.6-3.7h-1.8Zm3.7 0c-.1 1.4-.3 2.6-.6 3.7h2.1a7 7 0 0 0 1.4-3.7h-2.9Z" />
    </svg>
  )
}

export default function LanguageSelector({ onChanged }: { onChanged?: () => void }) {
  const { localeId, locales, regions, setLocaleById } = useI18nStore()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = useMemo(() => locales.find((l) => l.id === localeId), [locales, localeId])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const grouped = useMemo(
    () =>
      regions
        .map((region) => ({ region, items: locales.filter((l) => l.region === region) }))
        .filter((g) => g.items.length > 0),
    [locales, regions],
  )

  const choose = (l: LocaleEntry) => {
    setLocaleById(l.id)
    setOpen(false)
    onChanged?.()
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none',
          border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0,
        }}
      >
        <GlobeIcon />
        <span>{current ? `${current.country} (${current.language})` : 'Region'}</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', right: 0, top: '100%', marginTop: 8, zIndex: 1000,
            width: 300, maxWidth: '88vw', maxHeight: '70vh', overflowY: 'auto',
            background: '#fff', color: '#1f1f1f', borderRadius: 12, padding: 8,
            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
          }}
        >
          {grouped.map((group) => (
            <div key={group.region} style={{ marginBottom: 4 }}>
              <div style={{ padding: '8px 12px 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#999' }}>
                {group.region}
              </div>
              {group.items.map((l) => {
                const active = l.id === localeId
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(l)}
                    style={{
                      display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                      gap: 12, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontSize: 13, background: active ? '#eef4ff' : 'transparent',
                      color: active ? '#0a84ff' : '#1f1f1f', fontWeight: active ? 600 : 400, textAlign: 'left',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.country}</span>
                    <span style={{ flexShrink: 0, color: active ? '#0a84ff' : '#888' }}>{l.language}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
