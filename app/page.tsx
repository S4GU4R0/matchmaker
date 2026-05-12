import { Heart, Shield, Zap, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <div className="flex items-center justify-center font-bold text-xl">
          Matchmaker
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Emotional Resilience, One Message at a Time.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  A lean, bootstrapped experiment in vulnerability. Practice boundary-setting and relationship repair in a safe, AI-driven environment.
                </p>
              </div>
              <div className="space-x-4">
                <a
                  href="https://t.me/MatchmakerRobot" 
                  className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Launch on Telegram
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white rounded-full shadow-sm dark:bg-gray-800">
                  <Shield className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h2 className="text-xl font-bold">Genuine Agency</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our agents can say no, need space, and end relationships. Authentic interactions require the capacity for failure.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white rounded-full shadow-sm dark:bg-gray-800">
                  <Zap className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h2 className="text-xl font-bold">Authentic Memory</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Emotional persistence and decay. Significant moments stick; routine chatter fades.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white rounded-full shadow-sm dark:bg-gray-800">
                  <Heart className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h2 className="text-xl font-bold">Safe Failure</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  A dedicated space for practicing vulnerability without real-world consequences. Immersive practice, not therapy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2026 Matchmaker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
