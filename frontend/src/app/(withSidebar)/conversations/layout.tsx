"use client";

import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { ConfigProvider } from "@/domain/config/ConfigProvider";
import { headers } from "next/headers";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "@/app/_components/Sidebar";
import { usePathname, useParams } from "next/navigation";
// import { MainLayout } from "./components/MainLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id } = useParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  return (
    <div className="flex w-full h-full">
      <Sidebar currentConversationId={conversationId} />
      {children}
    </div>
  );
}
