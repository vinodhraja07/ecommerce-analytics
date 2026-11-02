import { useState, useEffect } from 'react'
import { getCustomers, getCustomerOrders } from '@/services/api'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export default function Customers() {
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const navigate = useNavigate()

  const load = async () => {
    const { data } = await getCustomers({ search })
    setData(data)
  }
  useEffect(() => { load() }, [search])

  const viewOrders = async (id: number) => {
    const { data } = await getCustomerOrders(id)
    setOrders(data)
    setSelected(data[0] ? { id, name: '', email: '', phone: '', location: '', order_count: 0, total_spent: 0, last_purchase: '', orders: data } : null)
    // Fetch customer details
    const c = data.find((o: any) => o)
    navigate(`/customers/${id}`)
  }

  return (
    <div className="space-y-4">
      <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="p-4">Customer</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Location</th><th className="p-4">Orders</th><th className="p-4">Total Spent</th><th className="p-4">Last Purchase</th>
            </tr></thead>
            <tbody>
              {data.map((c: any) => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-slate-500">{c.email}</td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.location}</td>
                  <td className="p-4">{c.order_count}</td>
                  <td className="p-4 font-bold">₹{(c.total_spent || 0).toLocaleString()}</td>
                  <td className="p-4 text-slate-500">{c.last_purchase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
