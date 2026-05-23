import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export default function MerciPage() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-6 overflow-hidden bg-background">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/merci_page_bg.png"
                    alt="Premium Background"
                    fill
                    className="object-cover opacity-60 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
            </div>

            {/* Content Card */}
            <div className="relative z-10 max-w-lg w-full p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                        <CheckCircle2 className="relative h-24 w-24 text-primary animate-in slide-in-from-bottom-4 duration-1000" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                    Merci !
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    Votre demande de devis a été reçue avec succès. Nos experts l'étudient et vous recontacteront dans les plus brefs délais.
                </p>

                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-50" />

                <p className="mt-8 text-sm font-medium text-primary uppercase tracking-widest opacity-80">
                    Today's Graphics...
                </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    )
}
