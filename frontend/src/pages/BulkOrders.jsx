import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBulkOrders, getDeliveryRoute } from '../lib/api'

function RouteModal({ orderId, onClose }) {
  const { data: route = [], isLoading } = useQuery({
    queryKey: ['route', orderId],
    queryFn: () => getDeliveryRoute(orderId),
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-green-800">🚚 Delivery Route</h2>
        {isLoading ? <p className="text-gray-400">Loading…</p> : (
          <ol className="space-y-2">
            {route.map((shop, i) => (
              <li key={shop.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-700 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <div>
                  <p className="font-medium text-sm">{shop.name}</p>
                  <p className="text-xs text-gray-400">{shop.location} · {shop.lat?.toFixed(4)}, {shop.lng?.toFixed(4)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        <button onClick={onClose} className="mt-5 w-full border rounded py-1.5 text-sm text-gray-600 hover:bg-gray-50">Close</button>
      </div>
    </div>
  )
}

export default function BulkOrders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['bulk-orders'],
    queryFn: getBulkOrders,
    refetchInterval: 30000,
  })
  const [routeId, setRouteId] = useState(null)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-green-800">🤝 Bulk Orders</h1>
      <p className="text-gray-500 text-sm mb-6">
        Automatically created when 3+ shops report the same item as low-stock.
      </p>

      {isLoading && <p className="text-gray-400">Loading…</p>}

      {!isLoading && orders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>No pending bulk orders yet.</p>
          <p className="text-sm mt-1">They appear when 3+ shops flag the same item as low-stock.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {orders.map(order => (
          <div key={order.id} className="bg-white border rounded-xl shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-800">{order.item}</p>
                {order.brand && <p className="text-sm text-gray-500">{order.brand}</p>}
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                -{order.discount_pct}% OFF
              </span>
            </div>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>📦 {order.total_quantity} units pooled</span>
              <span>🏪 {order.participating_shops?.length} shops</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>{order.status}</span>
              <button
                onClick={() => setRouteId(order.id)}
                className="text-xs text-green-700 underline hover:text-green-900"
              >
                View delivery route →
              </button>
            </div>
          </div>
        ))}
      </div>

      {routeId && <RouteModal orderId={routeId} onClose={() => setRouteId(null)} />}
    </div>
  )
}
