import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getShops, getInventory } from '../lib/api'

export default function Dashboard() {
  const { data: shops = [] } = useQuery({ queryKey: ['shops'], queryFn: getShops, refetchInterval: 30000 })
  const [shopId, setShopId] = useState('')

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory', shopId],
    queryFn: () => getInventory(shopId),
    enabled: !!shopId,
    refetchInterval: 30000,
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-800">📦 Inventory</h1>

      <select
        className="border border-gray-300 rounded px-3 py-2 mb-6 w-full max-w-xs"
        value={shopId}
        onChange={e => setShopId(e.target.value)}
      >
        <option value="">— Select a shop —</option>
        {shops.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
      </select>

      {isLoading && <p className="text-gray-500">Loading…</p>}

      {inventory.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                {['Item', 'Brand', 'Qty', 'Unit', 'Price Paid', 'Low Stock', 'Updated'].map(h => (
                  <th key={h} className="px-4 py-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b ${row.low_stock ? 'bg-red-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-2 font-medium">{row.item}</td>
                  <td className="px-4 py-2 text-gray-600">{row.brand ?? '—'}</td>
                  <td className="px-4 py-2">{row.quantity}</td>
                  <td className="px-4 py-2 text-gray-500">{row.unit}</td>
                  <td className="px-4 py-2">{row.price_paid ? `R${row.price_paid}` : '—'}</td>
                  <td className="px-4 py-2">
                    {row.low_stock
                      ? <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">LOW</span>
                      : <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">OK</span>}
                  </td>
                  <td className="px-4 py-2 text-gray-400 text-xs">{row.updated_at?.slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shopId && !isLoading && inventory.length === 0 && (
        <p className="text-gray-400 mt-4">No inventory yet. Upload a voice note to get started.</p>
      )}
    </div>
  )
}
