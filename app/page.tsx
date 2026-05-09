import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Music2, BarChart3, Heart, Share2, Clock, Star, ArrowRight, ChevronRight } from "lucide-react"

const FEATURES = [
  {
    icon: BarChart3,
    title: "Top Tracks & Artists",
    description: "Your most-played songs and artists over 4 weeks, 6 months, or all time.",
  },
  {
    icon: Clock,
    title: "Listening Heatmap",
    description: "See exactly when you listen most � hour-by-hour and day-by-day.",
  },
  {
    icon: Heart,
    title: "Mood & Vibe Score",
    description: "Audio features turned into a personalised mood profile with 5 dimensions.",
  },
  {
    icon: Music2,
    title: "Genre Diversity",
    description: "Find out how eclectic your taste is with a genre distribution breakdown.",
  },
  {
    icon: Star,
    title: "Music Personality",
    description: "A unique personality type based on your listening patterns.",
  },
  {
    icon: Share2,
    title: "Shareable Card",
    description: "Export a personality card as PNG � share it anywhere.",
  },
]

const STATS = [
  { value: "50+", label: "Tracks analysed" },
  { value: "3",   label: "Time ranges"     },
  { value: "5",   label: "Mood dimensions" },
  { value: "PNG", label: "Export format"   },
]

export default function HomePage({
  searchParams,
}: {
  searchParams?: { error?: string; error_description?: string; error_code?: string }
}) {
  // Supabase sends OAuth errors to site_url (/) with ?error= params — forward them to the login page
  const errDesc = searchParams?.error_description
  const errCode = searchParams?.error
  if (errDesc || errCode) {
    const msg = errDesc ?? errCode ?? "Authentication error"
    redirect(`/auth/login?error=${encodeURIComponent(msg)}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* -- Hero --------------------------------------------------- */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            v2.0 &mdash; Analytics Engine Live
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
            Understand your<br />
            <span className="text-primary">music personality</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Deep-dive Spotify analytics. Discover patterns in your listening history,
            visualise your sonic identity, and share the results.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3 hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider"
            >
              <Music2 className="w-4 h-4" />
              Connect with Spotify
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium text-sm px-6 py-3 hover:bg-card transition-colors uppercase tracking-wider"
            >
              See Features
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            Read-only access &mdash; no writes to your account
          </p>
        </div>

        {/* Dashboard preview mockup */}
        <div className="mt-16 max-w-3xl mx-auto border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#353944]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#353944]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#353944]" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest ml-2">
              spotify-insights / dashboard
            </span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-3">
            {[
              { l: "Top Track",  v: "Blinding Lights" },
              { l: "Top Artist", v: "The Weeknd"       },
              { l: "Mood Score", v: "87 / 100"         },
            ].map(s => (
              <div key={s.l} className="border border-border bg-background p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 font-mono">{s.l}</p>
                <p className="text-sm font-semibold text-foreground truncate">{s.v}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 space-y-2.5">
            {[80, 65, 90, 45, 72].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-mono w-4">{i + 1}</span>
                <div className="flex-1 h-1.5 bg-[#1b1f2a]">
                  <div className="h-1.5 bg-primary" style={{ width: `${w}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">{w}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Stats bar -------------------------------------------- */}
      <section id="stats" className="border-y border-border py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold font-mono text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -- Features --------------------------------------------- */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono mb-3">Features</p>
            <h2 className="text-2xl font-bold text-foreground">Raw Data. Refined.</h2>
            <p className="text-muted-foreground mt-2 text-sm">No Spotify Wrapped wait &mdash; access your stats anytime.</p>
          </div>
          {/* Bento grid: first card spans 2 cols on md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              const wide = i === 0 // first card spans 2 cols on lg
              return (
                <div
                  key={f.title}
                  className={`group border-border border-b last:border-b-0 sm:border-r ${
                    wide ? "lg:col-span-2" : ""
                  } bg-card hover:bg-[#1b1f2a] transition-colors p-6`}
                >
                  <div className="w-8 h-8 bg-[#1b1f2a] group-hover:bg-[#262a35] border border-border flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* -- Bottom CTA ------------------------------------------- */}
      <section className="pb-24 px-6">
        <div className="max-w-xl mx-auto text-center border border-border p-10 bg-card">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono mb-4">Get Started</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to dive in?</h2>
          <p className="text-sm text-muted-foreground mb-6">Connect your Spotify account and get your full stats in seconds.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3 hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider"
          >
            Get started free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* -- Footer ----------------------------------------------- */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Spotify Insights &mdash; Not affiliated with Spotify AB.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/auth/login" className="hover:text-primary transition-colors">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
