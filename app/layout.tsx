import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '看護デジタルニュース | Nursing Digital News',
  description: '看護・医療に関するデジタル技術の最新ニュースをお届けします',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
