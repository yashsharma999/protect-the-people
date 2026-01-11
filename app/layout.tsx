import type { Metadata } from 'next'
import { DM_Sans, Nothing_You_Could_Do } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dm-sans' 
})

const scriptFont = Nothing_You_Could_Do({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-nothing-you-could-do' 
})

export const metadata: Metadata = {
  title: 'Protect The People Foundation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${scriptFont.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

