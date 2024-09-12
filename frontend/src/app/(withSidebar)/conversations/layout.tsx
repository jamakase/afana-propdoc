"use client";

import Sidebar from "@/app/_components/Sidebar";
import { useParams } from "next/navigation";
// import { MainLayout } from "./components/MainLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id } = useParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  return (
    <div className="flex">
      <Sidebar currentConversationId={conversationId} />
      {children}
    </div>
  );
}
