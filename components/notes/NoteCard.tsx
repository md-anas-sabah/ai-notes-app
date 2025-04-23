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

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const formattedDate = note.updated_at
    ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })
    : "recently";

  return (
    <Card className="h-full flex flex-col">
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
        <Button variant="outline" size="sm" asChild>
          <Link href={`/notes/${note.id}`}>Edit</Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
