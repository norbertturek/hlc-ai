<template>
  <div class="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
    <main class="flex-1 overflow-y-auto p-4 relative scroll-smooth" ref="chatContainer">
      <div class="mx-auto h-full max-w-4xl">
        <div class="flex flex-col space-y-4">
          <div v-if="!messages.length" class="flex items-center justify-center min-h-[50vh]">
            <div class="flex flex-col items-center space-y-6 text-center p-8">
              <div class="rounded-full bg-emerald-100 p-4">
                <svg class="h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div class="space-y-2">
                <h1 class="text-2xl font-medium text-gray-900">Witaj w Asystencie AI HealthLabs Care</h1>
                <p class="max-w-sm text-gray-500">Opisz swoje potrzeby zdrowotne lub dolegliwości, a pomogę Ci dobrać odpowiednie produkty z naszej oferty.</p>
              </div>
            </div>
          </div>
          <ChatMessage
            v-for="(msg, index) in messages"
            :key="index"
            :message="msg.content"
            :is-user="msg.isUser"
            :is-streaming="msg === currentStreamingMessage"
            :products="msg.products"
          />
          <div v-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-500">
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Scroll to top button -->
      <button
        v-if="showScrollButton"
        @click="scrollToTop"
        class="fixed bottom-24 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-black/[0.05] text-gray-500 transition-all duration-200 hover:bg-white hover:text-gray-700 hover:shadow-xl z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- New messages indicator -->
      <div
        v-if="showNewMessages"
        @click="scrollToBottom"
        class="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg cursor-pointer hover:bg-emerald-500 transition-all duration-200 z-50"
      >
        <span>Nowe wiadomości</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </main>

    <footer class="border-t bg-white/50 backdrop-blur-xl p-4">
      <div class="mx-auto max-w-4xl">
        <ChatInput @message-sent="scrollToBottom" />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ChatMessage from '~/components/ChatMessage.vue'
import ChatInput from '~/components/ChatInput.vue'

const { messages, isLoading, error, currentStreamingMessage } = useChat()
const chatContainer = ref<HTMLElement>()
const showScrollButton = ref(false)
const showNewMessages = ref(false)
const isNearBottom = ref(true)

const handleScroll = () => {
  if (!chatContainer.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value
  showScrollButton.value = scrollTop > 100 // Pokazuj przycisk już po małym przewinięciu
  
  // Check if we're near the bottom
  const isCurrentlyNearBottom = scrollTop >= scrollHeight - clientHeight - 100
  if (isCurrentlyNearBottom !== isNearBottom.value) {
    isNearBottom.value = isCurrentlyNearBottom
    if (isNearBottom.value) {
      showNewMessages.value = false
    }
  }
}

const scrollToTop = () => {
  chatContainer.value?.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const scrollToBottom = () => {
  chatContainer.value?.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: 'smooth'
  })
  showNewMessages.value = false
}

// Watch for new messages
watch([messages, currentStreamingMessage], () => {
  nextTick(() => {
    if (!chatContainer.value) return
    
    if (isNearBottom.value) {
      scrollToBottom()
    } else {
      showNewMessages.value = true
    }
  })
})

// Add scroll event listener
onMounted(() => {
  chatContainer.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  chatContainer.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

textarea {
  line-height: 1.5;
}

.scroll-smooth {
  scroll-behavior: smooth;
}

/* Dodaj płynne przewijanie dla całej strony */
html {
  scroll-behavior: smooth;
}

/* Popraw styl scrollbara */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Zapewnij płynne przewijanie dla kontenera czatu */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
