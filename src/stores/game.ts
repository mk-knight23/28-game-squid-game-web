import { defineStore } from 'pinia'

export type GameStatus = 'idle' | 'playing' | 'gameover' | 'victory'

export const useGameStore = defineStore('game', {
  state: () => ({
    status: 'idle' as GameStatus,
    score: 0,
    highScore: parseInt(localStorage.getItem('squid-highscore') || '0'),
    timeRemaining: 60,
    dollFacingBack: true,
    isEliminated: false,
    distance: 0,
    totalDistance: 100
  }),
  actions: {
    startGame() {
      this.status = 'playing'
      this.score = 0
      this.timeRemaining = 60
      this.isEliminated = false
      this.distance = 0
    },
    eliminate() {
      this.status = 'gameover'
      this.isEliminated = true
    },
    win() {
      this.status = 'victory'
      if (this.score > this.highScore) {
        this.highScore = this.score
        localStorage.setItem('squid-highscore', this.highScore.toString())
      }
    },
    resetGame() {
      this.status = 'idle'
      this.isEliminated = false
      this.distance = 0
    }
  }
})
