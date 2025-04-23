import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Note } from "@/types/supabase";

export function useNotes() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  //   const { toast } = useToast();

  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return [];
      }

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  // Fetch single note by ID
  const getNote = async (id: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (
      noteData: Omit<Note, "id" | "created_at" | "updated_at">
    ) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("notes")
        .insert({
          ...noteData,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // toast({
      //   title: "Note created",
      //   description: "Your note has been created successfully.",
      // });
    },
    onError: (error) => {
      //   toast({
      //     title: "Error",
      //     description: `Failed to create note: ${error.message}`,
      //     variant: "destructive",
      //   });
      console.log(error);
    },
  });

  // Update a note
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...noteData }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from("notes")
        .update({
          ...noteData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.id] });
      // toast({
      //   title: "Note updated",
      //   description: "Your note has been updated successfully.",
      // });
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to update note: ${error.message}`,
      //   variant: "destructive",
      // });
    },
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // toast({
      //   title: "Note deleted",
      //   description: "Your note has been deleted successfully.",
      // });
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to delete note: ${error.message}`,
      //   variant: "destructive",
      // });
    },
  });

  // Summarize note content using AI
  const summarizeContent = async (content: string) => {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize content");
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error("Error summarizing content:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to generate summary. Please try again.",
      //   variant: "destructive",
      // });
      return null;
    }
  };

  return {
    notes,
    isLoading,
    error,
    getNote,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    summarizeContent,
    isPending:
      createNoteMutation.isPending ||
      updateNoteMutation.isPending ||
      deleteNoteMutation.isPending,
  };
}
