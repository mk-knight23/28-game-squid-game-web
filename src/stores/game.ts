import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameStatus } from '@/types'
import { GAME_CONSTANTS, STORAGE_KEYS, type DifficultyLevel } from '@/utils/constants'

export const useGameStore = defineStore('game', () => {
  const status = ref<GameStatus>('idle')
  const score = ref(0)
  const timeRemaining = ref<number>(GAME_CONSTANTS.INITIAL_TIME)
  const isEliminated = ref(false)
  const distance = ref(0)
  const dollFacingBack = ref(true)
  const detectionStatus = ref<'green' | 'red' | 'yellow'>('green')
  const lives = ref(3)
  const round = ref(1)
  const countdown = ref(0) // Countdown before game starts
  const difficulty = ref<DifficultyLevel>('medium') // V3: Current difficulty

  // V3: Per-difficulty high scores
  const highScores = ref<Record<DifficultyLevel, number>>({
    easy: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE_EASY) || '0'),
    medium: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE_MEDIUM) || '0'),
    hard: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE_HARD) || '0'),
  })

  // V3: Win streak
  const winStreak = ref(parseInt(localStorage.getItem(STORAGE_KEYS.WIN_STREAK) || '0'))

  const highScore = computed(() => highScores.value[difficulty.value])
  
  const progress = computed(() => (distance.value / GAME_CONSTANTS.FINISH_LINE) * 100)
  
  const isPlaying = computed(() => status.value === 'playing')
  const isGameOver = computed(() => status.value === 'gameover')
  const isVictory = computed(() => status.value === 'victory')
  const isIdle = computed(() => status.value === 'idle')
  const isCountingDown = computed(() => status.value === 'countdown')

  // V3: Display formatted streak
  const streakDisplay = computed(() => {
    if (winStreak.value === 0) return '-'
    return `${'🔥'.repeat(Math.min(winStreak.value, 5))} ${winStreak.value}`
  })
  
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  function startGame(): void {
    status.value = 'countdown'
    score.value = 0
    timeRemaining.value = GAME_CONSTANTS.INITIAL_TIME
    isEliminated.value = false
    distance.value = 0
    lives.value = 3
    round.value = 1
    detectionStatus.value = 'green'
    countdown.value = 3
  }

  function setCountdown(value: number): void {
    countdown.value = value
    if (value <= 0) {
      status.value = 'playing'
    }
  }

  function eliminate(): void {
    lives.value--
    if (lives.value <= 0) {
      status.value = 'gameover'
      isEliminated.value = true
      // V3: Reset win streak on loss
      if (winStreak.value > 0) {
        winStreak.value = 0
        localStorage.setItem(STORAGE_KEYS.WIN_STREAK, '0')
      }
    }
  }

  // V3: Set difficulty level
  function setDifficulty(level: DifficultyLevel): void {
    difficulty.value = level
  }

  // V3: Quick restart function
  function quickRestart(): void {
    startGame()
  }

  function win(): void {
    status.value = 'victory'
    const finalScore = Math.floor(distance.value + (timeRemaining.value * 10))
    score.value = finalScore

    // V3: Update per-difficulty high score
    if (finalScore > highScores.value[difficulty.value]) {
      highScores.value[difficulty.value] = finalScore
      const key = difficulty.value === 'easy' ? STORAGE_KEYS.HIGH_SCORE_EASY
                : difficulty.value === 'medium' ? STORAGE_KEYS.HIGH_SCORE_MEDIUM
                : STORAGE_KEYS.HIGH_SCORE_HARD
      localStorage.setItem(key, finalScore.toString())
    }

    // V3: Update win streak
    winStreak.value++
    localStorage.setItem(STORAGE_KEYS.WIN_STREAK, winStreak.value.toString())
  }

  function resetGame(): void {
    status.value = 'idle'
    isEliminated.value = false
    distance.value = 0
    timeRemaining.value = GAME_CONSTANTS.INITIAL_TIME
    lives.value = 3
    round.value = 1
  }

  function setDetectionStatus(status: 'green' | 'red' | 'yellow'): void {
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
    highScores,
    timeRemaining,
    isEliminated,
    distance,
    totalDistance: GAME_CONSTANTS.FINISH_LINE,
    dollFacingBack,
    detectionStatus,
    lives,
    round,
    countdown,
    progress,
    isPlaying,
    isGameOver,
    isVictory,
    isIdle,
    isCountingDown,
    formattedTime,
    difficulty,
    winStreak,
    streakDisplay,
    startGame,
    eliminate,
    win,
    resetGame,
    setDetectionStatus,
    setCountdown,
    moveForward,
    setTimeRemaining,
    setDollFacingBack,
    setDifficulty,
    quickRestart,
  }
})
