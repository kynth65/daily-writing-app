import useSWR from 'swr'
import type { UserStats } from '@/lib/stats'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<UserStats>(
    '/api/stats?type=overview',
    fetcher,
    {
      // Cache for 30 seconds, revalidate in background
      dedupingInterval: 30000,
      // Keep previous data while revalidating for instant transitions
      keepPreviousData: true,
      // Revalidate on focus to keep data fresh
      revalidateOnFocus: true,
      // Don't revalidate on mount if data is fresh
      revalidateIfStale: false,
    }
  )

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  }
}
