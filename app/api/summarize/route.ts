import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      );
    }

    const deepseekResponse = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that creates concise, accurate summaries of text.",
            },
            {
              role: "user",
              content: `Please provide a concise summary (3-5 sentences) of the following note:\n\n${content}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      }
    );

    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json();
      console.error("DeepSeek API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    const data = await deepseekResponse.json();
    const summary = data.choices[0].message.content.trim();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
