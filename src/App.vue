<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGameStore } from './stores/game'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Stars, Sky } from '@tresjs/cientos'
import { 
  Skull, 
  Trophy, 
  Timer,
  Activity,
} from 'lucide-vue-next'
import { Motion } from '@motionone/vue'

const store = useGameStore()
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
})

// Game detection loop simulation
const detectionStatus = ref('green')
watch(() => store.status, (newStatus) => {
  if (newStatus === 'playing') {
    startDetectionCycle()
  }
})

function startDetectionCycle() {
  if (store.status !== 'playing') return
  
  const cycle = () => {
    detectionStatus.value = 'green'
    setTimeout(() => {
      detectionStatus.value = 'red'
      setTimeout(() => {
        if (store.status === 'playing') cycle()
      }, 2000 + Math.random() * 2000)
    }, 3000 + Math.random() * 3000)
  }
  cycle()
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col transition-colors duration-1000" :class="detectionStatus === 'red' ? 'bg-red-950/20' : 'bg-transparent'">
    
    <!-- 3D Environment Layer -->
    <div class="absolute inset-0 z-0">
      <TresCanvas shadows alpha>
        <TresPerspectiveCamera :position="[0, 5, 10]" :look-at="[0, 0, 0]" />
        <OrbitControls :enable-zoom="false" />
        
        <Stars :radius="100" :depth="50" :count="5000" :factor="4" />
        <Sky :distance="450000" :sun-position="[0, 1, 0]" :inclination="0" :azimuth="0.25" />
        
        <TresAmbientLight :intensity="0.5" />
        <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" cast-shadow />

        <!-- Ground -->
        <TresMesh :position="[0, -1, 0]" receive-shadow :rotation="[-Math.PI / 2, 0, 0]">
           <TresPlaneGeometry :args="[100, 100]" />
           <TresMeshStandardMaterial color="#2d2d2d" :roughness="0.8" />
        </TresMesh>

        <!-- Player Representation -->
        <TresMesh :position="[0, 0, 5 - (store.distance / 10)]" cast-shadow>
           <TresBoxGeometry :args="[0.5, 1.5, 0.5]" />
           <TresMeshStandardMaterial :color="store.isEliminated ? '#ef4444' : '#037a76'" />
        </TresMesh>
      </TresCanvas>
    </div>

    <!-- UI Overlay Layer -->
    <div class="relative z-10 flex flex-col h-full pointer-events-none p-8 lg:p-12">
       
       <!-- HUD Top -->
       <header class="flex justify-between items-start w-full">
          <div class="glass-panel p-6 flex items-center space-x-6">
             <div class="flex flex-col">
                <span class="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Player 456</span>
                <span class="text-2xl font-game text-glow-cyan uppercase">Active</span>
             </div>
             <div class="h-10 w-px bg-white/10"></div>
             <div class="flex flex-col items-center">
                <Timer :size="16" class="text-squid-pink mb-1" />
                <span class="font-mono text-xl font-black text-white">{{ store.timeRemaining }}</span>
             </div>
          </div>

          <div class="flex flex-col items-end space-y-4">
             <div class="glass-panel px-6 py-3 flex items-center space-x-4 text-white">
                <Trophy :size="16" class="text-amber-500" />
                <span class="text-xs font-black tracking-widest uppercase">Best: {{ store.highScore }}</span>
             </div>
             <div v-if="store.status === 'playing'" 
                  class="px-6 py-2 rounded-full border-2 transition-all duration-500 font-game text-[10px]"
                  :class="detectionStatus === 'red' ? 'bg-red-500 text-white border-white animate-pulse' : 'bg-green-500 text-white border-white'">
                {{ detectionStatus === 'red' ? 'ELIMINATION READY' : 'CLEAR TO MOVE' }}
             </div>
          </div>
       </header>

       <!-- Main Interaction / Modals -->
       <main class="flex-1 flex items-center justify-center">
          
          <!-- Start Screen -->
          <div v-if="store.status === 'idle'" class="glass-panel p-12 text-center space-y-8 pointer-events-auto max-w-md">
             <div class="space-y-2">
                <h2 class="text-4xl font-display font-black tracking-tighter uppercase leading-none text-white">The <span class="text-squid-pink">Squid</span> Prototype</h2>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">Neural Interface Optimized</p>
             </div>
             <button @click="store.startGame()" class="btn-squid bg-squid-pink text-white w-full hover:bg-opacity-90 shadow-lg shadow-squid-pink/20">
                Begin Sequence
             </button>
          </div>

          <!-- Game Over Modal -->
          <div v-if="store.status === 'gameover'" class="glass-panel p-12 text-center space-y-8 bg-red-950/40 border-red-500/50 pointer-events-auto">
             <Skull :size="64" class="text-red-500 mx-auto animate-bounce" />
             <div class="space-y-2 text-white">
                <h2 class="text-5xl font-display font-black text-red-500 uppercase italic">Eliminated</h2>
                <p class="text-xs font-black uppercase tracking-widest">Movement Detected</p>
             </div>
             <button @click="store.resetGame()" class="btn-squid bg-white text-black w-full">Return to HUB</button>
          </div>

       </main>

       <!-- HUD Bottom -->
       <footer class="flex justify-between items-end w-full">
          <div class="flex items-center space-x-6 text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">
             <a href="https://github.com/mk-knight23/31-Squid-Game-Web" target="_blank" class="hover:text-white pointer-events-auto transition-colors">Source Control</a>
          </div>
          <div v-if="store.status === 'playing'" class="pointer-events-auto">
             <button class="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 active:bg-squid-cyan active:border-white transition-all flex items-center justify-center">
                <Activity :size="24" class="text-white opacity-50" />
             </button>
          </div>
       </footer>

    </div>
  </div>
</template>

<style>
.font-game {
  font-family: 'Press Start 2P', cursive;
}
canvas {
  touch-action: none;
}
</style>
