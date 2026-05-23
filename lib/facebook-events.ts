import crypto from "crypto"

// Hash user data for privacy-compliant tracking
export function hashUserData(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex")
}

// Send server-side conversion event to Facebook Conversions API
export async function sendFacebookConversionEvent({
  eventName,
  email,
  phone,
  firstName,
  lastName,
  eventSourceUrl,
  userAgent,
  ipAddress,
  fbp,
  fbc,
}: {
  eventName: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  eventSourceUrl: string
  userAgent?: string
  ipAddress?: string
  fbp?: string
  fbc?: string
}) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  const accessToken = process.env.FACEBOOK_CONVERSIONS_TOKEN

  if (!pixelId || !accessToken) {
    console.log("[v0] Facebook Pixel ID or Access Token not configured")
    return { success: false, error: "Missing configuration" }
  }

  const eventTime = Math.floor(Date.now() / 1000)

  const userData: any = {}
  if (email) userData.em = hashUserData(email)
  if (phone) userData.ph = hashUserData(phone.replace(/\D/g, ""))
  if (firstName) userData.fn = hashUserData(firstName)
  if (lastName) userData.ln = hashUserData(lastName)
  if (ipAddress) userData.client_ip_address = ipAddress
  if (userAgent) userData.client_user_agent = userAgent
  if (fbp) userData.fbp = fbp
  if (fbc) userData.fbc = fbc

  const eventData = {
    event_name: eventName,
    event_time: eventTime,
    event_source_url: eventSourceUrl,
    user_data: userData,
    action_source: "website",
  }

  const payload = {
    data: [eventData],
    test_event_code: process.env.FACEBOOK_TEST_EVENT_CODE, // Optional: for testing
  }

  try {
    console.log("[v0] Sending Facebook Conversion event:", eventName)

    const response = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("[v0] Facebook Conversion API error:", result)
      return { success: false, error: result }
    }

    console.log("[v0] Facebook Conversion event sent successfully:", result)
    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Error sending Facebook Conversion event:", error)
    return { success: false, error }
  }
}

// Client-side Facebook Pixel tracking helper
export function trackFacebookEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    console.log("[v0] Tracking Facebook Pixel event:", eventName, data)
      ; (window as any).fbq("track", eventName, data)
  } else {
    console.log("[v0] Facebook Pixel not loaded")
  }
}
