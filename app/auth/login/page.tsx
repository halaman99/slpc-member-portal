'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmail } from '@/lib/auth'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter your email and password')
        setLoading(false)
        return
      }

      // Trim whitespace
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedPassword = password.trim()

      console.log('Attempting login with email:', trimmedEmail)

      // Sign in with email and password
      const { data, error: authError } = await signInWithEmail(trimmedEmail, trimmedPassword)

      if (authError) {
        console.error('Auth error response:', authError)
        // Handle specific Supabase errors
        const errorMsg = authError.message?.toLowerCase() || ''
        if (errorMsg.includes('email_not_confirmed')) {
          setError('Please confirm your email before signing in. Check your inbox for the confirmation link.')
        } else if (errorMsg.includes('invalid_credentials') || errorMsg.includes('incorrect') || errorMsg.includes('invalid')) {
          setError('Invalid email or password. Please try again.')
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          setError('Network error. Please check your connection and try again.')
        } else {
          setError(authError.message || 'Failed to sign in. Please try again.')
        }
        setLoading(false)
        return
      }

      // Check if session was created
      if (data?.session?.user) {
        console.log('Login successful, user ID:', data.session.user.id)
        // Session created successfully - redirect immediately
        // The AuthContext will update and trigger the redirect
        router.push('/dashboard')
        return
      }

      console.warn('Login completed but no session user found')
      setError('Login failed. Please try again.')
      setLoading(false)
    } catch (err: any) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-[#f5f0e8]">Welcome back</h2>
        <p className="text-sm text-[#8a6070]">Sign in to your account to continue</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#3a1010] border border-[#c95a5a] rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#c95a5a] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#e8dcc8]">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Input */}
        <div>
          <label className="block text-xs font-medium text-[#b8ada0] mb-2">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-[#8a6070]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.15)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#f5f0e8] placeholder-[#6a5060] focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[rgba(201,162,39,0.3)] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-medium text-[#b8ada0] mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-[#8a6070]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.15)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#f5f0e8] placeholder-[#6a5060] focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[rgba(201,162,39,0.3)] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-[#b8ada0] cursor-pointer">
            <input type="checkbox" className="rounded w-4 h-4 bg-[#1a0808] border border-[#c9a227]" />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-[#c9a227] hover:text-[#dbb237]">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c9a227] hover:bg-[#dbb237] disabled:opacity-50 text-[#1a0808] font-semibold py-2.5 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(201,162,39,0.15)]"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-[#2a1010] text-[#6a5060]">Don't have an account?</span>
        </div>
      </div>

      {/* Sign Up Link */}
      <Link
        href="/auth/signup"
        className="w-full bg-[#1a0808] hover:bg-[#3a1010] border border-[#c9a227] text-[#c9a227] font-semibold py-2.5 px-4 rounded-lg transition-colors text-center block"
      >
        Create account
      </Link>

      {/* Help Text */}
      <p className="text-xs text-[#6a5060] text-center">
        Need help?{' '}
        <a href="mailto:admin@pavoni.local" className="text-[#c9a227] hover:text-[#dbb237]">
          Contact us
        </a>
      </p>
    </div>
  )
}
