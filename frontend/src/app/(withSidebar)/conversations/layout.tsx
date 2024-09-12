"use client";

import Sidebar from "@/app/_components/Sidebar";
import { api } from "@/domain/api/api";
import { useConfig } from "@/domain/config/ConfigProvider";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id?: string };
}) {
  const conversationId = params.id;
  const router = useRouter();
  const config = useConfig();

  const createConversationMutation = useMutation({
    mutationFn: () => api.createConversation(config.ENDPOINT),
    onSuccess: (response: any) => {
      console.log(response);
      router.push(`/conversations/${response.conversation_id}`);
    },
  });

  return (
    <div className="flex w-full h-full">
      <Sidebar
        currentConversationId={conversationId ?? null}
        onAddConversation={createConversationMutation.mutate}
      />
      {children}
    </div>
  );
}
