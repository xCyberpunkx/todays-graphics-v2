"use client"

import { useEffect, useRef } from "react"
import { useTracking } from "./tracking-provider"

export function TrackingListener() {
    const { trackEvent } = useTracking()
    const startTimeRef = useRef<number>(Date.now())
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // 1. Click tracking
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const clickable = target.closest("button, a, input, select, textarea")

            if (clickable) {
                trackEvent("click", {
                    element: clickable.tagName.toLowerCase(),
                    id: clickable.id || undefined,
                    text: clickable.textContent?.trim().substring(0, 50) || (clickable as HTMLInputElement).value || undefined,
                    className: clickable.className,
                })
            }
        }

        // 2. Time on page tracking (Heartbeat every 30 seconds)
        heartbeatIntervalRef.current = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
            trackEvent("heartbeat", { timeSpentSeconds: timeSpent })
        }, 30000)

        // 3. Track time spent when leaving the page
        const handleBeforeUnload = () => {
            const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
            trackEvent("exit", { timeSpentSeconds: timeSpent })
        }

        window.addEventListener("click", handleClick)
        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            window.removeEventListener("click", handleClick)
            window.removeEventListener("beforeunload", handleBeforeUnload)
            if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
        }
    }, [trackEvent])

    return null // This component doesn't render anything
}
