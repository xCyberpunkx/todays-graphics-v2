"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    const phoneNumber = "213780817833"
    const whatsappUrl = `https://wa.me/${phoneNumber}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#20bd5a] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
            aria-label="Contacter sur WhatsApp"
        >
            <MessageCircle className="h-8 w-8" />
            <span className="sr-only">Contacter sur WhatsApp</span>
        </a>
    )
}
