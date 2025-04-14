'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await login(email, password)
      router.push('/')
    } catch (error) {
      setError('Invalid email or password')
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="max-w-md w-full p-6 bg-black/50 rounded-xl border border-gray-800 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login to UpcharSaathi</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-black/30 text-white px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-500/20"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-black/30 text-white px-3 py-2 focus:border-teal-500 focus:ring focus:ring-teal-500/20"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-black hover:bg-black/90 transition-all duration-300
              shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]
              border border-white/20 hover:border-white/30 rounded-xl hover:scale-105"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-teal-400 hover:text-teal-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}