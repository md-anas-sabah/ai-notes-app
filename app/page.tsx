import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Your Ideas, Enhanced by AI
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
        Capture your thoughts, organize your ideas, and let AI help you
        summarize and find insights in your notes. Get started with AI Notes
        today.
      </p>
      <div className="mt-10 flex gap-x-6">
        <Button asChild size="lg">
          <Link href="/auth/signup">Get Started</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
