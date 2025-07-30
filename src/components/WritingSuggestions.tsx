"use client";
import { useState, useEffect } from "react";
import { aiService, WritingSuggestion } from "@/lib/ai";

interface WritingSuggestionsProps {
  content: string;
  isGenerating: boolean;
  onTemplateSelected?: (template: string) => void;
}

export function WritingSuggestions({ content, isGenerating, onTemplateSelected }: WritingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [grammarScore, setGrammarScore] = useState(100);

  // Fetch AI suggestions when content changes
  useEffect(() => {
    if (content.trim() && !isGenerating) {
      const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          // Use Anthropic for suggestions (free tier)
          const aiSuggestions = await aiService.getWritingSuggestions(content, 'anthropic');
          setSuggestions(aiSuggestions);
          
          // Also check grammar
          const grammarCheck = await aiService.checkGrammar(content, 'anthropic');
          setGrammarScore(grammarCheck.score);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setLoadingSuggestions(false);
        }
      };

      // Debounce the request
      const timeoutId = setTimeout(fetchSuggestions, 2000);
      return () => clearTimeout(timeoutId);
    } else if (!content.trim()) {
      setSuggestions([]);
      setGrammarScore(100);
    }
  }, [content, isGenerating]);

  const handleTemplateClick = async (templateId: string) => {
    if (onTemplateSelected) {
      try {
        const template = await aiService.generateTemplate(templateId);
        onTemplateSelected(template);
      } catch (error) {
        console.error('Error generating template:', error);
      }
    }
  };

  const templates = [
    {
      id: "blog-post",
      title: "Blog Post",
      description: "Engaging blog post structure",
      icon: "📝",
    },
    {
      id: "email",
      title: "Professional Email",
      description: "Clear and concise email format",
      icon: "📧",
    },
    {
      id: "report",
      title: "Business Report",
      description: "Structured report template",
      icon: "📊",
    },
    {
      id: "story",
      title: "Creative Story",
      description: "Narrative writing framework",
      icon: "📖",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Writing Templates */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-black mb-4">
          Writing Templates
        </h3>
        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className="w-full p-4 text-left bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h4 className="font-medium text-black">
                    {template.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-black">
            AI Suggestions
          </h3>
          {loadingSuggestions && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-slate-600">Analyzing...</span>
            </div>
          )}
        </div>
        
        {content.trim() ? (
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-blue-700 mb-1">
                      {suggestion.category}
                    </div>
                    <p className="text-sm text-slate-700">
                      {suggestion.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              Start writing to get AI suggestions
            </p>
          </div>
        )}
      </div>

      {/* Writing Stats */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-black mb-4">
          Writing Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-medium text-blue-600">
              {content.length}
            </div>
            <div className="text-sm text-slate-500">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-purple-600">
              {content.split(' ').filter(word => word.length > 0).length}
            </div>
            <div className="text-sm text-slate-500">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-green-600">
              {content.split('.').filter(sentence => sentence.trim().length > 0).length}
            </div>
            <div className="text-sm text-slate-500">Sentences</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-orange-600">
              {Math.round(content.length / 5)}
            </div>
            <div className="text-sm text-slate-500">Reading Time</div>
          </div>
          <div className="text-center col-span-2">
            <div className={`text-2xl font-medium ${grammarScore >= 90 ? 'text-green-600' : grammarScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {grammarScore}%
            </div>
            <div className="text-sm text-slate-500">Grammar Score</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-black mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full p-3 text-left bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span className="text-slate-700">Adjust Tone</span>
            </div>
          </button>
          <button className="w-full p-3 text-left bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-slate-700">Add Keywords</span>
            </div>
          </button>
          <button className="w-full p-3 text-left bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-colors">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-700">Check Grammar</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 