"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface TrackingContextType {
    sessionId: string
    trackEvent: (eventType: string, data?: any) => void
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined)

export function TrackingProvider({ children }: { children: React.ReactNode }) {
    const [sessionId, setSessionId] = useState<string>("")
    const pathname = usePathname()

    useEffect(() => {
        // Initialize session ID
        let id = localStorage.getItem("tracking_session_id")
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem("tracking_session_id", id)
        }
        setSessionId(id)

        // Track initial page view
        trackEvent("page_view", { path: pathname, referrer: document.referrer })
    }, [])

    // Track page changes
    useEffect(() => {
        if (sessionId) {
            trackEvent("page_view", { path: pathname })
        }
    }, [pathname, sessionId])

    const trackEvent = async (eventType: string, data: any = {}) => {
        const currentSessionId = sessionId || localStorage.getItem("tracking_session_id")
        if (!currentSessionId) return

        const payload = {
            sessionId: currentSessionId,
            eventType,
            pagePath: window.location.pathname,
            data,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
        }

        // Use sendBeacon for reliability on page unload if needed, 
        // but for regular events fetch is fine.
        try {
            fetch("/api/tracking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                // Keepalive helps ensure the request completes even if the page is closed
                keepalive: true,
            }).catch(err => console.error("Tracking error:", err))
        } catch (e) {
            console.error("Tracking push failed", e)
        }
    }

    return (
        <TrackingContext.Provider value={{ sessionId, trackEvent }}>
            {children}
        </TrackingContext.Provider>
    )
}

export const useTracking = () => {
    const context = useContext(TrackingContext)
    if (context === undefined) {
        throw new Error("useTracking must be used within a TrackingProvider")
    }
    return context
}
