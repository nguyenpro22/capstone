"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as signalR from "@microsoft/signalr"

interface UseSignalROptions {
  hubUrl: string
  autoConnect?: boolean
}

export function useSignalR({ hubUrl, autoConnect = true }: UseSignalROptions) {
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState | "CONNECTING">(
    autoConnect ? "CONNECTING" : signalR.HubConnectionState.Disconnected,
  )
  const [error, setError] = useState<Error | null>(null)

  // Initialize connection
  useEffect(() => {
    if (!autoConnect) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    connectionRef.current = connection

    const startConnection = async () => {
      try {
        await connection.start()
        setConnectionState(connection.state)
        console.log("✅ Connected to SignalR hub:", hubUrl)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to connect to SignalR hub"))
        setConnectionState(signalR.HubConnectionState.Disconnected)
        console.error("❌ Error connecting to SignalR hub:", err)

        // Retry connection after a delay
        setTimeout(startConnection, 5000)
      }
    }

    startConnection()

    // Set up connection state change handler
    connection.onclose((err) => {
      setConnectionState(signalR.HubConnectionState.Disconnected)
      if (err) {
        setError(err instanceof Error ? err : new Error("Connection closed with an error"))
        console.error("❌ SignalR connection closed with error:", err)
      } else {
        console.log("SignalR connection closed")
      }
    })

    connection.onreconnecting((err) => {
      setConnectionState(signalR.HubConnectionState.Reconnecting)
      console.log("SignalR reconnecting:", err)
    })

    connection.onreconnected(() => {
      setConnectionState(signalR.HubConnectionState.Connected)
      console.log("✅ SignalR reconnected")
    })

    // Clean up on unmount
    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop().catch(console.error)
      }
    }
  }, [hubUrl, autoConnect])

  // Connect manually (if autoConnect is false)
  const connect = useCallback(async () => {
    if (!connectionRef.current) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build()

      connectionRef.current = connection
    }

    if (connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
      setConnectionState("CONNECTING")
      try {
        await connectionRef.current.start()
        setConnectionState(connectionRef.current.state)
        console.log("✅ Connected to SignalR hub:", hubUrl)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to connect to SignalR hub"))
        setConnectionState(signalR.HubConnectionState.Disconnected)
        console.error("❌ Error connecting to SignalR hub:", err)
        throw err
      }
    }
  }, [hubUrl])

  // Invoke a method on the hub
  const invoke = useCallback(async <T = void>(methodName: string, ...args: any[]): Promise<T> => {
    if (!connectionRef.current) {
      throw new Error("SignalR connection not initialized")
    }

    if (connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR connection not connected")
    }

    try {
      return await connectionRef.current.invoke<T>(methodName, ...args)
    } catch (err) {
      console.error(`❌ Error invoking ${methodName}:`, err)
      throw err
    }
  }, [])

  // Register a handler for a hub method
  const on = useCallback(<T = any>(methodName: string, handler: (...args: T[]) => void) => {
    if (!connectionRef.current) {
      console.warn("SignalR connection not initialized, handler will be registered when connected")
      return () => {}
    }

    connectionRef.current.on(methodName, handler)
    return () => {
      connectionRef.current?.off(methodName, handler)
    }
  }, [])

  // Disconnect from the hub
  const disconnect = useCallback(async () => {
    if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
      try {
        await connectionRef.current.stop()
        setConnectionState(signalR.HubConnectionState.Disconnected)
        console.log("Disconnected from SignalR hub")
      } catch (err) {
        console.error("❌ Error disconnecting from SignalR hub:", err)
        throw err
      }
    }
  }, [])

  return {
    connection: connectionRef.current,
    connectionState,
    isConnected: connectionState === signalR.HubConnectionState.Connected,
    isConnecting: connectionState === "CONNECTING" || connectionState === signalR.HubConnectionState.Reconnecting,
    error,
    invoke,
    on,
    connect,
    disconnect,
  }
}

