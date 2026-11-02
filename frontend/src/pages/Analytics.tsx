import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { getAnalyticsRevenue, getAnalyticsCategories, getAnalyticsProducts, getAnalyticsRegions, getAnalyticsCustomers } from '@/services/api'
import { cn } from '@/utils/cn'

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4']

export default function Analytics() {
  const [period, setPeriod] = useState('30d')
  const [revenue, setRevenue] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [regions, setRegions] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      getAnalyticsRevenue(period).then(r => setRevenue(r.data)),
      getAnalyticsCategories(period).then(r => setCategories(r.data)),
      getAnalyticsProducts(period).then(r => setProducts(r.data)),
      getAnalyticsRegions(period).then(r => setRegions(r.data)),
      getAnalyticsCustomers(period).then(r => setCustomers(r.data)),
    ])
  }, [period])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['7d','30d','3m','year'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition',
              period===p ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400')}>
            {p==='7d'?'7 Days':p==='30d'?'30 Days':p==='3m'?'3 Months':'This Year'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categories} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={products.slice(0,8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Regions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="region" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
