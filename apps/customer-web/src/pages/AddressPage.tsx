import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addressApi, type AddressItem } from '../services/address'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

export default function AddressPage() {
  const { t } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    receiverName: '', phone: '', country: 'JP', province: '', city: '', detail: '', postalCode: '', isDefault: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchAddresses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await addressApi.getAddresses()
      if (res.data.code === 200) setAddresses(res.data.data)
    } catch {
      setError('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchAddresses()
  }, [token])

  const resetForm = () => {
    setForm({ receiverName: '', phone: '', country: 'JP', province: '', city: '', detail: '', postalCode: '', isDefault: false })
    setFormErrors({})
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (addr: AddressItem) => {
    setForm({
      receiverName: addr.receiverName,
      phone: addr.phone,
      country: addr.country || 'JP',
      province: addr.province,
      city: addr.city,
      detail: addr.detail,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    })
    setEditingId(addr.id)
    setShowForm(true)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.receiverName.trim()) errs.receiverName = 'Required'
    if (!form.phone.trim()) errs.phone = 'Required'
    if (!form.province.trim()) errs.province = 'Required'
    if (!form.city.trim()) errs.city = 'Required'
    if (!form.detail.trim()) errs.detail = 'Required'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editingId) {
        const res = await addressApi.updateAddress(editingId, form)
        if (res.data.code === 200) {
          await fetchAddresses()
          resetForm()
        }
      } else {
        const res = await addressApi.createAddress(form)
        if (res.data.code === 200) {
          await fetchAddresses()
          resetForm()
        }
      }
    } catch {
      setFormErrors({ _form: 'Save failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await addressApi.deleteAddress(id)
      await fetchAddresses()
    } catch {
      // ignore
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const res = await addressApi.setDefault(id)
      if (res.data.code === 200) await fetchAddresses()
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold">Addresses</h1>
      </header>

      {showForm ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            <InputField label="Receiver Name" value={form.receiverName} onChange={(v) => setForm({ ...form, receiverName: v })} error={formErrors.receiverName} />
            <InputField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={formErrors.phone} />
            <InputField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <InputField label="Province / State" value={form.province} onChange={(v) => setForm({ ...form, province: v })} error={formErrors.province} />
            <InputField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} error={formErrors.city} />
            <InputField label="Detail Address" value={form.detail} onChange={(v) => setForm({ ...form, detail: v })} error={formErrors.detail} placeholder="Street, building, floor, etc." />
            <InputField label="Postal Code" value={form.postalCode} onChange={(v) => setForm({ ...form, postalCode: v })} />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              Set as default address
            </label>

            {formErrors._form && <p className="text-red-500 text-xs">{formErrors._form}</p>}

            <div className="flex gap-2 pt-2">
              <button onClick={resetForm} className="flex-1 py-3 border border-gray-300 rounded-lg text-sm text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-red-500 text-sm">{error}</p>
              <button onClick={fetchAddresses} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Retry</button>
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
              <span className="text-4xl">📍</span>
              <p className="text-sm">No addresses yet</p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{addr.receiverName}</span>
                        <span className="text-xs text-gray-500">{addr.phone}</span>
                        {addr.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {[addr.country, addr.province, addr.city, addr.detail].filter(Boolean).join(', ')}
                      </p>
                      {addr.postalCode && <p className="text-xs text-gray-400">{addr.postalCode}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t">
                    <button onClick={() => openEdit(addr)} className="text-xs text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-500">Delete</button>
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-gray-500 ml-auto">Set Default</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {!showForm && (
        <div className="bg-white border-t p-4">
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm"
          >
            + Add Address
          </button>
        </div>
      )}

      <BottomNav navigate={navigate} t={t} />
    </div>
  )
}

function InputField({ label, value, onChange, error, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

function BottomNav({ navigate, t }: { navigate: (path: string) => void; t: (key: string) => string }) {
  return (
    <nav className="bg-white border-t flex items-center justify-around py-2">
      {[
        { label: t('customer.home') || 'Home', path: '/' },
        { label: t('customer.categories') || 'Categories', path: '/categories' },
        { label: t('customer.cart') || 'Cart', path: '/cart' },
        { label: t('customer.orders') || 'Orders', path: '/orders' },
        { label: t('customer.profile') || 'Profile', path: '/profile' },
      ].map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center text-xs text-gray-500"
        >
          <span className="text-lg mb-0.5">●</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
