import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StatsState } from '@/types'
import { STORAGE_KEYS } from '@/utils/constants'

export const useStatsStore = defineStore('stats', () => {
  const stats = ref<StatsState>({
    totalGames: 0,
    totalWins: 0,
    totalEliminations: 0,
    bestTime: null,
    averageDistance: 0,
    lastPlayed: null,
  })

  function loadStats(): void {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        stats.value = { ...stats.value, ...parsed }
      } catch {
        console.warn('Failed to parse stats')
      }
    }
  }

  function saveStats(): void {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats.value))
  }

  function recordGame(result: 'win' | 'eliminated', distance: number, timeSpent: number): void {
    stats.value.totalGames++
    stats.value.lastPlayed = new Date().toISOString()
    
    if (result === 'win') {
      stats.value.totalWins++
      if (stats.value.bestTime === null || timeSpent < stats.value.bestTime) {
        stats.value.bestTime = timeSpent
      }
    } else {
      stats.value.totalEliminations++
    }
    
    const totalDistance = (stats.value.averageDistance * (stats.value.totalGames - 1)) + distance
    stats.value.averageDistance = totalDistance / stats.value.totalGames
    
    saveStats()
  }

  function resetStats(): void {
    stats.value = {
      totalGames: 0,
      totalWins: 0,
      totalEliminations: 0,
      bestTime: null,
      averageDistance: 0,
      lastPlayed: null,
    }
    localStorage.removeItem(STORAGE_KEYS.STATS)
  }

  function getWinRate(): number {
    if (stats.value.totalGames === 0) return 0
    return (stats.value.totalWins / stats.value.totalGames) * 100
  }

  return {
    stats,
    loadStats,
    saveStats,
    recordGame,
    resetStats,
    getWinRate,
  }
})
