import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { sessionId, eventType, pagePath, data, userAgent, timestamp } = body

        if (!sessionId || !eventType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Log Event to Supabase tracking_events
        const { error: eventError } = await supabase
            .from("tracking_events")
            .insert([
                {
                    session_id: sessionId,
                    event_type: eventType,
                    page_path: pagePath,
                    data: data || {},
                    created_at: timestamp || new Date().toISOString(),
                },
            ])

        if (eventError) {
            console.error("[Tracking] Supabase event error:", eventError)
        }

        // 2. Update/Upsert Session in Supabase tracking_sessions
        // We attempt to update, then check logic for segmentation
        const { data: sessionData, error: sessionFetchError } = await supabase
            .from("tracking_sessions")
            .select("*")
            .eq("session_id", sessionId)
            .single()

        const isNewSession = !!sessionFetchError

        let updates: any = {
            session_id: sessionId,
            user_agent: userAgent,
            updated_at: new Date().toISOString(),
        }

        if (isNewSession) {
            updates.page_views_count = eventType === "page_view" ? 1 : 0
            updates.form_started = eventType === "form_start"
            updates.form_submitted = eventType === "form_submit"
            updates.total_time_spent = 0
            updates.segment = "curious"
            updates.referrer = data?.referrer || ""
        } else {
            if (eventType === "page_view") updates.page_views_count = (sessionData.page_views_count || 0) + 1
            if (eventType === "form_start") updates.form_started = true
            if (eventType === "form_submit") updates.form_submitted = true
            if (data?.timeSpentSeconds) updates.total_time_spent = data.timeSpentSeconds
        }

        // Segmentation Logic
        const currentViews = updates.page_views_count || sessionData?.page_views_count || 0
        const currentTime = updates.total_time_spent || sessionData?.total_time_spent || 0
        const currentFormStart = updates.form_started || sessionData?.form_started || false

        if (currentViews > 2 || currentTime > 60 || currentFormStart) {
            updates.segment = "serious"
        }

        const { error: upsertError } = await supabase
            .from("tracking_sessions")
            .upsert(updates, { onConflict: "session_id" })

        if (upsertError) {
            console.error("[Tracking] Supabase session error:", upsertError)
        }

        // 3. Log to Google Sheets
        try {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                },
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            })

            const sheets = google.sheets({ version: "v4", auth })
            const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

            if (spreadsheetId) {
                const timestampFr = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" })
                const rowData = [
                    timestampFr,
                    sessionId,
                    eventType,
                    updates.segment || sessionData?.segment || "curious",
                    pagePath,
                    data?.element || data?.field || "",
                    JSON.stringify(data || {}),
                    userAgent || "",
                ]

                // Attempting to append to "Tracking" sheet. 
                // Note: The sheet "Tracking" must exist in the spreadsheet.
                await sheets.spreadsheets.values.append({
                    spreadsheetId,
                    range: "Tracking!A:H",
                    valueInputOption: "USER_ENTERED",
                    insertDataOption: "INSERT_ROWS",
                    requestBody: {
                        values: [rowData],
                    },
                })
            }
        } catch (sheetError) {
            console.error("[Tracking] Google Sheets error:", sheetError)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[Tracking] Unexpected error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
