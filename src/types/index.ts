export interface GameState {
  status: 'idle' | 'playing' | 'gameover' | 'victory'
  score: number
  highScore: number
  timeRemaining: number
  isEliminated: boolean
  distance: number
  totalDistance: number
  dollFacingBack: boolean
  detectionStatus: 'green' | 'red'
  lives: number
  round: number
}

export interface SettingsState {
  soundEnabled: boolean
  musicEnabled: boolean
  vibrationsEnabled: boolean
  difficulty: 'easy' | 'normal' | 'hard'
  theme: 'dark' | 'light' | 'system'
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
