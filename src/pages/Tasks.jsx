import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '' })

  async function fetchTasks() {
    setError('')
    try {
      const { data } = await api.get('/api/tasks')
      setTasks(data?.tasks || data || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Gagal mengambil tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const createTask = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/tasks', form)
      const task = data?.task || data
      setTasks((prev) => [task, ...prev])
      setForm({ title: '', description: '' })
    } catch (e) {
      alert(e?.response?.data?.message || 'Gagal membuat task')
    }
  }

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      const { data } = await api.put(`/api/tasks/${task.id}`, { status: newStatus })
      const updated = data?.task || { ...task, status: newStatus }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch (e) {
      alert('Gagal update task')
    }
  }

  const removeTask = async (task) => {
    if (!confirm('Hapus task ini?')) return
    try {
      await api.delete(`/api/tasks/${task.id}`)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch (e) {
      alert('Gagal menghapus task')
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Buat Task</h2>
            <form onSubmit={createTask} className="space-y-3">
              <div>
                <label className="label">Title</label>
                <input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows="3" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
              </div>
              <button className="btn-primary w-full">Create</button>
            </form>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button className="btn-secondary" onClick={fetchTasks}>Refresh</button>
            </div>
            {loading ? (
              <div>Loading tasks...</div>
            ) : error ? (
              <div className="text-red-600 text-sm">{error}</div>
            ) : (
              <ul className="space-y-3">
                {tasks?.length === 0 && <li className="text-gray-500">Belum ada task.</li>}
                {tasks?.map((t) => (
                  <li key={t.id} className="p-4 rounded-xl border flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-600">{t.description}</div>
                      <div className="text-xs mt-1">Status: <span className={t.status==='completed'?'text-green-600':'text-yellow-700'}>{t.status}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary" onClick={()=>toggleStatus(t)}>
                        {t.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                      </button>
                      <button className="btn bg-red-600 text-white" onClick={()=>removeTask(t)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
