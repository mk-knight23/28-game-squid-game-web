import { ref } from 'vue'
import { Howl } from 'howler'
import { useSettingsStore } from '@/stores/settings'

export function useAudio() {
  const settingsStore = useSettingsStore()
  
  const sounds = ref<{
    move?: Howl
    eliminate?: Howl
    win?: Howl
    start?: Howl
  }>({})

  function initializeSounds(): void {
    sounds.value.move = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
      volume: 0.3,
    })

    sounds.value.eliminate = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2053/2053-preview.mp3'],
      volume: 0.5,
    })

    sounds.value.win = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'],
      volume: 0.5,
    })

    sounds.value.start = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
      volume: 0.4,
    })
  }

  function playMove(): void {
    if (settingsStore.settings.soundEnabled && sounds.value.move) {
      sounds.value.move.play()
    }
  }

  function playEliminate(): void {
    if (settingsStore.settings.soundEnabled && sounds.value.eliminate) {
      sounds.value.eliminate.play()
    }
  }

  function playWin(): void {
    if (settingsStore.settings.soundEnabled && sounds.value.win) {
      sounds.value.win.play()
    }
  }

  function playStart(): void {
    if (settingsStore.settings.soundEnabled && sounds.value.start) {
      sounds.value.start.play()
    }
  }

  function stopAll(): void {
    Object.values(sounds.value).forEach(sound => {
      if (sound) sound.stop()
    })
  }

  function destroySounds(): void {
    stopAll()
    Object.values(sounds.value).forEach(sound => {
      if (sound) sound.unload()
    })
  }

  return {
    initializeSounds,
    playMove,
    playEliminate,
    playWin,
    playStart,
    stopAll,
    destroySounds,
  }
}
