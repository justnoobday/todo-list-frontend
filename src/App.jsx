import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'

function Home() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="card text-center">
        <h1 className="text-3xl font-bold">Welcome to TodoX</h1>
        <p className="text-gray-600 mt-2">Simple Todo app with Auth + Refresh Token flow.</p>
        <div className="mt-4">
          <a className="btn-primary" href="/tasks">Go to Tasks</a>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="border-t text-center text-xs text-gray-500 py-4">
          Built with React + Axios + React Router + Tailwind
        </footer>
      </div>
    </AuthProvider>
  )
}
