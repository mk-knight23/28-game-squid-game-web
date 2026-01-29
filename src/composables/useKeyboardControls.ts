import { onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { KEYBOARD_SHORTCUTS } from '@/utils/constants'

type Handler = () => void

export function useKeyboardControls() {
  const settingsStore = useSettingsStore()
  const handlers = new Map<string, Set<Handler>>()

  function registerShortcut(key: string, handler: Handler): void {
    const upperKey = key.toUpperCase()
    if (!handlers.has(upperKey)) {
      handlers.set(upperKey, new Set())
    }
    handlers.get(upperKey)!.add(handler)
  }

  function unregisterShortcut(key: string, handler: Handler): void {
    const upperKey = key.toUpperCase()
    handlers.get(upperKey)?.delete(handler)
  }

  function handleKeydown(event: KeyboardEvent): void {
    const key = event.key.toUpperCase()
    const handlersForKey = handlers.get(key)
    
    if (handlersForKey && handlersForKey.size > 0) {
      event.preventDefault()
      handlersForKey.forEach(handler => handler())
    }
  }

  function initialize(): void {
    document.addEventListener('keydown', handleKeydown)

    registerShortcut(KEYBOARD_SHORTCUTS.MUTE, () => {
      settingsStore.toggleSound()
    })

    registerShortcut(KEYBOARD_SHORTCUTS.THEME, () => {
      const themes: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system']
      const currentIndex = themes.indexOf(settingsStore.settings.theme)
      const nextIndex = (currentIndex + 1) % themes.length
      settingsStore.setTheme(themes[nextIndex])
    })

    registerShortcut(KEYBOARD_SHORTCUTS.PRACTICE, () => {
      settingsStore.togglePracticeMode()
    })
  }

  function destroy(): void {
    document.removeEventListener('keydown', handleKeydown)
    handlers.clear()
  }

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    registerShortcut,
    unregisterShortcut,
    initialize,
    destroy,
  }
}
