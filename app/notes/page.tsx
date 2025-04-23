"use client";

import NotesList from "@/components/notes/NotesList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-t-primary border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button asChild>
          <Link href="/notes/create">Create New Note</Link>
        </Button>
      </div>
      <NotesList />
    </div>
  );
}
