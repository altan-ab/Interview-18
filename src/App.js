import React, { useEffect, useState } from 'react'
import axios from 'axios'

const useBitcoin = () => {
  const [price, setPrice] = useState(undefined) // Fiyat başlangıçta `undefined`
  const [loading, setLoading] = useState(true) // İlk yükleme durumu

  useEffect(() => {
    let intervalId // Zamanlayıcıyı temizlemek için referans

    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.coindesk.com/v1/bpi/currentprice.json'
        )
        const bitcoinPrice = response.data.bpi.USD.rate_float // USD fiyatını alıyoruz
        setPrice(bitcoinPrice)
        setLoading(false) // Yükleme tamamlandığında durumu güncelle
      } catch (error) {
        console.log('Bitcoin fiyatını alırken hata oluştu:', error)
        setLoading(false) // Hata olsa bile yükleme durumu bitmeli
      }
    }

    fetchPrice() // İlk başta fiyatı çek

    // Her 1 dakikada bir fiyatı güncelle
    intervalId = setInterval(fetchPrice, 60000)

    // Cleanup: Bileşen unmount edildiğinde interval temizlenir
    return () => clearInterval(intervalId)
  }, [])

  return { price, loading } // Hook, fiyat ve yükleme durumunu döner
}

function App() {
  const { price, loading } = useBitcoin()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Bitcoin Fiyatı (USD)</h1>
      {loading ? (
        <p className="text-xl text-gray-500">Yükleniyor...</p>
      ) : (
        <p className="text-2xl text-green-600">${price.toFixed(2)}</p>
      )}
    </div>
  )
}

export default App
