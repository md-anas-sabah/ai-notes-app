import { Note } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const formattedDate = note.updated_at
    ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })
    : "recently";

  const createdAt = note.created_at ? formatDate(note.created_at) : "";

  return (
    <>
      <Card
        className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDialogOpen(true)}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">{note.title}</CardTitle>
          <CardDescription>Updated {formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="line-clamp-3 mb-2 text-sm text-gray-600">
            {note.content}
          </div>
          {note.summary && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              <p className="font-semibold mb-1">Summary:</p>
              <p>{note.summary}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-3 flex justify-between border-t">
          <Button
            variant="outline"
            size="sm"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/notes/${note.id}`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {note.title}
            </DialogTitle>
            <DialogDescription>
              Created on {createdAt} • Updated {formattedDate}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 text-gray-700 whitespace-pre-wrap">
            {note.content}
          </div>

          {note.summary && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2">AI Summary</h3>
              <p>{note.summary}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" asChild>
              <Link href={`/notes/${note.id}`}>Edit</Link>
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
