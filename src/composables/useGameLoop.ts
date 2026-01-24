import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useAudio } from './useAudio'

export function useGameLoop() {
  const gameStore = useGameStore()
  const audio = useAudio()
  
  let animationId: number | null = null
  let lastMoveTime = 0
  const moveCooldown = 100

  function handleKeydown(event: KeyboardEvent): void {
    if (gameStore.status !== 'playing') return
    if (gameStore.isEliminated) return
    if (gameStore.detectionStatus === 'red') return

    const now = Date.now()
    if (now - lastMoveTime < moveCooldown) return

    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
      lastMoveTime = now
      gameStore.moveForward(5)
      audio.playMove()
      event.preventDefault()
    }
  }

  function handleTouchStart(event: TouchEvent): void {
    if (gameStore.status !== 'playing') return
    if (gameStore.isEliminated) return
    if (gameStore.detectionStatus === 'red') return

    const now = Date.now()
    if (now - lastMoveTime < moveCooldown) return
    event.preventDefault()

    lastMoveTime = now
    gameStore.moveForward(5)
    audio.playMove()
  }

  function handleClick(): void {
    if (gameStore.status !== 'playing') return
    if (gameStore.isEliminated) return
    if (gameStore.detectionStatus === 'red') return

    const now = Date.now()
    if (now - lastMoveTime < moveCooldown) return

    lastMoveTime = now
    gameStore.moveForward(5)
    audio.playMove()
  }

  function start(): void {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('click', handleClick)
  }

  function stop(): void {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('click', handleClick)
  }

  onMounted(() => {
    audio.initializeSounds()
    start()
  })

  onUnmounted(() => {
    stop()
    audio.destroySounds()
  })

  return {
    start,
    stop,
  }
}
