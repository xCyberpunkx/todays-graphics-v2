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
                Sites Web Haute Performance <br />
                <span className="text-primary">Qui Font Croître Votre Entreprise</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Nous créons des sites web rapides, modernes et axés sur la conversion qui transforment votre présence en
                ligne en un puissant moteur de croissance.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="#contact">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90">
                    Lancez Votre Projet
                  </Button>
                </Link>
                <Link href="#projects">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg border-border hover:bg-accent bg-transparent"
                  >
                    Voir Les Exemples
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
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Nos Services Web</h2>
              <p className="mt-4 text-muted-foreground">Solutions expertes adaptées à vos objectifs commerciaux.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
              {[
                {
                  title: "Développement & Design Web",
                  desc: "Sites web complets alliant design moderne et fonctionnalités avancées. Nous créons des expériences numériques sur mesure qui captivent vos visiteurs et convertissent efficacement.",
                  icon: Laptop,
                  features: [
                    "Sites d'entreprise professionnels",
                    "Pages d'atterrissage à haute conversion",
                    "Design UI/UX intuitif et engageant",
                    "Portfolios créatifs et élégants",
                  ],
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
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Projets Récents</h2>
                <p className="mt-4 text-muted-foreground">
                  Un aperçu des solutions haute performance que nous avons livrées.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "MF Béton",
                  category: "Site industriel béton préfabriqué",
                  id: 1,
                  image: "/mfbeton.png",
                  alt: "MF Béton - Excellence industrielle",
                  url: "https://mfbeton-dz.vercel.app/",
                },
                {
                  title: "KTM - Kadri Transformation Métallique",
                  category: "Site corporate d'entreprise industrielle",
                  id: 3,
                  image: "/ktm.png",
                  alt: "KTM - Transformation métallique",
                  url: "https://www.k-tm.com/",
                },
                {
                  title: "Portfolio Graphic Designer",
                  category: "Site portfolio professionnel",
                  id: 6,
                  image: "/portfolio.png",
                  alt: "Portfolio ROUABAH Zine Eddine",
                  url: "https://mokhtefi-safwan.vercel.app/",
                },
                {
                  title: "Geneltech",
                  category: "Site corporate d'entreprise industrielle",
                  id: 4,
                  image: "/geneltech.png",
                  alt: "Geneltech - Excellence Industrielle",
                  url: "https://geneltech.vercel.app/",
                },
               
                {
                  title: "Sarl C.O.H",
                  category: "Site corporate d'entreprise industrielle",
                  id: 2,
                  image: "/coh.png",
                  alt: "Sarl C.O.H - Solutions industrielle",
                  url: "https://coh-six.vercel.app/",
                },
                {
                  title: "Cabinet Benserai",
                  category: "Site professionnel de conseil",
                  id: 5,
                  image: "/cabinet.png",
                  alt: "Cabinet Benserai - Conseil professionnel",
                  url: "https://cabinet-benserai.com/",
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
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Construisons Votre Site Web</h2>
              <p className="mt-4 text-muted-foreground">
                Prêt à faire passer votre présence numérique au niveau supérieur? Contactez-nous aujourd'hui.
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
              © {new Date().getFullYear()} Today's Graphics... Tous droits réservés.
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
