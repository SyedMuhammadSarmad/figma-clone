import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Weight } from "lucide-react";
import { Room } from "./Room";


const work_Sans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight : ["400","600","700"]
});


export const metadata: Metadata = {
  title: "Figma-clone",
  description: "Beautiful Figma clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${work_Sans.className} bg-primary-grey-200`}
      >
        <Room>
        {children}
        </Room>
      </body>
    </html>
  );
}
