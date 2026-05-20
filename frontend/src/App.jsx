import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import BulkOrders from './pages/BulkOrders'

const qc = new QueryClient()

function Layout() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {!isLanding && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/inventory" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/bulk-orders" element={<BulkOrders />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
