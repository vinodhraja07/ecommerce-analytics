import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSales, createSale, updateSale, deleteSale } from '@/services/api'
import { cn } from '@/utils/cn'

export default function Sales() {
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ order_id: '', customer_id: 1, product_id: 1, date: new Date().toISOString().slice(0,10), quantity: 1, price: 0, category: '', region: '' })

  const load = async () => {
    const params: any = { search, category, region }
    const { data } = await getSales(params)
    setData(data)
  }
  useEffect(() => { load() }, [search, category, region])

  const handleSave = async () => {
    const payload = { ...form, quantity: +form.quantity, price: +form.price }
    if (editing) await updateSale(editing.id, payload)
    else await createSale(payload)
    setModal(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this sale?')) return
    await deleteSale(id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
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
        </div>
        <button onClick={() => { setEditing(null); setForm({ order_id: '', customer_id: 1, product_id: 1, date: new Date().toISOString().slice(0,10), quantity: 1, price: 0, category: '', region: '' }); setModal(true) }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium">+ Add Sale</button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Product</th><th className="p-4">Qty</th><th className="p-4">Revenue</th><th className="p-4">Date</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody>
              {data.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  <td className="p-4 font-medium">{s.order_id}</td>
                  <td className="p-4">{s.customer_name}</td>
                  <td className="p-4">{s.product_name}</td>
                  <td className="p-4">{s.quantity}</td>
                  <td className="p-4 font-bold">₹{s.revenue.toLocaleString()}</td>
                  <td className="p-4 text-slate-500">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setEditing(s); setForm({ ...s, date: s.date.slice(0,10) }); setModal(true) }} className="text-indigo-600 text-sm">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-950 rounded-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Sale' : 'Add Sale'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Order ID" value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="Customer ID" value={form.customer_id} onChange={e => setForm({...form, customer_id: +e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="Product ID" value={form.product_id} onChange={e => setForm({...form, product_id: +e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Region" value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
