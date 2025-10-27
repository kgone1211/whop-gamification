import Link from 'next/link';
import { LayoutDashboard, Trophy, Award, Settings } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Whop Gamify
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
              <Link
                href="/badges"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Award className="w-4 h-4" />
                Badges
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built for Whop | Gamification & Badging System</p>
        </div>
      </footer>
    </div>
  );
}
