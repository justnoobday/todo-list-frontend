import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [username, setUsername] = useState('john_doe')
  const [email, setEmail] = useState('john@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await register(username, email, password)
      navigate('/tasks')
    } catch (err) {
      setError(err?.response?.data?.message || 'Register gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input className="input" value={username} onChange={e=>setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Sudah punya akun? <Link className="link" to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
