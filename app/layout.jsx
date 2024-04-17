import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NavigationEvents } from "@/components/utilities";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kramer",
  description: "Create frame contests @ 1 click",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <NavigationEvents />
      </body>
    </html>
  );
}
