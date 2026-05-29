import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Ticket, PlusCircle, Menu, X, LogOut } from "lucide-react"
import { logout } from "../utils/auth"

const navItems = [
  { to: "/tickets", label: "All Tickets", icon: Ticket, end: true },
  { to: "/tickets/new", label: "New Ticket", icon: PlusCircle, end: true },
]

function NavLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col justify-between bg-gray-900 p-4">
        <div>
          <span className="px-3 py-2 text-xl font-bold text-white block">SupportCRM</span>
          <div className="mt-6">
            <NavLinks />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors w-full mt-auto text-left cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </aside>

      {/* Mobile top navbar */}
      <header className="md:hidden bg-gray-900">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xl font-bold text-white">SupportCRM</span>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            className="rounded-md p-1 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-gray-800 px-4 pb-4 pt-2 flex flex-col gap-2">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  )
}
