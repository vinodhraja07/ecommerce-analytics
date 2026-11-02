import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package, Users, BarChart3, FileText, Settings,
  ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, AlertTriangle, Store, Truck
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { logout } = useAuth()
  const loc = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: open ? 260 : 72 }}
        className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 z-50 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <motion.span animate={{ opacity: open ? 1 : 0 }} className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NexusSales
          </motion.span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {nav.map((item) => {
            const active = loc.pathname === item.to
            return (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                )}>
                <item.icon className="w-5 h-5 shrink-0" />
                <motion.span animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }} className="whitespace-nowrap overflow-hidden">{item.label}</motion.span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full">
            <Truck className="w-5 h-5 shrink-0" />
            <motion.span animate={{ opacity: open ? 1 : 0 }} className="whitespace-nowrap">Logout</motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 lg:hidden flex flex-col"
          >
            <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">NexusSales</span>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1">
              {nav.map((item) => {
                const active = loc.pathname === item.to
                return (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                    className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                      active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400')}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full">
                <Truck className="w-5 h-5" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
