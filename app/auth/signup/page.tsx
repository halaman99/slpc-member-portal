'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithEmail } from '@/lib/auth'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await signUpWithEmail(email, password, fullName)

      if (authError) {
        setError(authError.message || 'Failed to create account')
        return
      }

      setSuccess('Account created! Check your email to confirm your account.')
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-[#f5f0e8]">Create account</h2>
        <p className="text-sm text-[#8a6070]">Join our server community</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#3a1010] border border-[#c95a5a] rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#c95a5a] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#e8dcc8]">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-[#0a2a0a] border border-[#4a9a5a] rounded-lg p-3 flex gap-3">
          <CheckCircle className="w-5 h-5 text-[#4a9a5a] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#e8dcc8]">{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <label className="block text-xs font-medium text-[#b8ada0] mb-2">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-[#8a6070]" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
              className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.15)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#f5f0e8] placeholder-[#6a5060] focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[rgba(201,162,39,0.3)] disabled:opacity-50"
            />
          </div>
        </div>

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
          <p className="text-xs text-[#6a5060] mt-1">At least 8 characters</p>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-xs font-medium text-[#b8ada0] mb-2">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-[#8a6070]" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full bg-[#1a0808] border border-[rgba(201,162,39,0.15)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#f5f0e8] placeholder-[#6a5060] focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[rgba(201,162,39,0.3)] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2 text-xs text-[#b8ada0] cursor-pointer">
          <input type="checkbox" required className="rounded w-4 h-4 bg-[#1a0808] border border-[#c9a227] mt-0.5" />
          <span>
            I agree to the{' '}
            <a href="#" className="text-[#c9a227] hover:text-[#dbb237]">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#c9a227] hover:text-[#dbb237]">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c9a227] hover:bg-[#dbb237] disabled:opacity-50 text-[#1a0808] font-semibold py-2.5 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(201,162,39,0.15)]"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-[#2a1010] text-[#6a5060]">Already have an account?</span>
        </div>
      </div>

      {/* Sign In Link */}
      <Link
        href="/auth/login"
        className="w-full bg-[#1a0808] hover:bg-[#3a1010] border border-[#c9a227] text-[#c9a227] font-semibold py-2.5 px-4 rounded-lg transition-colors text-center block"
      >
        Sign in
      </Link>
    </div>
  )
}
