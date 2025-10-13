import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'
import { PenTool } from 'lucide-react'

export default function LoginPage() {
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
            Welcome Back
          </h1>
          <p className="text-[#F7F7FF]/70 text-lg">Sign in to continue writing</p>
        </div>

        {/* Form Card */}
        <div className="border border-[#F7F7FF]/10 p-8 rounded-lg">
          <AuthForm mode="login" />

          <div className="mt-8 text-center">
            <span className="text-[#F7F7FF]/70">Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="text-[#F7F7FF] hover:text-[#F7F7FF]/80 font-normal transition-all underline decoration-[#F7F7FF]/30 hover:decoration-[#F7F7FF]/50"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-[#F7F7FF]/50 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
