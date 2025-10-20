'use client'

import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'
import { PenTool } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3A4F41] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center group-hover:border-[#F7F7FF]/30 transition-all">
            <PenTool className="text-[#F7F7FF]" size={20} />
          </div>
          <span className="text-2xl font-normal text-[#F7F7FF]">
            Daily Writer
          </span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal mb-3 text-[#F7F7FF]">
            Create Your Account
          </h1>
          <p className="text-[#F7F7FF]/70 text-lg">Start your writing journey</p>
        </div>

        {/* Form Card */}
        <div className="border border-[#F7F7FF]/10 p-8 rounded-lg">
          <AuthForm mode="signup" />

          <div className="mt-6">
            <p className="text-xs text-[#F7F7FF]/50 text-center leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <div className="mt-8 text-center text-base">
            <span className="text-[#F7F7FF]/70">Already have an account? </span>
            <Link
              href="/login"
              className="text-[#F7F7FF] hover:text-[#F7F7FF]/80 font-normal transition-all underline decoration-[#F7F7FF]/30 hover:decoration-[#F7F7FF]/50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
