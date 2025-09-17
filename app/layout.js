import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux/provider";
import Navbar from "./componets/navbar/Navbar";
import Footer from "./componets/footer/Footer";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
            <div className="bg-white min-h-screen text-black">
              <Navbar />
              {children}
              <Footer />
            </div>
          </StoreProvider>
      </body>
    </html>
  );
}
