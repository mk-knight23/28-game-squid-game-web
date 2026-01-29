export interface GameState {
  status: 'idle' | 'countdown' | 'playing' | 'gameover' | 'victory'
  score: number
  highScore: number
  timeRemaining: number
  isEliminated: boolean
  distance: number
  totalDistance: number
  dollFacingBack: boolean
  detectionStatus: 'green' | 'red' | 'yellow'
  lives: number
  round: number
  countdown: number
}

export interface SettingsState {
  soundEnabled: boolean
  musicEnabled: boolean
  vibrationsEnabled: boolean
  difficulty: 'easy' | 'normal' | 'hard'
  theme: 'dark' | 'light' | 'system'
  practiceMode: boolean
}

export interface StatsState {
  totalGames: number
  totalWins: number
  totalEliminations: number
  bestTime: number | null
  averageDistance: number
  lastPlayed: string | null
}

export type GameStatus = GameState['status']
