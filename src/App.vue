<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'
import { useGameLogic } from '@/composables/useGameLogic'
import { useKeyboardControls } from '@/composables/useKeyboardControls'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Stars, Sky } from '@tresjs/cientos'
import { 
  Skull, 
  Trophy, 
  Timer,
  Activity,
  Settings,
  Moon,
  Sun,
  HelpCircle,
} from 'lucide-vue-next'
import SettingsPanel from '@/components/ui/SettingsPanel.vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const gameLogic = useGameLogic()
useKeyboardControls()

const isMobile = ref(false)
const showSettings = ref(false)
const showHelp = ref(false)

const detectionStatus = computed(() => gameStore.detectionStatus)

const backgroundClass = computed(() => 
  detectionStatus.value === 'red' 
    ? 'bg-red-950/30 animate-pulse' 
    : 'bg-transparent'
)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  settingsStore.initializeTheme()
  
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})

watch(() => gameStore.status, (newStatus) => {
  if (newStatus === 'playing') {
    gameLogic.startDetectionCycle()
  } else {
    gameLogic.stopGame()
  }
})

function handleStart(): void {
  gameStore.startGame()
}

function handleReset(): void {
  gameLogic.reset()
}

function toggleTheme(): void {
  const themes: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system']
  const currentIndex = themes.indexOf(settingsStore.settings.theme)
  const nextIndex = (currentIndex + 1) % themes.length
  settingsStore.setTheme(themes[nextIndex])
}

function getThemeIcon() {
  const theme = settingsStore.settings.theme
  if (theme === 'dark') return Moon
  if (theme === 'light') return Sun
  return Sun
}

const themeIcon = computed(getThemeIcon)
</script>

