import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/domain/config/ConfigProvider";
import { headers } from "next/headers";
import { MainLayout } from "./_components/MainLayout";

const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "afana-propdoc",
  description:
    "Система автоматизации поиска и анализа нормативной документации по строительству объектов",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force dynamic rendering
  headers();

  const config = { ENDPOINT: process.env.API_URL ?? "http://localhost:5000" };

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ConfigProvider configData={config}>
          {/* <MainLayout>{children}</MainLayout> */}
          <MainLayout>{children}</MainLayout>
        </ConfigProvider>
      </body>
    </html>
  );
}
