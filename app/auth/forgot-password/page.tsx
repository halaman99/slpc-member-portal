'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/lib/auth'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const { data, error: authError } = await resetPassword(email)

      if (authError) {
        setError(authError.message || 'Failed to send reset email')
        return
      }

      setSuccess('Check your email for password reset instructions')
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
        <h2 className="text-2xl font-semibold text-[#f5f0e8]">Reset your password</h2>
        <p className="text-sm text-[#8a6070]">We'll send you a link to reset your password</p>
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
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-xs text-[#6a5060] mt-1">Enter the email associated with your account</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a227] hover:bg-[#dbb237] disabled:opacity-50 text-[#1a0808] font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      ) : (
        <div className="bg-[#1a0808] border border-[rgba(201,162,39,0.15)] rounded-lg p-4 text-center space-y-3">
          <p className="text-sm text-[#e8dcc8]">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-xs text-[#6a5060]">Click the link in your email to reset your password. The link will expire in 24 hours.</p>
        </div>
      )}

      {/* Back to Login Link */}
      <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-[#c9a227] hover:text-[#dbb237] font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>
    </div>
  )
}
