import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'UrbanThread — Minimal Streetwear & Essentials',
    template: '%s — UrbanThread',
  },
  description:
    'UrbanThread is a demo clothing brand offering minimal, considered streetwear essentials — oversized knits, tailored outerwear, and clean footwear. Portfolio demo store; no real orders are processed.',
  keywords: ['streetwear', 'minimal clothing', 'demo ecommerce', 'UrbanThread'],
  openGraph: {
    title: 'UrbanThread — Minimal Streetwear & Essentials',
    description: 'Considered, minimal clothing essentials. Demo store.',
    type: 'website',
    siteName: 'UrbanThread',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanThread — Minimal Streetwear & Essentials',
    description: 'Considered, minimal clothing essentials. Demo store.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#14141A',
                color: '#F7F7F3',
                fontSize: '13px',
                borderRadius: 0,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
