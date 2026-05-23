import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Laptop } from "lucide-react"
import { ContactForm } from "@/components/contact-form" // imported the new ContactForm component

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Today's Graphics... Logo"
              width={400}
              height={400}
              className="h-16 w-auto md:h-20"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#services" className="transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="#projects" className="transition-colors hover:text-primary">
              Projets
            </Link>

            <Link href="#contact">
              <Button variant="outline" className="border-border hover:bg-accent bg-transparent">
                Contactez-nous
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-18 md:py-24 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
            <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                Transformez vos idées en brochures professionnelles qui font la différence
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Nous créons des brochures sur mesure, conçues pour attirer, convaincre et laisser une impression durable sur votre audience.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="#contact">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90">
                    Lancer Votre Projet
                  </Button>
                </Link>
                <Link href="#projects">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg border-border hover:bg-accent bg-transparent"
                  >
                    Voir Nos Créations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </section>

        {/* Services Section */}
        <section id="services" className=" ">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Nos Services Créatifs</h2>
              <p className="mt-4 text-muted-foreground">Des solutions visuelles professionnelles adaptées à votre image de marque.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
              {[
                {
                  title: "Social Media Design & contenu digital",
                  desc: "Création de visuels optimisés pour les réseaux sociaux, stories et publications engageantes qui renforcent votre présence en ligne.",
                  icon: Laptop,
                  features: ["Templates de publications", "Stories animées", "Guides de style pour réseaux sociaux"],
                },
                {
                  title: "Branding & identité visuelle complète",
                  desc: "Conception d'identités visuelles cohérentes : logos, palettes de couleurs, typographies et guidelines de marque.",
                  icon: Laptop,
                  features: ["Création de logo", "Guide de marque", "Applications visuelles"],
                },
                {
                  title: "Supports publicitaires (flyers, affiches, bannières)",
                  desc: "Conception de supports imprimés et numériques percutants pour vos campagnes et événements.",
                  icon: Laptop,
                  features: ["Flyers & affiches", "Bannières publicitaires", "Visuels pour campagnes"],
                },
                {
                  title: "Création de brochures & catalogues",
                  desc: "Brochures et catalogues sur mesure, structurés pour mettre en valeur vos produits et services avec élégance.",
                  icon: Laptop,
                  features: ["Mise en page professionnelle", "Version print & digitale", "Optimisation éditoriale"],
                },
                {
                  title: "Packaging & design produit",
                  desc: "Design d'emballages attractifs et fonctionnels qui racontent l'histoire de votre produit et séduisent le consommateur.",
                  icon: Laptop,
                  features: ["Maquettes produit", "Étiquettes & boîtes", "Adaptation aux contraintes techniques"],
                },
                {
                  title: "Supports de communication corporate",
                  desc: "Création de présentations, rapports annuels et documents d'entreprise au rendu soigné et professionnel.",
                  icon: Laptop,
                  features: ["Présentations PowerPoint", "Rapports imprimés", "Documents institutionnels"],
                },
              ].map((service, i) => (
                <Card
                  key={i}
                  className="group border-border bg-card transition-all hover:border-primary/50 hover:bg-accent/50 h-full"
                >
                  <CardHeader>
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <service.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-4xl mb-2">{service.title}</CardTitle>
                    <p className="text-muted-foreground">{service.desc}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span className="text-md">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section id="projects" className="py-24">
          <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Nos Réalisations</h2>
                <p className="mt-4 text-muted-foreground">Exemples de projets de design graphique et supports imprimés réalisés pour nos clients.</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Brochure corporate premium",
                  category: "Brochure d'entreprise haut de gamme",
                  id: 1,
                  image: "/WhatsApp Image 2026-05-22 at 19.04.28.jpeg",
                  alt: "Brochure corporate premium",
                  url: "#",
                },
                {
                  title: "Catalogue produit moderne",
                  category: "Catalogue produit au design épuré",
                  id: 2,
                  image: "/WhatsApp Image 2026-05-22 at 19.04.28 (1).jpeg",
                  alt: "Catalogue produit moderne",
                  url: "#",
                },
                {
                  title: "Branding identité visuelle",
                  category: "Refonte d'identité visuelle complète",
                  id: 3,
                  image: "/WhatsApp Image 2026-05-22 at 19.04.28 (2).jpeg",
                  alt: "Branding identité visuelle",
                  url: "#",
                },
                {
                  title: "Packaging design professionnel",
                  category: "Design d'emballage produit",
                  id: 4,
                  image: "/WhatsApp Image 2026-05-22 at 19.04.28 (3).jpeg",
                  alt: "Packaging design professionnel",
                  url: "#",
                },
                {
                  title: "Campagne réseaux sociaux",
                  category: "Visuels de campagne pour réseaux sociaux",
                  id: 5,
                  image: "/WhatsApp Image 2026-05-22 at 19.04.29.jpeg",
                  alt: "Campagne réseaux sociaux",
                  url: "#",
                },
                {
                  title: "Présentation corporate élégante",
                  category: "Présentation institutionnelle soignée",
                  id: 6,
                  image: "/WhatsApp Image 2026-05-22 at 19.04.29 (1).jpeg",
                  alt: "Présentation corporate élégante",
                  url: "#",
                },
              ].map((project) => (
                <Link
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-muted transition-all hover:scale-[1.02] block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.alt}
                    fill
                    className="object-contain p-4 opacity-90 transition-opacity group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 translate-y-4 transition-all group-hover:opacity-100 group-hover:translate-y-0 bg-black/40">
                    <h3 className="text-xl font-bold text-white text-center mb-2">{project.title}</h3>
                    <p className="text-sm text-white/80 text-center mb-4">{project.category}</p>
                    <div className="flex items-center gap-2 text-white bg-primary/20 px-4 py-2 rounded-lg">
                      <span className="text-sm">Visiter le site</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-white/70">{project.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Construisons Votre Prochaine Identité Visuelle</h2>
              <p className="mt-4 text-muted-foreground">
                Prêt à donner une image professionnelle à votre entreprise ? Contactez-nous dès aujourd’hui.
              </p>
            </div>
            <Card className="mx-auto max-w-xl border-border bg-card">
              <CardContent className="p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Today's Graphics... Logo"
                width={350}
                height={84}
                className="h-16 w-auto md:h-20"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2026 Today’s Graphics. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