<template>
  <div 
    class="h-screen w-screen flex flex-col transition-colors duration-1000"
    :class="backgroundClass"
    role="application"
    aria-label="Squid Game - Red Light Green Light"
  >
    <!-- 3D Environment Layer -->
    <div class="absolute inset-0 z-0" aria-hidden="true">
      <TresCanvas shadows alpha>
        <TresPerspectiveCamera :position="[0, 5, 10]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-zoom="false" />
        
        <Stars :radius="100" :depth="50" :count="5000" :factor="4" />
        <Sky :distance="450000" :sun-position="[0, 1, 0]" :inclination="0" :azimuth="0.25" />
        
        <TresAmbientLight :intensity="0.5" />
        <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" cast-shadow />

        <TresMesh :position="[0, -1, 0]" receive-shadow :rotation="[-Math.PI / 2, 0, 0]">
          <TresPlaneGeometry :args="[100, 100]" />
          <TresMeshStandardMaterial color="#2d2d2d" :roughness="0.8" />
        </TresMesh>

        <TresMesh :position="[0, 0, 5 - (gameStore.distance / 10)]" cast-shadow>
          <TresBoxGeometry :args="[0.5, 1.5, 0.5]" />
          <TresMeshStandardMaterial :color="gameStore.isEliminated ? '#ef4444' : '#037a76'" />
        </TresMesh>
      </TresCanvas>
    </div>

    <!-- UI Overlay Layer -->
    <div class="relative z-10 flex flex-col h-full pointer-events-none p-6 lg:p-8">
      
      <!-- HUD Top -->
      <header class="flex justify-between items-start w-full">
        <div class="glass-panel p-4 lg:p-6 flex items-center gap-4 lg:gap-6">
          <div class="flex flex-col">
            <span class="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-slate-500">
              Player 456
            </span>
            <span class="text-lg lg:text-2xl font-game text-glow-cyan uppercase">
              {{ gameStore.isPlaying ? 'Active' : 'Standby' }}
            </span>
          </div>
          
          <div class="h-8 lg:h-10 w-px bg-white/10"></div>
          
          <div class="flex flex-col items-center">
            <Timer :size="14" class="lg:size-16 text-squid-pink mb-1" aria-label="Time Remaining" />
            <span class="font-mono text-lg lg:text-xl font-black text-white">
              {{ gameStore.formattedTime }}
            </span>
          </div>

          <div class="hidden lg:flex flex-col items-center ml-4">
            <Activity :size="14" class="text-squid-cyan mb-1" aria-label="Lives" />
            <div class="flex gap-1">
              <span 
                v-for="i in 3" 
                :key="i"
                class="w-2 h-2 rounded-full transition-colors"
                :class="i <= gameStore.lives ? 'bg-squid-pink' : 'bg-white/20'"
                :aria-label="`Life ${i}`"
              ></span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-3">
          <div class="flex gap-2">
            <button 
              @click="toggleTheme"
              class="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              :aria-label="`Toggle theme. Current: ${settingsStore.settings.theme}`"
            >
              <component :is="themeIcon" :size="18" class="text-white" />
            </button>
            
            <button 
              @click="showSettings = true"
              class="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Open settings"
            >
              <Settings :size="18" class="text-white" />
            </button>

            <button 
              @click="showHelp = true"
              class="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Open help"
            >
              <HelpCircle :size="18" class="text-white" />
            </button>
          </div>

          <div class="glass-panel px-4 py-2 lg:px-6 lg:py-3 flex items-center gap-3 text-white">
            <Trophy :size="14" class="text-amber-500" aria-label="High Score" />
            <span class="text-xs lg:text-sm font-black tracking-widest uppercase">
              Best: {{ gameStore.highScore }}
            </span>
          </div>

          <div 
            v-if="gameStore.isPlaying" 
            class="px-6 py-2 rounded-full border-2 transition-all duration-500 font-game text-[10px] lg:text-xs"
            :class="detectionStatus === 'red' 
              ? 'bg-red-500 text-white border-white animate-pulse' 
              : 'bg-green-500 text-white border-white'"
            role="status"
            :aria-live="detectionStatus === 'red' ? 'assertive' : 'polite'"
          >
            {{ detectionStatus === 'red' ? 'STOP!' : 'MOVE!' }}
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex items-center justify-center">
        <!-- Start Screen -->
        <div 
          v-if="gameStore.isIdle" 
          class="glass-panel p-8 lg:p-12 text-center space-y-6 lg:space-y-8 pointer-events-auto max-w-md"
          role="dialog"
          aria-labelledby="start-title"
        >
          <div class="space-y-2">
            <h1 id="start-title" class="text-3xl lg:text-5xl font-display font-black tracking-tighter uppercase leading-none text-white">
              Red Light <span class="text-squid-pink">Green Light</span>
            </h1>
            <p class="text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-[0.2em] lg:tracking-[0.3em]">
              Squid Game Challenge
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <button 
              @click="handleStart"
              class="btn-squid-primary"
              autofocus
            >
              Start Game
            </button>
            
            <button 
              @click="showSettings = true"
              class="btn-squid-outline"
            >
              Settings
            </button>
          </div>

          <p class="text-[10px] text-slate-500 uppercase tracking-wider">
            Press Space to Start • Arrow Keys to Move
          </p>
        </div>

        <!-- Game Over Modal -->
        <div 
          v-if="gameStore.isGameOver" 
          class="glass-panel p-8 lg:p-12 text-center space-y-6 bg-red-950/40 border-red-500/50 pointer-events-auto"
          role="dialog"
          aria-labelledby="gameover-title"
        >
          <Skull :size="64" class="text-red-500 mx-auto animate-bounce" aria-hidden="true" />
          
          <div class="space-y-2 text-white">
            <h2 id="gameover-title" class="text-4xl lg:text-5xl font-display font-black text-red-500 uppercase italic">
              Eliminated
            </h2>
            <p class="text-xs font-black uppercase tracking-widest text-red-400">
              Movement Detected!
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-white">
            <div class="glass-panel p-4">
              <p class="text-[10px] uppercase tracking-widest text-slate-500">Score</p>
              <p class="text-2xl font-game">{{ gameStore.distance }}</p>
            </div>
            <div class="glass-panel p-4">
              <p class="text-[10px] uppercase tracking-widest text-slate-500">High Score</p>
              <p class="text-2xl font-game">{{ gameStore.highScore }}</p>
            </div>
          </div>

          <button @click="handleReset" class="btn-squid-primary w-full">
            Try Again
          </button>
        </div>

        <!-- Victory Modal -->
        <div 
          v-if="gameStore.isVictory" 
          class="glass-panel p-8 lg:p-12 text-center space-y-6 bg-green-950/40 border-green-500/50 pointer-events-auto"
          role="dialog"
          aria-labelledby="victory-title"
        >
          <Trophy :size="64" class="text-amber-500 mx-auto animate-bounce" aria-hidden="true" />
          
          <div class="space-y-2 text-white">
            <h2 id="victory-title" class="text-4xl lg:text-5xl font-display font-black text-amber-500 uppercase italic">
              Victory!
            </h2>
            <p class="text-xs font-black uppercase tracking-widest text-green-400">
              You Survived!
            </p>
          </div>

          <div class="glass-panel p-6">
            <p class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Final Score</p>
            <p class="text-4xl font-game text-glow-cyan">{{ gameStore.score }}</p>
          </div>

          <button @click="handleReset" class="btn-squid-secondary w-full">
            Play Again
          </button>
        </div>
      </main>

      <!-- HUD Bottom -->
      <footer class="flex justify-between items-end w-full">
        <div class="flex items-center gap-4 lg:gap-6 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] lg:tracking-[0.5em] text-slate-500">
          <a 
            href="https://github.com/mk-knight23/31-Squid-Game-Web" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:text-white transition-colors pointer-events-auto"
          >
            Source Control
          </a>
        </div>

        <div v-if="gameStore.isPlaying" class="pointer-events-auto">
          <div class="flex items-center gap-4">
            <!-- Progress Bar -->
            <div class="w-32 lg:w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-squid-pink to-squid-cyan transition-all duration-300"
                :style="{ width: `${gameStore.progress}%` }"
                role="progressbar"
                :aria-valuenow="gameStore.progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Distance to finish"
              ></div>
            </div>
            
            <button 
              @click="gameStore.moveForward(10)"
              class="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 border-2 border-white/20 active:bg-squid-cyan active:border-white transition-all flex items-center justify-center"
              aria-label="Move forward"
            >
              <Activity :size="24" class="text-white opacity-50" />
            </button>
          </div>
        </div>
      </footer>

    </div>

    <!-- Modals -->
    <SettingsPanel 
      v-model:show="showSettings" 
      v-model:showHelp="showHelp"
    />
  </div>
</template>
