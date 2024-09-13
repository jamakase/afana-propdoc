"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
  } from "@/components/ui/tooltip"

type Conversation = {
  id: number;
  name: string;
  messages: Array<{ id: number; text: string; sender: string }>;
};

type SidebarProps = {
  data: {id: number, name: string, icon: React.ElementType, href: string}[];
};

export default function MainSidebar({ data }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden py-4 px-1 flex-1 flex-col items-center min-h-0 bg-gray-200 overflow-hidden min-w-14 max-w-14 m-2 rounded-lg gap-2 fixed inset-y-0 left-0 z-10 w-14 border-r bg-background md:flex">
    <h4 className="text-lg font-bold text-black text-center">AFN</h4>
    <nav className="flex flex-col items-center gap-2 w-full sm:py-3">
      {data.map((item) => (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={
                  `${pathname.includes(item.href) ? "bg-black text-white pointer-events-none" : "bg-transparent"} 
                  flex justify-center items-center 
                  w-full h-12 text-balack rounded-lg
                  transition-all duration-500
                  hover:bg-white/70 active:scale-90`
                }
              >
                <item.icon className="h-6 w-6"/>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  </aside>
  );
}
