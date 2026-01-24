<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  title: '',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLDivElement | null>(null)

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function handleClose(): void {
  emit('close')
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.show) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
        tabindex="-1"
      >
        <div 
          ref="dialogRef"
          class="glass-panel w-full"
          :class="sizeClasses[size]"
        >
          <slot />
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
  transform: scale(0.95);
}
</style>
