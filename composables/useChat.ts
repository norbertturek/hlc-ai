import { ref } from 'vue'
import products from '~/product.data.json'

export interface ChatMessage {
  content: string
  isUser: boolean
  products?: Product[]
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  url: string
}

export const useChat = () => {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentStreamingMessage = ref<ChatMessage | null>(null)

  const extractProducts = (content: string): Product[] => {
    const extractedProducts: Product[] = []
    console.log('Szukam produktów w treści:', content)
    
    const productMatches = content.matchAll(/(?:🎯 |Polecany produkt: )(.*?)(?:\n|$).*?(?:💊 |Przeznaczenie: )(.*?)(?:\n|$).*?(?:📝 |Opis: )(.*?)(?:\n|$).*?(?:💰 |Cena: )(.*?)(?:\n|$)/gs)
    
    for (const match of productMatches) {
      const [fullMatch, name, purpose, description, price] = match
      const cleanName = name.replace(/^(?:🎯 |Polecany produkt: )/, '').trim()
      console.log('Znaleziono produkt w tekście:', { cleanName, purpose, description, price })
      
      // Find product in products data
      const searchName = cleanName.toLowerCase()
      console.log('Szukam produktu w bazie:', searchName)
      console.log('Dostępne produkty:', products.map(p => p.name.toLowerCase()))
      
      const productData = products.find(p => {
        const dbName = p.name.toLowerCase()
        // Usuń nawiasy i ich zawartość
        const normalizedDbName = dbName.replace(/\s*\([^)]*\)/, '')
        const normalizedSearchName = searchName.replace(/\s*\([^)]*\)/, '')
        
        return normalizedDbName.includes(normalizedSearchName) || normalizedSearchName.includes(normalizedDbName)
      })
      
      if (!productData) {
        console.warn('Nie znaleziono danych produktu:', cleanName)
        continue
      }
      
      console.log('Znaleziono dane produktu:', productData)
      
      extractedProducts.push({
        id: extractedProducts.length + 1,
        name: cleanName,
        description: `${purpose.replace(/^(?:💊 |Przeznaczenie: )/, '').trim()}. ${description.replace(/^(?:📝 |Opis: )/, '').trim()}`,
        price: parseFloat(price.replace(/^(?:💰 |Cena: )/, '').replace(/[^0-9.,]/g, '').replace(',', '.')),
        image: productData.image_url,
        url: productData.product_url
      })
    }
    
    console.log('Wyodrębnione produkty:', extractedProducts)
    return extractedProducts
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    try {
      messages.value.push({
        content,
        isUser: true
      })

      isLoading.value = true
      error.value = null

      currentStreamingMessage.value = {
        content: '',
        isUser: false
      }
      messages.value.push(currentStreamingMessage.value)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: messages.value.slice(0, -1)
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        }
      })

      if (!response.ok) {
        throw new Error(`Błąd odpowiedzi: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Brak odpowiedzi')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          if (currentStreamingMessage.value && chunk) {
            currentStreamingMessage.value.content += chunk
            fullContent += chunk
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Extract products after the message is complete
      if (currentStreamingMessage.value) {
        console.log('Pełna odpowiedź:', fullContent)
        const products = extractProducts(currentStreamingMessage.value.content)
        if (products.length > 0) {
          console.log('Dodawanie produktów do wiadomości:', products)
          currentStreamingMessage.value.products = products
        } else {
          console.log('Nie znaleziono produktów w odpowiedzi')
        }
      }

      currentStreamingMessage.value = null
    } catch (e: any) {
      console.error('Błąd podczas przetwarzania wiadomości:', e)
      if (currentStreamingMessage.value) {
        const index = messages.value.indexOf(currentStreamingMessage.value)
        if (index !== -1) {
          messages.value.splice(index, 1)
        }
      }
      currentStreamingMessage.value = null
      error.value = e.message || 'Nie udało się uzyskać odpowiedzi'
    } finally {
      isLoading.value = false
    }
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    currentStreamingMessage
  }
}