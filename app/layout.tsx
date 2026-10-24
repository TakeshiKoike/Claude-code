import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '看護デジタルニュース | Nursing Digital News',
  description: '看護・医療に関するデジタル技術の最新ニュースをお届けします。博士号を持つ専門家が、電子カルテ、医療DX、看護教育、デジタルヘルスの最前線を発信。',
  keywords: '看護, デジタルヘルス, 医療DX, 電子カルテ, 看護教育, 医療IT, ナースIT',
  openGraph: {
    title: '看護デジタルニュース | Nursing Digital News',
    description: '看護・医療に関するデジタル技術の最新ニュースをお届けします',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '看護デジタルニュース',
    description: '看護・医療に関するデジタル技術の最新ニュースをお届けします',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Google AdSense: 審査通過後に下記のコメントを解除してください
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        */}
      </head>
      <body>{children}</body>
    </html>
  )
}
