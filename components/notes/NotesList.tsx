"use client";

import { useNotes } from "@/lib/hooks/useNotes";
import NoteCard from "./NoteCard";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { useState } from "react";

export default function NotesList() {
  const { notes, isLoading, error, deleteNote } = useNotes();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteNote(deleteId);
    }
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-t-primary border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 max-w-md">
          <p className="font-semibold">Error loading notes</p>
          <p className="text-sm mt-1">{(error as Error).message}</p>
        </div>

        <Button className="mt-4" asChild>
          <Link href="/notes/create">Create a new note</Link>
        </Button>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">No notes yet</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Create your first note to get started. You can add content and get
          AI-powered summaries.
        </p>
        <Button size="lg" asChild>
          <Link href="/notes/create">Create Your First Note</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={handleDeleteClick} />
        ))}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
