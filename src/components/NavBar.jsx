import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Todo<span className="text-blue-600">X</span></Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavLink to="/tasks" className="link">Tasks</NavLink>
              <span className="text-sm text-gray-600">Hi, {user?.user?.username || user?.username}</span>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="link">Login</NavLink>
              <NavLink to="/register" className="link">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
