<template>
  <div 
    :class="[
      'flex animate-fade-in transition-all duration-200',
      isUser ? 'justify-end' : 'justify-start'
    ]"
  >
    <div 
      :class="[
        'relative max-w-xl rounded-2xl px-6 py-3 shadow-sm transition-all duration-200',
        isUser ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'
      ]"
    >
      <p class="whitespace-pre-wrap text-[15px] leading-relaxed">
        {{ message }}
        <span v-if="isStreaming" class="inline-flex animate-pulse">...</span>
      </p>
      <ProductRecommendation
        v-if="products && products.length > 0 && !isStreaming"
        :products="products"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useChat'

defineProps<{
  message: string
  isUser: boolean
  isStreaming?: boolean
  products?: Product[]
}>()
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 