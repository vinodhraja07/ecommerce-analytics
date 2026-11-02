import { useState, useEffect } from 'react'
import { getSettings, updateSetting } from '@/services/api'
import { motion } from 'framer-motion'

export default function Settings() {
  const [settings, setSettings] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { getSettings().then(r => setSettings(r.data)) }, [])

  const save = async (key: string, value: string) => {
    setSaving(true)
    await updateSetting(key, value)
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Store Settings</h2>
        <div className="space-y-4">
          {Object.entries(settings).map(([key, val]: any) => (
            <div key={key}>
              <label className="text-sm font-medium capitalize">{key.replace('_', ' ')}</label>
              <div className="flex gap-2 mt-1">
                <input value={val || ''} onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={() => save(key, settings[key])} disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-2">About</h2>
        <p className="text-sm text-slate-500">NexusSales v1.0.0 — E-Commerce Sales Analytics Platform</p>
        <p className="text-sm text-slate-500">No external API key required. Built with FastAPI + React + SQLite.</p>
      </div>
    </div>
  )
}
