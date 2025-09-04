'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-5xl md:text-7xl font-extrabold text-foreground drop-shadow-lg leading-tight">
        Welcome to <span className="gradient-text">PollWave</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg md:text-2xl text-muted-foreground">
        Create engaging polls, share them instantly with QR codes, and see live results in real&nbsp;time.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link href="/polls/create">
          <Button size="lg" className="shadow-md hover:shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary rounded-full">
            Create Your First Poll
          </Button>
        </Link>
        <Link href="/polls">
          <Button size="lg" variant="outline" className="text-foreground hover:bg-accent/10 hover:text-foreground border-2 border-border rounded-full">
            Browse Polls
          </Button>
        </Link>
      </div>

      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
        {[
          {
            title: 'Instant QR Sharing',
            desc: 'Share a scan-ready QR code for every poll you create.'
          },
          {
            title: 'Real-Time Results',
            desc: 'Watch votes roll in live without refreshing the page.'
          },
          {
            title: 'Secure & Private',
            desc: 'Powered by Supabase with Row Level Security for peace of mind.'
          },
          {
            title: 'Mobile Friendly',
            desc: 'Optimised experience across phones, tablets and desktops.'
          },
          {
            title: 'Multiple Choice',
            desc: 'Allow respondents to pick one or many options with ease.'
          },
          {
            title: 'Open Source',
            desc: 'Built with Next.js 14, Tailwind CSS and shadcn/ui.'
          }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl bg-card backdrop-blur-sm p-6 text-left text-card-foreground border border-border shadow-lg hover:shadow-2xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
            <p className="text-sm opacity-90">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
