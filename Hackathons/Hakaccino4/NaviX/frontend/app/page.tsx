'use client';
import dynamic from 'next/dynamic';

const ChatPage = dynamic(() => import('@/app/chat/page'), { ssr: false });

export default function Home() {
  return <ChatPage />;
}
