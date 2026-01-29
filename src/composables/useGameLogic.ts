import { onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'
import { GAME_CONSTANTS } from '@/utils/constants'

export function useGameLogic() {
  const gameStore = useGameStore()
  const settingsStore = useSettingsStore()

  // Check if practice mode is enabled
  const isPracticeMode = () => settingsStore.settings.practiceMode

  let cycleInterval: ReturnType<typeof setInterval> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let gameCountdownInterval: ReturnType<typeof setInterval> | null = null
  let startTime: number | null = null

  // Watch for countdown status to start countdown
  watch(() => gameStore.status, (newStatus) => {
    if (newStatus === 'countdown') {
      startCountdown()
    } else if (newStatus === 'playing') {
      startDetectionCycle()
    } else {
      stopGame()
    }
  })

  function startCountdown(): void {
    gameCountdownInterval = setInterval(() => {
      if (gameStore.countdown > 0) {
        gameStore.setCountdown(gameStore.countdown - 1)
      } else {
        if (gameCountdownInterval) {
          clearInterval(gameCountdownInterval)
          gameCountdownInterval = null
        }
      }
    }, 1000)
  }

  function startDetectionCycle(): void {
    if (gameStore.status !== 'playing') return

    startTime = Date.now()

    countdownInterval = setInterval(() => {
      gameStore.setTimeRemaining(gameStore.timeRemaining - 1)
    }, 1000)

    const runCycle = (): void => {
      if (gameStore.status !== 'playing') return

      gameStore.setDetectionStatus('green')

      const greenDuration = getRandomGreenDuration()

      cycleInterval = setTimeout(() => {
        if (gameStore.status !== 'playing') return

        // Add yellow warning before red
        gameStore.setDetectionStatus('yellow')
        const yellowDuration = 500

        setTimeout(() => {
          if (gameStore.status !== 'playing') return

          gameStore.setDetectionStatus('red')

          const redDuration = getRandomRedDuration()

          cycleInterval = setTimeout(() => {
            if (gameStore.status === 'playing') {
              runCycle()
            }
          }, redDuration)
        }, yellowDuration)
      }, greenDuration)
    }

    runCycle()
  }

  function getRandomGreenDuration(): number {
    const base = GAME_CONSTANTS.MIN_GREEN_DURATION
    const range = GAME_CONSTANTS.MAX_GREEN_DURATION - GAME_CONSTANTS.MIN_GREEN_DURATION
    const modifier = getDifficultyModifier()
    return (base + Math.random() * range) * modifier
  }

  function getRandomRedDuration(): number {
    const base = GAME_CONSTANTS.MIN_RED_DURATION
    const range = GAME_CONSTANTS.MAX_RED_DURATION - GAME_CONSTANTS.MIN_RED_DURATION
    const modifier = getDifficultyModifier()
    return (base + Math.random() * range) * modifier
  }

  function getDifficultyModifier(): number {
    const difficulty = settingsStore.settings.difficulty
    switch (difficulty) {
      case 'easy': return 1.3
      case 'normal': return 1.0
      case 'hard': return 0.7
      default: return 1.0
    }
  }

  function stopGame(): void {
    if (cycleInterval) {
      clearTimeout(cycleInterval)
      cycleInterval = null
    }
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    if (gameCountdownInterval) {
      clearInterval(gameCountdownInterval)
      gameCountdownInterval = null
    }
  }

  function reset(): void {
    stopGame()
    gameStore.resetGame()
    startTime = null
  }

  function getElapsedTime(): number {
    if (!startTime) return 0
    return Math.floor((Date.now() - startTime) / 1000)
  }

  function handleMovementDuringRed(): boolean {
    if (isPracticeMode()) {
      // In practice mode, just show a warning but don't eliminate
      return false // Not eliminated
    }
    gameStore.eliminate()
    return true // Eliminated
  }

  onUnmounted(() => {
    stopGame()
  })

  return {
    startDetectionCycle,
    stopGame,
    reset,
    getElapsedTime,
    handleMovementDuringRed,
    isPracticeMode,
  }
}
