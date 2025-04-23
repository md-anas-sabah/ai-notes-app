"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/supabase";
import { useNotes } from "@/lib/hooks/useNotes";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NoteEditorProps {
  note?: Note;
  isEditing?: boolean;
}

export default function NoteEditor({
  note,
  isEditing = false,
}: NoteEditorProps) {
  const router = useRouter();
  const { createNote, updateNote, summarizeContent, isPending } = useNotes();

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [summary, setSummary] = useState(note?.summary || "");
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSummary(note.summary || "");
    }
  }, [note]);

  const handleSummarize = async () => {
    if (!content.trim()) {
      setError("Please add some content to summarize");
      return;
    }

    setSummarizing(true);
    setError(null);

    try {
      const result = await summarizeContent(content);
      if (result) {
        setSummary(result);
      }
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
      console.error("Error summarizing:", err);
    } finally {
      setSummarizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      if (isEditing && note) {
        updateNote({
          id: note.id,
          title,
          content,
          summary: summary || null,
        });
      } else {
        createNote({
          title,
          content,
          summary: summary || null,
          user_id: "",
        });
      }

      router.push("/notes");
    } catch (err) {
      setError("An error occurred while saving your note");
      console.error("Error saving note:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleSummarize}
          disabled={summarizing || !content.trim()}
        >
          {summarizing ? "Summarizing..." : "Generate AI Summary"}
        </Button>
      </div>

      {summary && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="font-semibold mb-2">AI Summary</h3>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/notes")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Note"
            : "Create Note"}
        </Button>
      </div>
    </form>
  );
}
