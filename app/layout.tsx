import './globals.css'
import Providers from '@/components/Providers'

export const metadata = { title: 'IconFly' }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
