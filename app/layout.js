import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux/provider";
import Navbar from "./componets/navbar/Navbar";
import Footer from "./componets/footer/Footer";
import ErrorBoundary from "./componets/shared/ErrorBoundary";
import AuthProvider from "../lib/AuthProvider";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { LoadingProvider } from "../lib/LoadingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NABA ALI - Premium Fashion Store",
  description: "Discover premium fashion and accessories at NABA ALI. Quality clothing and style for everyone.",
  keywords: "fashion, clothing, premium fashion, accessories, online shopping, NABA ALI",
  authors: [{ name: "NABA ALI" }],
  creator: "NABA ALI",
  publisher: "NABA ALI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nabaali.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <StoreProvider>
            <ReactQueryProvider>
              <LoadingProvider>
                <div className="bg-white min-h-screen text-black">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
              </LoadingProvider>
            </ReactQueryProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
