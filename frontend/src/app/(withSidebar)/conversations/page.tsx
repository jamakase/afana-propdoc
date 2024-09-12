"use client";

import { api } from '@/domain/api/api';
import { useConfig } from '@/domain/config/ConfigProvider';
import { MessagesSquare } from 'lucide-react';
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

  return (
    <div className="text-md md:text-xl text-gray-500 font-bold h-full w-full flex flex-col md:flex-row items-center justify-center">
      <MessagesSquare className="w-8 md:w-10 h-8 md:h-10 mr-2" />
      Самое время начать общение!
    </div>
  );
}