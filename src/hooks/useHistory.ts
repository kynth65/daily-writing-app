import useSWR from 'swr'
import { format } from 'date-fns'
import type { Entry } from '@/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface HistoryData {
  entries: Entry[]
  entriesByDate: Record<string, Entry[]>
}

export function useHistory(currentMonth: Date) {
  const monthStr = format(currentMonth, 'yyyy-MM')

  const { data, error, isLoading, mutate } = useSWR<HistoryData>(
    `/api/history?month=${monthStr}`,
    fetcher,
    {
      // Cache for 60 seconds since history doesn't change as often
      dedupingInterval: 60000,
      // Keep previous data for smooth month transitions
      keepPreviousData: true,
      // Revalidate on focus
      revalidateOnFocus: true,
      // Don't revalidate on mount if data is fresh
      revalidateIfStale: false,
    }
  )

  return {
    entries: data?.entries || [],
    entriesByDate: data?.entriesByDate || {},
    isLoading,
    isError: error,
    mutate,
  }
}
