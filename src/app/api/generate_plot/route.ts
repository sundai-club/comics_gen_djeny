import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

const SYSTEM_PROMT = `Generate comics story with image prompts and captions in JSON format
    
    Args:
        user_prompt (str): The story prompt from user
        
    Returns:
        dict: JSON formatted comics data
    """

    # System prompt for consistent output formatting
    system_prompt = """
    Create a 3-panel comic story about a dog's adventure. For each panel, provide:
    1. An image generation prompt that includes 'DJENNDOG black dog' and ends with 'cartoonish style, warm colors'
    2. A caption that refers to the dog as 'Djeny'
    
    Format the output as JSON with this structure:
    {
        "comics": [
            {
                "prompt": "Image generation prompt here",
                "caption": "Caption text here"
            }
        ]
    }

    If users prompt is not appropriate for the context, return an empty json:
    {}
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Running the model...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMT
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = completion.choices[0].message.content as string;
    if (!result) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }
    return NextResponse.json({ result: JSON.parse(result) });

  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
} 