"use client";

interface TextEditorProps {
  content: string;
  setContent: (content: string) => void;
  isGenerating: boolean;
}

export function TextEditor({ content, setContent, isGenerating }: TextEditorProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>{content.length} characters</span>
          <span>•</span>
          <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your content here... The AI will help you improve and expand your ideas."
          className="w-full h-96 p-6 resize-none border-0 focus:ring-0 focus:outline-none bg-transparent text-black placeholder-slate-400"
          disabled={isGenerating}
        />
        
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-slate-600">AI is generating content...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Editor Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
            Clear
          </button>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Format
          </button>
        </div>
      </div>
    </div>
  );
} 