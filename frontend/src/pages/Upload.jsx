import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getShops, uploadVoiceNote } from '../lib/api'

export default function Upload() {
  const { data: shops = [] } = useQuery({ queryKey: ['shops'], queryFn: getShops })
  const [shopId, setShopId] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!shopId || !file) return
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await uploadVoiceNote(shopId, file)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  const langLabel = { zu: 'Zulu', xh: 'Xhosa', st: 'Sotho', en: 'English' }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-800">🎙️ Upload Voice Note</h1>
      <p className="text-gray-500 text-sm mb-6">
        Record a short voice note describing what you bought or what's running low.
        Supports Zulu, Xhosa, Sotho, and English.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={shopId}
            onChange={e => setShopId(e.target.value)}
            required
          >
            <option value="">— Select your shop —</option>
            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Audio File (.wav / .mp3 / .m4a)</label>
          <input
            type="file"
            accept="audio/*"
            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-700 file:text-white file:cursor-pointer"
            onChange={e => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing…' : 'Upload & Process'}
        </button>
      </form>

      {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">{error}</div>}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 border rounded p-4">
            <p className="text-xs text-gray-400 mb-1">
              Transcript · <span className="font-medium">{langLabel[result.language] ?? result.language}</span>
            </p>
            <p className="text-gray-800 italic">"{result.transcript}"</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Extracted Items</p>
            <div className="space-y-2">
              {result.entities.map((e, i) => (
                <div key={i} className="flex items-center justify-between bg-white border rounded px-4 py-2 text-sm">
                  <span className="font-medium">{e.item} {e.brand ? `(${e.brand})` : ''}</span>
                  <span className="text-gray-500">{e.quantity} {e.unit}</span>
                  {e.low_stock && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">LOW</span>}
                  {e.price_paid && <span className="text-green-700 font-medium">R{e.price_paid}</span>}
                </div>
              ))}
            </div>
          </div>

          {result.bulk_orders_triggered > 0 && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded p-3 text-sm font-medium">
              🤝 {result.bulk_orders_triggered} new bulk order{result.bulk_orders_triggered > 1 ? 's' : ''} triggered!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
