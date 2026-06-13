'use client'

import React, { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/payload/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || 'Login failed')
      }

      setCurrentUser({
        email: data.user.email,
        role: data.user.role,
      })
      setMessage('Successfully logged in!')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/payload/users/logout', {
        method: 'POST',
      })
      setCurrentUser(null)
      setMessage('Successfully logged out')
    } catch (err: any) {
      setError(err.message || 'Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-950 text-white font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-white font-heading">
          Sign in
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Access your UNNES Board account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-4 shadow-xl border border-zinc-800 sm:rounded-2xl sm:px-10">
          {!currentUser ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="you@unnes.ac.id"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              {message && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-lg text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-zinc-950 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3">
                <div>
                  <span className="block text-xs text-zinc-400 uppercase tracking-wider font-semibold">Logged in as</span>
                  <span className="text-white font-medium">{currentUser.email}</span>
                </div>
                <div>
                  <span className="block text-xs text-zinc-400 uppercase tracking-wider font-semibold">Role</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400 capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-700">
                  {currentUser.role === 'admin' || currentUser.role === 'moderator' ? (
                    <div className="text-emerald-400 font-bold text-sm">Can create updates</div>
                  ) : (
                    <div className="text-zinc-400 font-medium text-sm">Read only access</div>
                  )}
                </div>
              </div>

              {message && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-lg text-sm">
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                  <a
                    href="/admin"
                    className="w-full flex justify-center py-2.5 px-4 border border-zinc-700 hover:border-zinc-600 rounded-lg shadow-sm text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-all text-center"
                  >
                    Go to Admin Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-zinc-950 bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <a href="/portal/register" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
              Don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
