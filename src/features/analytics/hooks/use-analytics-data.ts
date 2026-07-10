import { useMemo } from 'react'
import { getAnalyticsData } from '../data'

export function useAnalyticsData() {
  const data = useMemo(() => getAnalyticsData(), [])

  return {
    data,
    isLoading: false,
    isError: false,
    refetch: () => {},
  }
}
