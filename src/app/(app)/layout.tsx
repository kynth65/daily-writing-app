import DashboardNav from '@/components/layout/DashboardNav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#3A4F41]">
      <DashboardNav />

      <main className="px-6 py-6 sm:px-8 sm:py-8 lg:ml-80 lg:p-10 min-h-screen">
        {children}
      </main>
    </div>
  )
}
