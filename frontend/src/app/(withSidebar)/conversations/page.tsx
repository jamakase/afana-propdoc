"use client";

import { api } from '@/domain/api/api';
import { useConfig } from '@/domain/config/ConfigProvider';
import { useQuery } from 'react-query';

export default function Home() {
  const config = useConfig();

  const { data: conversations = [] } = useQuery('conversations', () => 
    api.get_messages__user_id_(config.ENDPOINT)
      .then(response => response.data.map((id: number, index: number) => ({
        id,
        name: `Чат ${index + 1}`,
        messages: []
      })))
  );

  return "Самое время начать общение!";
}