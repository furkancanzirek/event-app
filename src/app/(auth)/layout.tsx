
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { Provider } from "@/app/Provider";
import { cn } from "@/libs/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or Sign up",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${cn("bg-lightGreen min-h-screen flex flex-col items-center justify-center")} ${inter.className}`}>
          {children}
        </body>
      </Provider>
    </html>
  );
}
