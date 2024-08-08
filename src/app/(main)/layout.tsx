import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { Provider } from "../Provider";
import { cn } from "@/libs/utils";
import Header from "@/app/components/header/Header";
import Footer from "@/app/components/footer/Footer";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enuygun Events App",
  description: "Welcome to Enuygun Events App",
  applicationName: "Enuygun Events App",
  keywords: ["Enuygun", "Events", "App","Ticket","Concert","Festival","Event","Music","Sport","Theater","Cinema"],
  category: "Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={`${cn(" min-h-screen flex flex-col justify-between")} ${
            inter.className
          }`}
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
