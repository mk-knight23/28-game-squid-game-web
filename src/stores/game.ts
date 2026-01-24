import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameStatus } from '@/types'
import { GAME_CONSTANTS, STORAGE_KEYS } from '@/utils/constants'

export const useGameStore = defineStore('game', () => {
  const status = ref<GameStatus>('idle')
  const score = ref(0)
  const timeRemaining = ref<number>(GAME_CONSTANTS.INITIAL_TIME)
  const isEliminated = ref(false)
  const distance = ref(0)
  const dollFacingBack = ref(true)
  const detectionStatus = ref<'green' | 'red'>('green')
  const lives = ref(3)
  const round = ref(1)
  
  const highScore = ref(parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0'))
  
  const progress = computed(() => (distance.value / GAME_CONSTANTS.FINISH_LINE) * 100)
  
  const isPlaying = computed(() => status.value === 'playing')
  const isGameOver = computed(() => status.value === 'gameover')
  const isVictory = computed(() => status.value === 'victory')
  const isIdle = computed(() => status.value === 'idle')
  
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  function startGame(): void {
    status.value = 'playing'
    score.value = 0
    timeRemaining.value = GAME_CONSTANTS.INITIAL_TIME
    isEliminated.value = false
    distance.value = 0
    lives.value = 3
    round.value = 1
    detectionStatus.value = 'green'
  }

  function eliminate(): void {
    lives.value--
    if (lives.value <= 0) {
      status.value = 'gameover'
      isEliminated.value = true
    }
  }

  function win(): void {
    status.value = 'victory'
    const finalScore = Math.floor(distance.value + (timeRemaining.value * 10))
    score.value = finalScore
    
    if (finalScore > highScore.value) {
      highScore.value = finalScore
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, finalScore.toString())
    }
  }

  function resetGame(): void {
    status.value = 'idle'
    isEliminated.value = false
    distance.value = 0
    timeRemaining.value = GAME_CONSTANTS.INITIAL_TIME
    lives.value = 3
    round.value = 1
  }

  function setDetectionStatus(status: 'green' | 'red'): void {
    detectionStatus.value = status
  }

  function moveForward(amount: number): void {
    if (status.value === 'playing' && !isEliminated.value) {
      distance.value = Math.min(distance.value + amount, GAME_CONSTANTS.FINISH_LINE)
      
      if (distance.value >= GAME_CONSTANTS.FINISH_LINE) {
        win()
      }
    }
  }

  function setTimeRemaining(time: number): void {
    timeRemaining.value = Math.max(0, time)
    if (timeRemaining.value <= 0 && status.value === 'playing') {
      eliminate()
    }
  }

  function setDollFacingBack(facing: boolean): void {
    dollFacingBack.value = facing
  }

  return {
    status,
    score,
    highScore,
    timeRemaining,
    isEliminated,
    distance,
    totalDistance: GAME_CONSTANTS.FINISH_LINE,
    dollFacingBack,
    detectionStatus,
    lives,
    round,
    progress,
    isPlaying,
    isGameOver,
    isVictory,
    isIdle,
    formattedTime,
    startGame,
    eliminate,
    win,
    resetGame,
    setDetectionStatus,
    moveForward,
    setTimeRemaining,
    setDollFacingBack,
  }
})
