"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [comicPanels, setComicPanels] = useState<Array<{
    prompt: string;
    caption: string;
    imageUrl?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  const generateStory = async () => {
    try {
      setIsLoading(true);
      setComicPanels([]);
      
      // First, get the story and prompts from GPT
      const storyResponse = await fetch('/api/generate_plot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const storyData = await storyResponse.json();
      if (storyData.result?.comics) {
        setComicPanels(storyData.result.comics);
        // Start generating images for each panel
        generateNextImage(storyData.result.comics, 0);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const generateNextImage = async (panels: typeof comicPanels, index: number) => {
    if (index >= panels.length) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate_imgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: panels[index].prompt }),
      });
      
      const data = await response.json();
      if (data.imageUrl) {
        setComicPanels(prev => prev.map((panel, i) => 
          i === index ? { ...panel, imageUrl: data.imageUrl } : panel
        ));
        setCurrentPanelIndex(index + 1);
        // Generate next panel's image
        generateNextImage(panels, index + 1);
      }
    } catch (error) {
      console.error('Error:', error);
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
            placeholder="Enter your story prompt..."
            className="px-4 py-2 border rounded-md w-64 text-gray-900"
          />
          <button 
            onClick={generateStory}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Generating Comic...' : 'Generate Comic'}
          </button>
          
          <div className="flex flex-wrap gap-8 mt-8 justify-center">
            {comicPanels.map((panel, index) => (
              <div key={index} className="flex flex-col items-center gap-2 w-[400px]">
                <div className="relative w-[400px] h-[400px] bg-gray-100 rounded-lg">
                  {!panel.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {panel.imageUrl && (
                    <>
                      <Image
                        src={panel.imageUrl}
                        alt={`Panel ${index + 1}`}
                        width={400}
                        height={400}
                        className="rounded-lg"
                      />
                      <p className="text-center max-w-md mt-2">{panel.caption}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
