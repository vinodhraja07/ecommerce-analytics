import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  DollarSign, ShoppingCart, Users, TrendingUp, Package, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { getKpis, getRevenue, getCategories, getTopProducts, getRecentOrders, getInsights, getInventoryAlerts } from '@/services/api'
import { cn } from '@/utils/cn'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

export default function Dashboard() {
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<any>(null)
  const [revenue, setRevenue] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [inventory, setInventory] = useState<any>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [k, r, c, t, o, i, inv] = await Promise.all([
        getKpis(period), getRevenue(period), getCategories(period),
        getTopProducts(period), getRecentOrders(10), getInsights(period), getInventoryAlerts()
      ])
      setKpis(k.data)
      setRevenue(r.data)
      setCategories(c.data)
      setTopProducts(t.data)
      setOrders(o.data)
      setInsights(i.data)
      setInventory(inv.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [period])

  const cardStyle = "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"

  return (
    <div className="space-y-6">
      {/* Period filter */}
      <div className="flex gap-2 flex-wrap">
        {['today','7d','30d','3m','year'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition',
              period === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800')}>
            {p === 'today' ? 'Today' : p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '3m' ? '3 Months' : 'This Year'}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className={cn(cardStyle, 'h-28 animate-pulse bg-slate-100 dark:bg-slate-900')} />)}
        </div>
      ) : kpis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: `₹${kpis.total_revenue.toLocaleString()}`, change: kpis.revenue_change, icon: DollarSign },
            { label: 'Total Orders', value: kpis.total_orders, change: kpis.orders_change, icon: ShoppingCart },
            { label: 'Customers', value: kpis.total_customers, change: kpis.customers_change, icon: Users },
            { label: 'Avg Order Value', value: `₹${kpis.avg_order_value.toLocaleString()}`, change: kpis.aov_change, icon: TrendingUp },
          ].map((k, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={cardStyle}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{k.label}</span>
                <k.icon className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold">{k.value}</p>
              <div className={cn('flex items-center gap-1 text-sm mt-1', k.change >= 0 ? 'text-green-600' : 'text-red-500')}>
                {k.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(k.change)}%
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Revenue Chart + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={cn(cardStyle, 'lg:col-span-2')}>
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          {loading ? <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" /> :
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          }
        </div>
        <div className={cardStyle}>
          <h3 className="font-semibold mb-4">Categories</h3>
          {loading ? <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" /> :
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categories} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                  {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          }
        </div>
      </div>

      {/* Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cardStyle}>
          <h3 className="font-semibold mb-4">Top Products</h3>
          {loading ? <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" /> : (
            <div className="space-y-3">
              {topProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.category} · {p.units_sold} sold</p>
                  </div>
                  <span className="text-sm font-bold">₹{p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={cardStyle}>
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          {loading ? <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2">Order</th><th className="pb-2">Customer</th><th className="pb-2">Revenue</th><th className="pb-2">Status</th>
                </tr></thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} className="border-b border-slate-50 dark:border-slate-900">
                      <td className="py-2 font-medium">{o.order_id}</td>
                      <td className="py-2">{o.customer_name}</td>
                      <td className="py-2">₹{o.revenue.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs',
                          o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Smart Insights */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold">Smart Insights</h3>
        </div>
        {loading ? <div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-lg" /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {insights.map((ins: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className={cn('p-3 rounded-xl border',
                  ins.type === 'positive' ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' :
                  ins.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20' :
                  'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800')}>
                <p className="text-xs font-medium mb-1">{ins.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{ins.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory Alerts */}
      {inventory && (
        <div className={cn(cardStyle, 'flex flex-wrap gap-6')}>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{inventory.healthy}</p>
              <p className="text-xs text-slate-500">Healthy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{inventory.low_stock}</p>
              <p className="text-xs text-slate-500">Low Stock</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{inventory.out_of_stock}</p>
              <p className="text-xs text-slate-500">Out of Stock</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
