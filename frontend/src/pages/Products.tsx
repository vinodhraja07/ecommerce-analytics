import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/api'
import { cn } from '@/utils/cn'

export default function Products() {
  const [data, setData] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [stockStatus, setStockStatus] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', category: '', price: 0, stock: 0 })

  const load = async () => {
    const { data } = await getProducts({ search, category, stock_status: stockStatus })
    setData(data)
  }
  useEffect(() => { load() }, [search, category, stockStatus])

  const handleSave = async () => {
    const payload = { ...form, price: +form.price, stock: +form.stock }
    if (editing) await updateProduct(editing.id, payload)
    else await createProduct(payload)
    setModal(false)
    setEditing(null)
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
          <select value={stockStatus} onChange={e => setStockStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none">
            <option value="">All Status</option>
            <option>Healthy</option><option>Low Stock</option><option>Out of Stock</option>
          </select>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', category: '', price: 0, stock: 0 }); setModal(true) }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium">+ Add Product</button>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4">Revenue</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody>
              {data.map((p: any) => (
                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">₹{p.price.toLocaleString()}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs',
                      p.stock_status === 'Healthy' ? 'bg-green-100 text-green-700' :
                      p.stock_status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
                      {p.stock_status}
                    </span>
                  </td>
                  <td className="p-4 font-bold">₹{(p.revenue || 0).toLocaleString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setEditing(p); setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock }); setModal(true) }} className="text-indigo-600 text-sm">Edit</button>
                    <button onClick={async () => { if(confirm('Delete?')) { await deleteProduct(p.id); load() }}} className="text-red-500 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-950 rounded-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
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
