export const GAME_CONSTANTS = {
  INITIAL_TIME: 60,
  MAX_ROUNDS: 5,
  MIN_GREEN_DURATION: 3000,
  MAX_GREEN_DURATION: 6000,
  MIN_RED_DURATION: 2000,
  MAX_RED_DURATION: 4000,
  PLAYER_SPEED: 0.5,
  FINISH_LINE: 100,
} as const

export const STORAGE_KEYS = {
  HIGH_SCORE: 'squid-highscore',
  HIGH_SCORE_EASY: 'squid-highscore-easy',
  HIGH_SCORE_MEDIUM: 'squid-highscore-medium',
  HIGH_SCORE_HARD: 'squid-highscore-hard',
  SETTINGS: 'squid-settings',
  STATS: 'squid-stats',
  WIN_STREAK: 'squid-streak',
} as const

export const KEYBOARD_SHORTCUTS = {
  START: 'Space',
  RESET: 'Escape',
  RESTART: 'R',
  SETTINGS: 'S',
  MUTE: 'M',
  THEME: 'T',
  PRACTICE: 'P',
} as const

export type DifficultyLevel = 'easy' | 'medium' | 'hard'
