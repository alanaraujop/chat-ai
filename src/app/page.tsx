'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import Chat from '@/components/Chat';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // if (!user) {
  //   return <LoginForm />;
  // }

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </div>
  );
}
