export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-0 gradient-glow" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Whop Gamify
          </h1>
          <p className="text-xl text-muted-foreground">
            Transform course engagement with points, levels, badges, streaks, and leaderboards
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="glass-panel p-6 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Points & Levels</h3>
              <p className="text-sm text-muted-foreground">
                Earn points for completing lessons, passing quizzes, and staying active
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">Badges & Achievements</h3>
              <p className="text-sm text-muted-foreground">
                Unlock exclusive badges by hitting milestones and completing challenges
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Streaks & Leaderboards</h3>
              <p className="text-sm text-muted-foreground">
                Build streaks and compete with others on weekly and monthly leaderboards
              </p>
            </div>
          </div>

          <div className="pt-8">
            <a
              href="/dashboard"
              className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
            >
              View Demo Dashboard
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
