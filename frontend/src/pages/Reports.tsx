import { useState } from 'react'
import { getReportsSales, exportReportSales } from '@/services/api'
import { cn } from '@/utils/cn'

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [data, setData] = useState<any[]>([])
  const [exporting, setExporting] = useState(false)

  const load = async () => {
    const params: any = {}
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    if (category) params.category = category
    if (region) params.region = region
    const { data } = await getReportsSales(params)
    setData(data)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params: any = { export: 'true' }
      if (dateFrom) params.date_from = dateFrom
      if (dateTo) params.date_to = dateTo
      if (category) params.category = category
      if (region) params.region = region
      const { data } = await exportReportSales(params)
      // Trigger download via blob would go here
      console.log('Export data:', data)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none">
          <option value="">All Categories</option>
          <option>Electronics</option><option>Fashion</option><option>Home & Furniture</option><option>Beauty</option><option>Sports</option><option>Accessories</option>
        </select>
        <select value={region} onChange={e => setRegion(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none">
          <option value="">All Regions</option>
          <option>Mumbai</option><option>Delhi</option><option>Bangalore</option><option>Chennai</option><option>Hyderabad</option>
        </select>
        <button onClick={load} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">Apply Filters</button>
        <button onClick={handleExport} disabled={exporting} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium">Export CSV</button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Customer</th><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Region</th><th className="p-4">Quantity</th><th className="p-4">Revenue</th>
            </tr></thead>
            <tbody>
              {data.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-900">
                  <td className="p-4 font-medium">{s.order_id}</td>
                  <td className="p-4">{s.date}</td>
                  <td className="p-4">{s.customer}</td>
                  <td className="p-4">{s.product}</td>
                  <td className="p-4">{s.category}</td>
                  <td className="p-4">{s.region}</td>
                  <td className="p-4">{s.quantity}</td>
                  <td className="p-4 font-bold">₹{s.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
