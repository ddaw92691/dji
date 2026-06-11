import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import type { LocaleEntry } from '../i18n/config'

function GlobeIcon() {
  return (
    <svg className="h-[14px] w-[14px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm5.7-10a7 7 0 0 0-1.4-3.7h-2.1c.3 1.1.5 2.4.6 3.7h2.9Zm-4.8 0a18 18 0 0 0-.6-3.7h-.6a18 18 0 0 0-.6 3.7h1.8Zm-3.7 0c.1-1.3.3-2.6.6-3.7H7.7A7 7 0 0 0 6.3 11h2.9Zm-2.9 2a7 7 0 0 0 1.4 3.7h2.1A17 17 0 0 1 9.2 13H6.3Zm4.8 0c.1 1.4.3 2.6.6 3.7h.6c.3-1.1.5-2.3.6-3.7h-1.8Zm3.7 0c-.1 1.4-.3 2.6-.6 3.7h2.1a7 7 0 0 0 1.4-3.7h-2.9Z" />
    </svg>
  )
}

interface Props {
  variant?: 'pill' | 'plain'
  buttonClassName?: string
  onChanged?: () => void
}

export default function LanguageSelector({ variant = 'pill', buttonClassName = '', onChanged }: Props) {
  const { locale, locales, regions, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

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

  const grouped = useMemo(() => {
    return regions
      .map((region) => ({ region, items: locales.filter((l) => l.region === region) }))
      .filter((g) => g.items.length > 0)
  }, [locales, regions])

  const choose = (l: LocaleEntry) => {
    setLocale(l)
    setOpen(false)
    onChanged?.()
  }

  const triggerCls =
    variant === 'pill'
      ? `inline-flex h-8 items-center gap-2 rounded-full px-4 text-[13px] font-normal transition-colors ${buttonClassName}`
      : `inline-flex items-center gap-2 text-[13px] ${buttonClassName}`

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t('website.region.select')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={triggerCls}
      >
        <GlobeIcon />
        <span className="whitespace-nowrap">{locale.country}</span>
        <span className="opacity-60">{locale.language}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-[60] mt-2 max-h-[70vh] w-[300px] max-w-[88vw] overflow-y-auto rounded-xl bg-white p-2 text-left text-[#1f1f1f] shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
        >
          {grouped.map((group) => (
            <div key={group.region} className="mb-1">
              <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                {group.region}
              </div>
              {group.items.map((l) => {
                const active = l.id === locale.id
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(l)}
                    className={[
                      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors',
                      active ? 'bg-[#eef4ff] font-medium text-[#0a84ff]' : 'hover:bg-[#f5f5f5]',
                    ].join(' ')}
                  >
                    <span className="truncate">{l.country}</span>
                    <span className={active ? 'shrink-0 text-[#0a84ff]' : 'shrink-0 text-[#888]'}>{l.language}</span>
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
