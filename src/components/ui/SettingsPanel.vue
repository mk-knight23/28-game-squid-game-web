<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useStatsStore } from '@/stores/stats'
import {
  X,
  Volume2,
  Music,
  Smartphone,
  Trophy,
  BarChart3,
  RotateCcw,
} from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  showHelp: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update:showHelp', value: boolean): void
}>()

const settingsStore = useSettingsStore()
const statsStore = useStatsStore()

const showSettings = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

const showHelp = computed({
  get: () => props.showHelp,
  set: (value) => emit('update:showHelp', value),
})

function closeSettings(): void {
  showSettings.value = false
}

function resetStats(): void {
  if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
    statsStore.resetStats()
  }
}

const winRate = computed(() => statsStore.getWinRate().toFixed(1))
</script>

<template>
  <Teleport to="body">
    <!-- Settings Panel -->
    <Transition name="modal">
      <div 
        v-if="showSettings" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeSettings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div class="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-white/10">
            <h2 id="settings-title" class="text-xl font-bold text-white uppercase tracking-wider">
              Settings
            </h2>
            <button 
              @click="closeSettings"
              class="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close settings"
            >
              <X :size="20" class="text-white" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Sound Settings -->
            <section aria-labelledby="sound-heading">
              <h3 id="sound-heading" class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Audio
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Volume2 :size="18" class="text-slate-400" />
                    <span class="text-white">Sound Effects</span>
                  </div>
                  <button 
                    @click="settingsStore.toggleSound()"
                    class="toggle-squid"
                    :class="settingsStore.settings.soundEnabled ? 'toggle-squid-checked' : 'bg-slate-600'"
                    role="switch"
                    :aria-checked="settingsStore.settings.soundEnabled"
                  >
                    <span 
                      class="toggle-squid-thumb"
                      :class="settingsStore.settings.soundEnabled ? 'toggle-squid-thumb-checked' : ''"
                    ></span>
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Music :size="18" class="text-slate-400" />
                    <span class="text-white">Background Music</span>
                  </div>
                  <button 
                    @click="settingsStore.toggleMusic()"
                    class="toggle-squid"
                    :class="settingsStore.settings.musicEnabled ? 'toggle-squid-checked' : 'bg-slate-600'"
                    role="switch"
                    :aria-checked="settingsStore.settings.musicEnabled"
                  >
                    <span 
                      class="toggle-squid-thumb"
                      :class="settingsStore.settings.musicEnabled ? 'toggle-squid-thumb-checked' : ''"
                    ></span>
                  </button>
                </div>
              </div>
            </section>

            <!-- Game Settings -->
            <section aria-labelledby="game-heading">
              <h3 id="game-heading" class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Gameplay
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-white mb-2">Difficulty</label>
                  <div class="flex gap-2">
                    <button 
                      v-for="diff in ['easy', 'normal', 'hard']" 
                      :key="diff"
                      @click="settingsStore.setDifficulty(diff as 'easy' | 'normal' | 'hard')"
                      class="flex-1 py-2 px-4 rounded-lg text-sm font-medium uppercase tracking-wide transition-all"
                      :class="settingsStore.settings.difficulty === diff 
                        ? 'bg-squid-pink text-white' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'"
                    >
                      {{ diff }}
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Smartphone :size="18" class="text-slate-400" />
                    <span class="text-white">Vibrations</span>
                  </div>
                  <button
                    @click="settingsStore.toggleVibrations()"
                    class="toggle-squid"
                    :class="settingsStore.settings.vibrationsEnabled ? 'toggle-squid-checked' : 'bg-slate-600'"
                    role="switch"
                    :aria-checked="settingsStore.settings.vibrationsEnabled"
                  >
                    <span
                      class="toggle-squid-thumb"
                      :class="settingsStore.settings.vibrationsEnabled ? 'toggle-squid-thumb-checked' : ''"
                    ></span>
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Trophy :size="18" class="text-slate-400" />
                    <div>
                      <span class="text-white">Practice Mode</span>
                      <p class="text-[10px] text-slate-500 uppercase tracking-wider">No eliminations</p>
                    </div>
                  </div>
                  <button
                    @click="settingsStore.togglePracticeMode()"
                    class="toggle-squid"
                    :class="settingsStore.settings.practiceMode ? 'toggle-squid-checked' : 'bg-slate-600'"
                    role="switch"
                    :aria-checked="settingsStore.settings.practiceMode"
                  >
                    <span
                      class="toggle-squid-thumb"
                      :class="settingsStore.settings.practiceMode ? 'toggle-squid-thumb-checked' : ''"
                    ></span>
                  </button>
                </div>
              </div>
            </section>

            <!-- Statistics -->
            <section aria-labelledby="stats-heading">
              <h3 id="stats-heading" class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Statistics
              </h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-panel p-4 text-center">
                  <BarChart3 :size="20" class="text-squid-cyan mx-auto mb-2" />
                  <p class="text-2xl font-game text-white">{{ statsStore.stats.totalGames }}</p>
                  <p class="text-[10px] uppercase tracking-widest text-slate-500">Games</p>
                </div>
                
                <div class="glass-panel p-4 text-center">
                  <Trophy :size="20" class="text-amber-500 mx-auto mb-2" />
                  <p class="text-2xl font-game text-white">{{ winRate }}%</p>
                  <p class="text-[10px] uppercase tracking-widest text-slate-500">Win Rate</p>
                </div>
                
                <div class="glass-panel p-4 text-center">
                  <p class="text-2xl font-game text-squid-pink">{{ statsStore.stats.totalWins }}</p>
                  <p class="text-[10px] uppercase tracking-widest text-slate-500">Wins</p>
                </div>
                
                <div class="glass-panel p-4 text-center">
                  <p class="text-2xl font-game text-red-500">{{ statsStore.stats.totalEliminations }}</p>
                  <p class="text-[10px] uppercase tracking-widest text-slate-500">Eliminated</p>
                </div>
              </div>

              <button 
                @click="resetStats"
                class="w-full mt-4 py-3 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw :size="16" />
                Reset Statistics
              </button>
            </section>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Help Modal -->
    <Transition name="modal">
      <div 
        v-if="showHelp" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showHelp = false"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
      >
        <div class="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-white/10">
            <h2 id="help-title" class="text-xl font-bold text-white uppercase tracking-wider">
              How to Play
            </h2>
            <button 
              @click="showHelp = false"
              class="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close help"
            >
              <X :size="20" class="text-white" />
            </button>
          </div>

          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span class="text-green-500 font-game text-sm">GO</span>
                </div>
                <div>
                  <h4 class="text-white font-bold mb-1">Green Light</h4>
                  <p class="text-slate-400 text-sm">Move forward using Arrow Keys, W key, or tap the screen.</p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span class="text-red-500 font-game text-sm">STOP</span>
                </div>
                <div>
                  <h4 class="text-white font-bold mb-1">Red Light</h4>
                  <p class="text-slate-400 text-sm">Stop moving immediately! Movement will get you eliminated.</p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-squid-pink/20 flex items-center justify-center flex-shrink-0">
                  <span class="text-squid-pink font-game text-sm">3</span>
                </div>
                <div>
                  <h4 class="text-white font-bold mb-1">Lives</h4>
                  <p class="text-slate-400 text-sm">You have 3 lives. Get caught moving during Red Light and lose a life.</p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Trophy :size="20" class="text-amber-500" />
                </div>
                <div>
                  <h4 class="text-white font-bold mb-1">Victory</h4>
                  <p class="text-slate-400 text-sm">Reach the finish line before time runs out to win!</p>
                </div>
              </div>
            </div>

            <div class="glass-panel p-4">
              <h4 class="text-white font-bold mb-3">Keyboard Shortcuts</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400">Start Game</span>
                  <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">Space</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Move Forward</span>
                  <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">↑ W</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Reset Game</span>
                  <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">Esc</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Toggle Sound</span>
                  <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">M</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Toggle Theme</span>
                  <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">T</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Toggle Practice Mode</span>
                  <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">P</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-panel,
.modal-leave-active .glass-panel {
  transition: transform 0.3s ease;
}

.modal-enter-from .glass-panel,
.modal-leave-to .glass-panel {
  transform: scale(0.95) translateY(20px);
}
</style>
