"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import NoteEditor from "@/components/notes/NoteEditor";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Note } from "@/types/supabase";

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const noteId = params.id as string;
  const supabase = createClient();

  // Fetch note by ID
  const {
    data: note,
    isLoading: noteLoading,
    error,
  } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) {
        throw error;
      }

      return data as Note;
    },
    enabled: !!noteId && !!user,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  // Check if user owns this note
  useEffect(() => {
    if (note && user && note.user_id !== user.id) {
      router.push("/notes");
    }
  }, [note, user, router]);

  if (authLoading || noteLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-t-primary border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Error loading note</h2>
        <p>{(error as Error).message}</p>
        <button
          onClick={() => router.push("/notes")}
          className="mt-4 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50"
        >
          Back to notes
        </button>
      </div>
    );
  }

  if (!user || !note) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Note</h1>
      <NoteEditor note={note} isEditing={true} />
    </div>
  );
}
