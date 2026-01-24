import { onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'
import { GAME_CONSTANTS } from '@/utils/constants'

export function useGameLogic() {
  const gameStore = useGameStore()
  const settingsStore = useSettingsStore()
  
  let cycleInterval: ReturnType<typeof setInterval> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let startTime: number | null = null

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
        
        gameStore.setDetectionStatus('red')
        
        const redDuration = getRandomRedDuration()
        
        cycleInterval = setTimeout(() => {
          if (gameStore.status === 'playing') {
            runCycle()
          }
        }, redDuration)
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

  onUnmounted(() => {
    stopGame()
  })

  return {
    startDetectionCycle,
    stopGame,
    reset,
    getElapsedTime,
  }
}
