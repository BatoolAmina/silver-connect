import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata = {
  title: "Silver Connect | Senior Care Registry",
  description: "Architecting the future of senior care in Lucknow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#F9F6EE]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}