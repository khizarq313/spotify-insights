import Link from "next/link"
import { Mail } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#1b1f2a] border border-border flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;ve sent you a confirmation email. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3 hover:opacity-90 transition-opacity uppercase tracking-wider w-full"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}
