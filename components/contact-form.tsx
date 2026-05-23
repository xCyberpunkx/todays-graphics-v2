"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { trackFacebookEvent } from "@/lib/facebook-events"
import { useTracking } from "./tracking-provider"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom est trop court" }),
  company: z.string().optional(),
  businessDomain: z.string().optional(),
  email: z.string().email({ message: "Adresse email invalide" }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  wilaya: z.string().min(1, { message: "Veuillez sélectionner une wilaya" }),
  address: z.string().optional(),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { trackEvent } = useTracking()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      company: "",
      businessDomain: "",
      email: "",
      phone: "",
      wilaya: "",
      address: "",
      message: "",
    },
  })

  useEffect(() => {
    const handleFormInteraction = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      if (target) {
        trackEvent("field_interaction", {
          field: target.name || target.id,
          type: e.type
        })
      }

      // Only track form_start once
      const hasStarted = sessionStorage.getItem("form_started")
      if (!hasStarted) {
        trackFacebookEvent("InitiateContact")
        trackEvent("form_start")
        sessionStorage.setItem("form_started", "true")
        console.log("[v0] User started filling contact form")
      }
    }

    const formElement = document.querySelector("form")
    formElement?.addEventListener("focusin", handleFormInteraction)
    formElement?.addEventListener("change", handleFormInteraction)

    return () => {
      formElement?.removeEventListener("focusin", handleFormInteraction)
      formElement?.removeEventListener("change", handleFormInteraction)
    }
  }, [trackEvent])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    console.log("[v0] Starting form submission with data:", data)

    trackFacebookEvent("Purchase", {
      content_name: "Contact Form",
      content_category: data.businessDomain || "General",
    })

    trackEvent("form_submit_attempt", { domain: data.businessDomain })

    try {
      const fbp = getCookie("_fbp")
      const fbc = getCookie("_fbc")

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          fbp, // Send Facebook pixel cookie
          fbc, // Send Facebook click ID cookie
        }),
      })

      const result = await response.json()
      console.log("[v0] Server response received:", result)

      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue")
      }

      trackFacebookEvent("Purchase", {
        content_name: "Contact Form Submitted",
        status: "success",
      })

      trackEvent("form_submit", { status: "success" })

      router.push("/merci")
    } catch (error) {
      console.error("[v0] Submission error:", error)
      trackEvent("form_submit_error", { error: error instanceof Error ? error.message : "Unknown" })
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'envoi du message")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      {/* Nom complet (obligatoire) */}
      <div className="grid gap-2">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">Nom complet</label>
          <span className="text-red-500">*</span>
        </div>
        <Input
          {...form.register("fullName")}
          placeholder="Mohammed Amir"
          className="border-input bg-background focus-visible:ring-primary"
          disabled={isSubmitting}
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
        )}
      </div>

      {/* Société */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Société</label>
        <Input
          {...form.register("company")}
          placeholder="Nom de votre entreprise"
          className="border-input bg-background focus-visible:ring-primary"
          disabled={isSubmitting}
        />
      </div>

      {/* Domaine d'activité */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Domaine d'activité</label>
        <Input
          {...form.register("businessDomain")}
          placeholder="ex. E-commerce, Conseil, Technologie"
          className="border-input bg-background focus-visible:ring-primary"
          disabled={isSubmitting}
        />
      </div>

      {/* Email (obligatoire) */}
      <div className="grid gap-2">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">Adresse e-mail</label>
          <span className="text-red-500">*</span>
        </div>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="mohammed@exemple.com"
          className="border-input bg-background focus-visible:ring-primary"
          disabled={isSubmitting}
        />
        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
      </div>

      {/* Téléphone (obligatoire) */}
      <div className="grid gap-2">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">Numéro de téléphone</label>
          <span className="text-red-500">*</span>
        </div>
        <Input
          {...form.register("phone")}
          type="tel"
          placeholder="+213 xxxxxxxx"
          className="border-input bg-background focus-visible:ring-primary"
          disabled={isSubmitting}
        />
        {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
      </div>

      {/* Wilaya (obligatoire) */}
      <div className="grid gap-2">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">Wilaya</label>
          <span className="text-red-500">*</span>
        </div>
        <select
          {...form.register("wilaya")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          <option value="">Sélectionnez une wilaya</option>
          <option value="01-Adrar">01 - Adrar</option>
          <option value="02-Chlef">02 - Chlef</option>
          <option value="03-Laghouat">03 - Laghouat</option>
          <option value="04-Oum El Bouaghi">04 - Oum El Bouaghi</option>
          <option value="05-Batna">05 - Batna</option>
          <option value="06-Béjaïa">06 - Béjaïa</option>
          <option value="07-Biskra">07 - Biskra</option>
          <option value="08-Béchar">08 - Béchar</option>
          <option value="09-Blida">09 - Blida</option>
          <option value="10-Bouïra">10 - Bouïra</option>
          <option value="11-Tamanrasset">11 - Tamanrasset</option>
          <option value="12-Tébessa">12 - Tébessa</option>
          <option value="13-Tlemcen">13 - Tlemcen</option>
          <option value="14-Tiaret">14 - Tiaret</option>
          <option value="15-Tizi Ouzou">15 - Tizi Ouzou</option>
          <option value="16-Alger">16 - Alger</option>
          <option value="17-Djelfa">17 - Djelfa</option>
          <option value="18-Jijel">18 - Jijel</option>
          <option value="19-Sétif">19 - Sétif</option>
          <option value="20-Saïda">20 - Saïda</option>
          <option value="21-Skikda">21 - Skikda</option>
          <option value="22-Sidi Bel Abbès">22 - Sidi Bel Abbès</option>
          <option value="23-Annaba">23 - Annaba</option>
          <option value="24-Guelma">24 - Guelma</option>
          <option value="25-Constantine">25 - Constantine</option>
          <option value="26-Médéa">26 - Médéa</option>
          <option value="27-Mostaganem">27 - Mostaganem</option>
          <option value="28-M'Sila">28 - M'Sila</option>
          <option value="29-Mascara">29 - Mascara</option>
          <option value="30-Ouargla">30 - Ouargla</option>
          <option value="31-Oran">31 - Oran</option>
          <option value="32-El Bayadh">32 - El Bayadh</option>
          <option value="33-Illizi">33 - Illizi</option>
          <option value="34-Bordj Bou Arréridj">34 - Bordj Bou Arréridj</option>
          <option value="35-Boumerdès">35 - Boumerdès</option>
          <option value="36-El Tarf">36 - El Tarf</option>
          <option value="37-Tindouf">37 - Tindouf</option>
          <option value="38-Tissemsilt">38 - Tissemsilt</option>
          <option value="39-El Oued">39 - El Oued</option>
          <option value="40-Khenchela">40 - Khenchela</option>
          <option value="41-Souk Ahras">41 - Souk Ahras</option>
          <option value="42-Tipaza">42 - Tipaza</option>
          <option value="43-Mila">43 - Mila</option>
          <option value="44-Aïn Defla">44 - Aïn Defla</option>
          <option value="45-Naâma">45 - Naâma</option>
          <option value="46-Aïn Témouchent">46 - Aïn Témouchent</option>
          <option value="47-Ghardaïa">47 - Ghardaïa</option>
          <option value="48-Relizane">48 - Relizane</option>
          <option value="49-Timimoun">49 - Timimoun</option>
          <option value="50-Bordj Badji Mokhtar">50 - Bordj Badji Mokhtar</option>
          <option value="51-Ouled Djellal">51 - Ouled Djellal</option>
          <option value="52-Béni Abbès">52 - Béni Abbès</option>
          <option value="53-In Salah">53 - In Salah</option>
          <option value="54-In Guezzam">54 - In Guezzam</option>
          <option value="55-Touggourt">55 - Touggourt</option>
          <option value="56-Djanet">56 - Djanet</option>
          <option value="57-El M'Ghaïer">57 - El M'Ghaïer</option>
          <option value="58-El Méniaa">58 - El Méniaa</option>
          <option value="59-Aflou">59 - Aflou</option>
          <option value="60-Aïn Oussera">60 - Aïn Oussera</option>
          <option value="61-Barika">61 - Barika</option>
          <option value="62-Bir el-Ater">62 - Bir el-Ater</option>
          <option value="63-Bou Saâda">63 - Bou Saâda</option>
          <option value="64-El Abiodh Sidi Cheikh">64 - El Abiodh Sidi Cheikh</option>
          <option value="65-El Aricha">65 - El Aricha</option>
          <option value="66-El Kantara">66 - El Kantara</option>
          <option value="67-Ksar Chellala">67 - Ksar Chellala</option>
          <option value="68-Ksar El Boukhari">68 - Ksar El Boukhari</option>
          <option value="69-Messaad">69 - Messaad</option>
        </select>
        {form.formState.errors.wilaya && <p className="text-sm text-red-500">{form.formState.errors.wilaya.message}</p>}
      </div>

      {/* Adresse */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Adresse</label>
        <Input
          {...form.register("address")}
          placeholder="Beni mared, Blida"
          className="border-input bg-background focus-visible:ring-primary"
          disabled={isSubmitting}
        />
      </div>



      <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Demandez un devis"
        )}
      </Button>
    </form>
  )
}
