import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Home' },
  { to: '/inventory', label: '📦 Inventory' },
  { to: '/upload', label: '🎙️ Voice Upload' },
  { to: '/bulk-orders', label: '🤝 Bulk Orders' },
]

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-3 flex items-center gap-6 shadow-md">
      <span className="font-bold text-lg tracking-tight mr-4">🏪 SpazaStream AI</span>
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end
          className={({ isActive }) =>
            `text-sm font-medium hover:text-green-200 transition-colors ${isActive ? 'underline underline-offset-4' : ''}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
