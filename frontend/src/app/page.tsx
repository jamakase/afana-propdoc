"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/domain/api/api';
import { useConfig } from '@/domain/config/ConfigProvider';

export default function Home() {
  const router = useRouter();
  const config = useConfig();

  useEffect(() => {
    const redirectToConversation = async () => {
      try {
        const response = await api.get_messages__user_id_(config.ENDPOINT);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          router.push(`/conversations/${response.data[0]}`);
        } else {
          const newConversation = await api.createConversation(config.ENDPOINT);
          router.push(`/conversations/${newConversation.conversation_id}`);
        }
      } catch (error) {
        console.error('Ошибка при перенаправлении:', error);
      }
    };

    redirectToConversation();
  }, [router, config.ENDPOINT]);

  return null; // или можно вернуть компонент загрузки
}