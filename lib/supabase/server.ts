import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createClient = () => {
  return createServerComponentClient<Database>({ cookies });
};
