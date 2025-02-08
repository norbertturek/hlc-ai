<template>
  <div class="flex flex-col gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.03]">
    <div class="flex items-center gap-3">
      <div class="rounded-full bg-emerald-100 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">Polecane produkty</h3>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a 
        v-for="product in products" 
        :key="product.id"
        :href="product.url"
        target="_blank"
        class="group flex flex-col gap-3 p-4 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.03] hover:shadow-md transition-all duration-200"
      >
        <div class="aspect-w-16 aspect-h-9 rounded-lg bg-gray-100 overflow-hidden">
          <img 
            :src="product.image" 
            :alt="product.name"
            class="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">{{ product.name }}</h4>
          <p class="text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-sm font-medium text-emerald-600">{{ product.price }} zł</span>
            <span class="text-xs text-gray-400">Zobacz więcej →</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  url: string
}

defineProps<{
  products: Product[]
}>()</script> 