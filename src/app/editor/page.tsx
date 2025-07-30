"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AIControls } from "../../components/AIControls";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ONBOARDING_TEXT = "Welcome to your DeepWrite workspace! Let's get started!";

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Editor() {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const router = useRouter();

  // Auth/session check
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace("/signin");
        return;
      }
      setUser(data.session.user);
      setLoading(false);
      // Fetch documents after authentication
      fetchDocuments(data.session.user.id);
    };
    getSession();
  }, [router]);

  // Fetch user documents
  const fetchDocuments = async (userId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }
    
    setDocuments(data || []);
  };

  // Create new document
  const createDocument = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          user_id: user.id,
          title: 'Untitled Document',
          content: ''
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document:', error);
      return;
    }
    
    setDocuments([data, ...documents]);
    setCurrentDocument(data);
    setContent(data.content);
    setDocumentTitle(data.title);
  };

  // Update document
  const updateDocument = async (documentId: string, updates: { title?: string; content?: string }) => {
    const { error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId);
    
    if (error) {
      console.error('Error updating document:', error);
      return;
    }
    
    // Update local state
    setDocuments(documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, ...updates, updated_at: new Date().toISOString() }
        : doc
    ));
    
    if (currentDocument?.id === documentId) {
      setCurrentDocument({ ...currentDocument, ...updates });
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (error) {
      console.error('Error deleting document:', error);
      return;
    }
    
    setDocuments(documents.filter(doc => doc.id !== documentId));
    
    if (currentDocument?.id === documentId) {
      setCurrentDocument(null);
      setContent("");
      setDocumentTitle("Untitled Document");
    }
  };

  // Load document
  const loadDocument = (document: Document) => {
    setCurrentDocument(document);
    setContent(document.content);
    setDocumentTitle(document.title);
  };

  // Save document
  const saveDocument = async () => {
    // Check if document has a title
    if (!documentTitle.trim() || documentTitle === "Untitled Document") {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      if (currentDocument) {
        // Update existing document
        const { error } = await supabase
          .from('documents')
          .update({
            title: documentTitle,
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentDocument.id);
        
        if (error) throw error;
        
        // Update local state
        const updatedDocument = { ...currentDocument, title: documentTitle, content: content };
        setCurrentDocument(updatedDocument);
        setDocuments(documents.map(doc => 
          doc.id === currentDocument.id ? updatedDocument : doc
        ));
      } else {
        // Create new document
        const { data, error } = await supabase
          .from('documents')
          .insert([
            {
              user_id: user.id,
              title: documentTitle,
              content: content
            }
          ])
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setCurrentDocument(data);
        setDocuments([data, ...documents]);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving document:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save content changes
  useEffect(() => {
    if (currentDocument && content !== currentDocument.content) {
      const timeoutId = setTimeout(() => {
        updateDocument(currentDocument.id, { content });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [content, currentDocument]);

  // Onboarding logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("deepwrite_onboard") === "1") {
        setContent(ONBOARDING_TEXT);
        localStorage.removeItem("deepwrite_onboard");
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <span className="text-lg font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Remove static header here, just render the editor content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-0">
              <EditorArea 
                content={content} 
                setContent={setContent} 
                isGenerating={isGenerating} 
                setIsGenerating={setIsGenerating}
                documentTitle={documentTitle}
                setDocumentTitle={setDocumentTitle}
                currentDocument={currentDocument}
                updateDocument={updateDocument}
                saveDocument={saveDocument}
                saving={saving}
                saveStatus={saveStatus}
              />
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-0">
              <DashboardSidebar 
                content={content}
                documents={documents}
                currentDocument={currentDocument}
                createDocument={createDocument}
                loadDocument={loadDocument}
                deleteDocument={deleteDocument}
                user={user}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EditorArea({ 
  content, 
  setContent, 
  isGenerating, 
  setIsGenerating,
  documentTitle,
  setDocumentTitle,
  currentDocument,
  updateDocument,
  saveDocument,
  saving,
  saveStatus
}: { 
  content: string; 
  setContent: (c: string) => void; 
  isGenerating: boolean; 
  setIsGenerating: (g: boolean) => void;
  documentTitle: string;
  setDocumentTitle: (t: string) => void;
  currentDocument: Document | null;
  updateDocument: (id: string, updates: any) => void;
  saveDocument: () => void;
  saving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aiDropdownOpen, setAIDropdownOpen] = useState(false);
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const aiDropdownRef = useRef(null);
  const templatesDropdownRef = useRef(null);

  const handleTitleChange = (newTitle: string) => {
    setDocumentTitle(newTitle);
    if (currentDocument) {
      updateDocument(currentDocument.id, { title: newTitle });
    }
  };

  // Template content mapping
  const templateContent = {
    "blog-post": `# Blog Post Title

## Introduction
Start with a compelling hook that grabs your reader's attention. Introduce the main topic and why it matters to your audience.

## Main Content
### Key Point 1
Develop your first main argument or point with supporting evidence, examples, or data.

### Key Point 2
Expand on your second main point, providing context and insights that add value.

### Key Point 3
Present your third key point, ensuring it flows logically from the previous sections.

## Conclusion
Summarize your main points and provide a clear call-to-action or takeaway for your readers.

---
*Remember to add relevant keywords, include internal/external links, and optimize for SEO.*`,

    "email": `Subject: [Clear and Concise Subject Line]

Dear [Recipient Name],

I hope this email finds you well.

[Opening paragraph - State the purpose of your email clearly and concisely]

[Main content - Provide the necessary details, context, or information in a structured manner]

[Closing paragraph - Summarize key points and state any next steps or expectations]

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Contact Information]`,

    "report": `# Business Report: [Report Title]

## Executive Summary
Brief overview of the key findings, conclusions, and recommendations.

## Introduction
### Background
Provide context and background information relevant to the report.

### Objectives
Clearly state the goals and objectives of this report.

## Methodology
Describe the approach, data sources, and methods used to gather information.

## Findings
### Key Finding 1
Present your first major finding with supporting data and analysis.

### Key Finding 2
Detail your second finding with relevant metrics and insights.

### Key Finding 3
Share additional findings that support your conclusions.

## Analysis
Interpret the findings and discuss their implications for the business.

## Recommendations
### Recommendation 1
Specific, actionable recommendation with expected outcomes.

### Recommendation 2
Additional recommendations with implementation timeline.

## Conclusion
Summarize the main points and reinforce the importance of the recommendations.

---
*Report prepared by: [Name] | Date: [Date] | Version: [Version Number]*`,

    "story": `# [Story Title]

## Chapter 1: The Beginning

[Opening scene - Set the stage with vivid descriptions and introduce your main character]

The air was thick with anticipation as [Character Name] stepped into the unknown. [Describe the setting and establish the mood]

[Character development - Show who your character is through their actions, thoughts, and dialogue]

## Chapter 2: The Challenge

[Conflict introduction - Present the main problem or challenge your character must face]

[Build tension - Develop the conflict and show how it affects your character]

## Chapter 3: The Journey

[Character growth - Show how your character evolves and adapts to challenges]

[Plot development - Advance the story with new complications or discoveries]

## Chapter 4: The Resolution

[Climax - Build to the most intense moment of conflict or decision]

[Resolution - Show how the conflict is resolved and what changes for your character]

## Epilogue

[Reflection - Provide closure and show the lasting impact of the journey]

---
*Continue developing your characters, adding dialogue, and building the world of your story.*`
  };

  const handleTemplateClick = (templateId: string) => {
    const template = templateContent[templateId as keyof typeof templateContent];
    if (template) {
      setContent(template);
      setTemplatesDropdownOpen(false);
    }
  };

  const getSaveButtonText = () => {
    if (saving) return "Saving...";
    if (saveStatus === 'saved') return "Saved!";
    if (saveStatus === 'error') return "Error";
    return currentDocument ? "Save Changes" : "Save Document";
  };

  const getSaveButtonClass = () => {
    let baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
    
    if (saving) {
      return `${baseClass} bg-slate-400 text-white cursor-not-allowed`;
    } else if (saveStatus === 'saved') {
      return `${baseClass} bg-green-600 text-white`;
    } else if (saveStatus === 'error') {
      return `${baseClass} bg-red-600 text-white`;
    } else {
      return `${baseClass} bg-black text-white hover:bg-slate-800`;
    }
  };

  return (
    <div className="p-8">
      {/* Dropdown Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative">
          <button
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => setTemplatesDropdownOpen((open) => !open)}
            ref={templatesDropdownRef}
          >
            Templates
            <svg className={`w-4 h-4 ml-2 inline transition-transform duration-200 ease-in-out ${templatesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {templatesDropdownOpen && (
            <div className="absolute left-0 mt-2 w-full sm:w-96 z-30 animate-in slide-in-from-top-2 duration-200 ease-out">
              {/* Only show the templates part of WritingSuggestions */}
              <div className="bg-white border border-slate-300 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Writing Templates</h3>
                <div className="space-y-3">
                  {[
                    { id: "blog-post", title: "Blog Post", description: "Engaging blog post structure", icon: "📝" },
                    { id: "email", title: "Professional Email", description: "Clear and concise email format", icon: "📧" },
                    { id: "report", title: "Business Report", description: "Structured report template", icon: "📊" },
                    { id: "story", title: "Creative Story", description: "Narrative writing framework", icon: "📖" },
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateClick(template.id)}
                      className="w-full p-4 text-left bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl transition-transform duration-200 hover:scale-110">{template.icon}</span>
                        <div>
                          <h4 className="font-medium text-black">{template.title}</h4>
                          <p className="text-sm text-black">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Editor Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-xl font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 focus:outline-none rounded px-2 py-1 text-black w-full"
            placeholder="Document Title"
          />
          <div className="text-slate-500 text-sm mt-1">{content.length} characters • {content.split(' ').filter(w => w.length > 0).length} words</div>
        </div>
        <button
          onClick={saveDocument}
          disabled={saving}
          className={getSaveButtonClass()}
        >
          {getSaveButtonText()}
        </button>
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Start writing your content here..."
        className="w-full h-64 sm:h-96 p-4 sm:p-6 resize-none border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base bg-white text-slate-900 placeholder-slate-400 transition-all duration-200 ease-in-out hover:border-slate-300 focus:border-blue-500"
        disabled={isGenerating}
      />
      <div className="mt-8">
        <AIControls 
          content={content} 
          isGenerating={isGenerating} 
          setIsGenerating={setIsGenerating}
          onContentGenerated={setContent}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mt-4">
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Clear</button>
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-slate-800 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Format</button>
      </div>
      {/* Save Status Messages */}
      {saveStatus === 'error' && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">Please add a document title before saving.</p>
        </div>
      )}
    </div>
  );
}

function DashboardSidebar({ 
  content, 
  documents, 
  currentDocument, 
  createDocument, 
  loadDocument, 
  deleteDocument,
  user 
}: { 
  content: string;
  documents: Document[];
  currentDocument: Document | null;
  createDocument: () => void;
  loadDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  user: any;
}) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Dashboard</h3>
      <div className="space-y-4">
        {user ? (
          <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6">
            <h4 className="text-md font-medium text-black mb-3">Your Account</h4>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
              <span className="text-sm text-black">Welcome back!</span>
              <span className="text-sm text-black">Subscription: <span className="font-medium text-black">Pro</span></span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className="text-sm text-black">Words left this month: <span className="font-medium text-black">42,000</span></span>
              <Link href="/billing" className="text-sm text-blue-600 hover:underline underline-offset-4 transition-colors">Manage Subscription</Link>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 text-center text-yellow-800 font-medium">
            You are not signed in!{' '}
            <Link href="/signin" className="underline text-blue-600 hover:text-blue-800">Sign in or sign up</Link>{' '}to access your account details!
          </div>
        )}
        
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-black">Recent Documents</h4>
            <button
              onClick={createDocument}
              className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              New
            </button>
          </div>
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-slate-500 text-sm">No documents yet. Create your first document!</p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentDocument?.id === doc.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => loadDocument(doc)}
                      className="text-left flex-1"
                    >
                      <h5 className="font-medium text-black truncate">{doc.title}</h5>
                      <p className="text-xs text-slate-500">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 