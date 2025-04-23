"use client";

import NoteEditor from "@/components/notes/NoteEditor";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateNotePage() {
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
    return null; // Will redirect in the useEffect
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Note</h1>
      <NoteEditor />
    </div>
  );
}
