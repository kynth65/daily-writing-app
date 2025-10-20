'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, PenTool, Calendar, BarChart3, Sparkles, Settings, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { mutate } from 'swr'
import { format } from 'date-fns'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/write', label: 'Write', icon: PenTool },
  { href: '/history', label: 'History', icon: Calendar },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/insights', label: 'Insights', icon: Sparkles },
  { href: '/settings', label: 'Settings', icon: Settings },
]

// Prefetch data for faster navigation
const prefetchData = (href: string) => {
  if (href === '/dashboard' || href === '/stats') {
    // Prefetch stats data (shared cache between dashboard and stats)
    mutate('/api/stats?type=overview')
  } else if (href === '/history') {
    // Prefetch current month history
    const monthStr = format(new Date(), 'yyyy-MM')
    mutate(`/api/history?month=${monthStr}`)
  } else if (href === '/insights') {
    // Prefetch reflections data
    mutate('/api/ai/reflect?limit=20')
  }
}

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 p-3 bg-[#3A4F41] border border-[#F7F7FF]/10 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-300 cursor-pointer"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? (
          <X size={24} className="text-[#F7F7FF]" />
        ) : (
          <Menu size={24} className="text-[#F7F7FF]" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-72 sm:w-80
          bg-[#3A4F41] border-r border-[#F7F7FF]/10
          p-6 sm:p-8 flex flex-col
          transform transition-all duration-500 ease-out z-40
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        {/* Logo */}
        <div className="mb-10 pt-2 lg:pt-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <PenTool size={20} className="text-[#F7F7FF]" />
            </div>
            <h1 className="text-2xl font-normal text-[#F7F7FF]">
              Daily Writer
            </h1>
          </div>
          <p className="text-sm text-[#F7F7FF]/70 ml-[52px]">
            Build your writing habit
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 sm:space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => prefetchData(item.href)}
                className={`
                  flex items-center gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg
                  transition-all duration-200 cursor-pointer border
                  ${isActive
                    ? 'bg-[#F7F7FF]/10 border-[#F7F7FF]/20 text-[#F7F7FF]'
                    : 'border-transparent text-[#F7F7FF]/70 hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/10'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-normal text-base">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="my-6 h-px bg-[#F7F7FF]/10" />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg
                     border border-transparent text-[#F7F7FF]/70 hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/10 hover:text-[#F7F7FF]
                     transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="font-normal text-base">Logout</span>
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 transition-all duration-500"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
