'use client'
import { useState, useEffect, useRef } from 'react'
import { parseSMSTimingData, ParsedSMSData } from '@/lib/sms-timing-parser'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [raceData, setRaceData] = useState<ParsedSMSData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = () => {
    try {
      // Determinar la URL correcta del WebSocket según el dispositivo
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const wsUrl = isLocalhost 
        ? 'ws://localhost:8080' 
        : `ws://${window.location.hostname}:8080`
      
      console.log('🔗 Conectando a:', wsUrl)
      wsRef.current = new WebSocket(wsUrl)
      
      wsRef.current.onopen = () => {
        console.log('✅ WebSocket conectado')
        setIsConnected(true)
        setError(null)
        setRetryCount(0)
        
        // Pedir datos iniciales
        wsRef.current?.send('REQUEST_DATA')
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const parsedData = parseSMSTimingData(event.data)
          if (parsedData) {
            setRaceData(parsedData)
            setError(null)
            console.log('🏆 Datos actualizados:', parsedData.activeDrivers, 'pilotos')
          }
        } catch (parseError) {
          console.warn('⚠️ Error parseando datos:', parseError)
        }
      }
      
      wsRef.current.onclose = () => {
        console.log('❌ WebSocket desconectado')
        setIsConnected(false)
        
        // Limpiar conexión anterior
        if (wsRef.current) {
          wsRef.current = null
        }
        
        // Reconexión exponencial (máximo 30s)
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)
        console.log(`🔄 Reintentando WebSocket en ${delay}ms...`)
        
        reconnectTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1)
          connect()
        }, delay)
      }
      
      wsRef.current.onerror = (error) => {
        console.error('💥 Error WebSocket:', error)
        setError('Error de conexión WebSocket')
        setIsConnected(false)
      }
      
    } catch (error) {
      console.error('❌ Error creando WebSocket:', error)
      setError('No se pudo crear la conexión WebSocket')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
  }

  useEffect(() => {
    console.log('🚀 Iniciando conexión WebSocket...')
    connect()
    
    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    raceData,
    error,
    retryCount,
    reconnect: connect,
    disconnect
  }
}