import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

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
    const output = await replicate.run(
      "sundai-club/flux-djenydog:8a68b1465db20fe37fde4d3f9abfc378df33eb69615c97280dc5462fd475b2cc",
      {
        input: {
          prompt: prompt,
          num_inference_steps: 8,
          model: "schnell"
        }
      }
    );

    const img_url = String(output);
    return NextResponse.json({ imageUrl: img_url });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
} 