// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const { content } = await request.json();

//     if (!content || typeof content !== "string") {
//       return NextResponse.json(
//         { error: "Content is required and must be a string" },
//         { status: 400 }
//       );
//     }

//     const deepseekResponse = await fetch(
//       "https://api.deepseek.com/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "deepseek-chat",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are a helpful assistant that creates concise, accurate summaries of text.",
//             },
//             {
//               role: "user",
//               content: `Please provide a concise summary (3-5 sentences) of the following note:\n\n${content}`,
//             },
//           ],
//           temperature: 0.3,
//           max_tokens: 200,
//         }),
//       }
//     );

//     if (!deepseekResponse.ok) {
//       const errorData = await deepseekResponse.json();
//       console.error("DeepSeek API error:", errorData);
//       return NextResponse.json(
//         { error: "Failed to generate summary" },
//         { status: 500 }
//       );
//     }

//     const data = await deepseekResponse.json();
//     const summary = data.choices[0].message.content.trim();

//     return NextResponse.json({ summary });
//   } catch (error) {
//     console.error("Error in summarize API:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("Missing Groq API key");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    try {
      console.log(apiKey);
      const groqResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gemma2-9b-it",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that creates concise, accurate summaries of text.",
              },
              {
                role: "user",
                content: `Please provide a concise summary (3-5 sentences) of the following text:\n\n${content}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 200,
          }),
        }
      );

      if (!groqResponse.ok) {
        const errorData = await groqResponse.json();
        console.error("Groq API error details:", errorData);
        return NextResponse.json(
          {
            error: `Failed to generate summary: ${
              errorData.error?.message || "Unknown API error"
            }`,
          },
          { status: 500 }
        );
      }

      const data = await groqResponse.json();
      const summary = data.choices[0].message.content.trim();

      return NextResponse.json({ summary });
    } catch (fetchError) {
      console.error("Fetch error with Groq API:", fetchError);
      return NextResponse.json(
        { error: "Failed to communicate with summary service" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
