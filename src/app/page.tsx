"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    try {
      setIsLoading(true);
      console.log("Generating image...", prompt);
      const response = await fetch('/api/generate_imgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt..."
            className="px-4 py-2 border rounded-md w-64 text-gray-900"
          />
          <button 
            onClick={generateImage}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
          
          {generatedImage && (
            <Image
              src={generatedImage}
              alt="Generated image"
              width={400}
              height={400}
              className="mt-4 rounded-lg"
            />
          )}
        </div>
      </main>
    </div>
  );
}
