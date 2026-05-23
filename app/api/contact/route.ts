import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import crypto from "crypto" // added for CAPI hashing
import { sendFacebookConversionEvent } from "@/lib/facebook-events"
import { supabase } from "@/lib/supabase"

// Helper to hash data for Facebook
const hashData = (data: string) => {
  if (!data) return ""
  return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { fullName, email, phone, wilaya, company, businessDomain, address, message } = body

    if (!fullName || !email || !phone || !wilaya) {
      return NextResponse.json(
        { error: "Les champs Nom complet, Email, Téléphone et Wilaya sont obligatoires" },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 })
    }

    console.log("[v0] Contact form request received:", body)

    const userAgent = request.headers.get("user-agent") || undefined
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] || request.ip || undefined
    const eventSourceUrl =
      request.headers.get("referer") || request.headers.get("origin") || "https://todays-graphics.com"
    const fbp = body.fbp || undefined
    const fbc = body.fbc || undefined

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || undefined

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    console.log("[v0] Auth email check:", !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL)
    console.log("[v0] Auth key check:", !!process.env.GOOGLE_SHEETS_PRIVATE_KEY)
    console.log("[v0] Spreadsheet ID check:", !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID)

    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY || !spreadsheetId) {
      const missingVars = []
      if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) missingVars.push("EMAIL")
      if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) missingVars.push("KEY")
      if (!spreadsheetId) missingVars.push("ID")

      console.error(`Missing variables: ${missingVars.join(", ")}`)
      return NextResponse.json({ error: `Configuration manquante: ${missingVars.join(", ")}` }, { status: 500 })
    }

    // Facebook Pixel Event Payload
    // Facebook Pixel Event Payload
    // Removed manual CAPI fetch to avoid double counting (using sendFacebookConversionEvent below)

    // Fetching sheet info...
    console.log("[v0] Fetching sheet info...")
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    // Get all sheet names
    const sheetNames = spreadsheetInfo.data.sheets?.map((sheet) => sheet.properties?.title) || []
    console.log("[v0] Available sheets:", sheetNames)

    // Use the first sheet or "Contacts" if it exists
    const firstSheetName = sheetNames[0] || "Sheet1"
    console.log("[v0] Using sheet name:", firstSheetName)

    // Prepare row data
    const timestamp = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" })
    const rowData = [
      timestamp,
      fullName,
      email,
      phone,
      wilaya,
      company || "",
      businessDomain || "",
      address || "",
      message || "",
    ]

    console.log("[v0] Attempting to append row to sheet:", rowData)

    // Try different range formats
    const rangeOptions = [
      firstSheetName, // Just sheet name
      `${firstSheetName}!A:H`, // Sheet with columns
      `${firstSheetName}!A1:H1`, // Sheet with specific range
      "A:H", // Just columns
    ]

    let lastError = null

    for (const range of rangeOptions) {
      try {
        console.log("[v0] Trying range:", range)

        const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: range,
          valueInputOption: "USER_ENTERED", // Changed from RAW
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [rowData],
          },
        })

        console.log("[v0] Google Sheets append successful with range:", range)
        console.log("[v0] Response:", {
          updatedRange: response.data.updates?.updatedRange,
          updatedCells: response.data.updates?.updatedCells,
        })

        await sendFacebookConversionEvent({
          eventName: "Purchase",
          email,
          phone,
          firstName,
          lastName,
          eventSourceUrl,
          userAgent,
          ipAddress,
          fbp,
          fbc,
        })

        // Supabase insertion
        try {
          console.log("[v0] Attempting Supabase insertion with data:", {
            full_name: fullName,
            email,
            phone,
            wilaya: wilaya || null,
            company: company || null,
            business_domain: businessDomain || null,
            address: address || null,
            message: message || null,
          })

          const { data, error: supabaseError } = await supabase
            .from("contacts")
            .insert([
              {
                full_name: fullName,
                email,
                phone,
                wilaya: wilaya || null,
                company: company || null,
                business_domain: businessDomain || null,
                address: address || null,
                message: message || null,
              },
            ])
            .select()

          if (supabaseError) {
            console.error("[v0] Supabase insertion FAILED:", supabaseError)
          } else {
            console.log("[v0] Supabase insertion SUCCESSFUL. Data:", data)
          }
        } catch (err) {
          console.error("[v0] Unexpected Supabase error:", err)
        }

        return NextResponse.json({ message: "Formulaire soumis avec succès!" }, { status: 200 })
      } catch (error: any) {
        lastError = error
        console.log(`[v0] Range "${range}" failed:`, error.message)
        continue // Try next range
      }
    }

    // If all ranges failed
    throw lastError || new Error("All range formats failed")
  } catch (error: any) {
    console.error("Error submitting form:", {
      message: error.message,
      code: error.code,
      errors: error.errors,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: "Erreur lors de la soumission du formulaire. Veuillez réessayer.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
