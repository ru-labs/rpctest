import { Analytics } from '@vercel/analytics/react';
import Footer from './Footer';
import { ThemeProvider } from './ThemeContext';
import TopMenu from './TopMenu';
import './globals.css';

export const metadata = {
  title: 'sol.RPCTest.com - Solana RPC Performance Comparison',
  description: 'Realtime Solana RPC provider performance comparison and metrics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <html lang="en" data-theme="dark">
        <body className="bg-base">
          <div className="flex flex-col min-h-screen justify-between text-base-content">
            <TopMenu />
            <div className="flex-1 container self-center mb-auto">
              {children}
            </div>
            <Footer />
          </div>
          <Analytics />
        </body>
      </html>
    </ThemeProvider>
  )
}
