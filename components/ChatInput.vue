<template>
  <div class="relative rounded-2xl bg-white/40 backdrop-blur-lg p-1.5 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.03]">
    <form @submit.prevent="handleSubmit" class="relative flex gap-3 rounded-xl bg-white/60 backdrop-blur-lg p-2">
      <div class="relative flex-1 flex items-end">
        <textarea
          v-model="message"
          rows="1"
          placeholder="Opisz swoje potrzeby zdrowotne..."
          class="block w-full resize-none rounded-xl bg-transparent px-4 py-2.5 text-gray-700 placeholder-gray-400/70 transition-all duration-200 focus:outline-none disabled:opacity-50 pr-2 md:pr-4"
          style="min-height: 44px; max-height: 200px; overflow-y: auto;"
          @input="autoGrow"
          @keydown.meta.enter.prevent="handleSubmit"
          ref="messageInput"
          :disabled="isLoading"
        ></textarea>
      </div>

      <button
        type="submit"
        :class="[
          'flex-shrink-0 group relative flex h-11 items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_2px_12px_rgba(16,185,129,0.25)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none disabled:opacity-50 self-end overflow-hidden',
          'md:gap-3 md:pl-5 md:pr-4',
          'px-4'
        ]"
        :disabled="isLoading || !message.trim()"
      >
        <div :class="['flex items-center relative z-10', 'md:gap-3']">
          <span class="hidden md:inline text-[13px] tracking-wide font-medium">{{ isLoading ? 'Czekaj...' : 'Wyślij' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 md:hidden">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
          <div class="hidden md:block h-3.5 w-[1px] bg-white/20"></div>
          <kbd class="hidden md:inline text-[12px] text-emerald-100 font-medium tracking-tight bg-emerald-600/50 px-1.5 py-0.5 rounded-md border border-emerald-400/30">⌘ + ↵</kbd>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform ease-in-out"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/[0.1] to-transparent"></div>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const message = ref("")
const messageInput = ref<HTMLTextAreaElement>()
const { isLoading, sendMessage } = useChat()
const emit = defineEmits(['messageSent'])

const handleSubmit = async () => {
  if (isLoading.value || !message.value.trim()) return
  
  const messageContent = message.value.trim().replace(/\n{3,}/g, '\n\n')
  message.value = ""
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.focus()
  }
  
  await sendMessage(messageContent)
  nextTick(() => {
    emit('messageSent')
  })
}

const autoGrow = () => {
  if (!messageInput.value) return
  messageInput.value.style.height = 'auto'
  messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 200) + 'px'
}
</script> 