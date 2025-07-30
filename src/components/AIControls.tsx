"use client";
import { useState } from "react";
import { aiService, AIRequest } from "@/lib/ai";

interface AIControlsProps {
  content: string;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  onContentGenerated: (newContent: string) => void;
}

export function AIControls({ content, isGenerating, setIsGenerating, onContentGenerated }: AIControlsProps) {
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic'>('anthropic');

  const writingActions = [
    {
      id: "improve",
      title: "Improve Writing",
      description: "Enhance clarity, grammar, and style",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: "expand",
      title: "Expand Content",
      description: "Add more details and examples",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      id: "summarize",
      title: "Summarize",
      description: "Create a concise summary",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "rewrite",
      title: "Rewrite",
      description: "Rephrase with different tone",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ];

  const handleAction = async (actionId: string) => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const request: AIRequest = {
        content,
        action: actionId as any,
        style: selectedStyle as any,
        tone: selectedTone.toLowerCase() as any,
        customPrompt: actionId === 'custom' ? customPrompt : undefined,
        provider: selectedProvider,
      };

      const response = await aiService.generateContent(request);
      onContentGenerated(response.content);
    } catch (error) {
      console.error('AI generation error:', error);
      // You could add a toast notification here for error handling
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-black">
          AI Writing Assistant
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-black text-sm">
            {selectedProvider === 'anthropic' ? 'Claude Ready' : 'GPT-4 Ready'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {writingActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={isGenerating || !content.trim()}
            className="w-full p-4 text-left bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg transition-transform duration-200 hover:scale-110">
                {action.icon}
              </div>
              <h4 className="font-medium text-black">
                {action.title}
              </h4>
            </div>
            <p className="text-sm text-slate-600">
              {action.description}
            </p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            AI Provider
          </label>
          <select 
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as 'openai' | 'anthropic')}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="anthropic">Claude (Anthropic) - Free Tier</option>
            <option value="openai">GPT-4 (OpenAI) - Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Writing Style
          </label>
          <select 
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {["Friendly", "Formal", "Persuasive", "Informative", "Humorous"].map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  selectedTone === tone 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-slate-200 text-slate-700 hover:bg-blue-200 hover:text-blue-800'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-200 gap-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI powered by GPT-4</span>
          </div>
          
          <button
            onClick={() => handleAction("custom")}
            disabled={isGenerating || !content.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Generate with AI"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 