"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Hero Section with Honest Messaging */}
      <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border border-slate-300 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-slate-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-slate-300 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Early Access Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-700 mb-6">
              <span className="mr-2">🚀</span>
              <span className="font-medium">Now in Early Access - Be Among the First to Try</span>
              <span className="ml-2">🚀</span>
            </div>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-black mb-4 sm:mb-6">
              Write Smarter,<br className="hidden sm:block" />
              Not Harder.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-12">
              The AI writing assistant that helps you create compelling content in seconds. 
              From emails to essays, DeepWrite adapts to your style and gets better with every word.
            </p>
            
            {/* Enhanced CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signin" className="px-8 py-4 rounded-xl bg-black text-white font-medium text-lg shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative group">
                Start Writing Free
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  No Credit Card
                </span>
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Forever Plan
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                30-Day Money Back
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel Anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes DeepWrite Different - NEW */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-4">Built for Real Writers, by Real Writers</h2>
            <p className="text-lg text-slate-600">We're building something different - an AI that actually understands your voice and helps you write better, not just faster.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-black mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Benefits - NEW */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-6">
              Why Join Early Access?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Be part of shaping the future of AI writing. Early users get exclusive benefits and direct input on features.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {earlyAccessBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-black">{benefit.title}</div>
                    <div className="text-sm text-slate-600">{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who is DeepWrite for? */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-4">Who is DeepWrite for?</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">DeepWrite adapts to any writing need—whether you're an individual or a team, our AI helps you write smarter, faster, and more authentically.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Student */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <span className="mb-4 text-blue-500 text-4xl transition-transform duration-200 hover:scale-110">🎓</span>
              <h3 className="text-lg font-medium mb-2">Students</h3>
              <p className="text-slate-600">Ace essays, reports, and research papers with clear, well-structured writing and grammar help.</p>
            </div>
            {/* Email Marketer */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <span className="mb-4 text-green-500 text-4xl transition-transform duration-200 hover:scale-110">📧</span>
              <h3 className="text-lg font-medium mb-2">Email Marketers</h3>
              <p className="text-slate-600">Write high-converting campaigns, newsletters, and outreach emails with persuasive, on-brand copy.</p>
            </div>
            {/* SMMA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <span className="mb-4 text-pink-500 text-4xl transition-transform duration-200 hover:scale-110">📱</span>
              <h3 className="text-lg font-medium mb-2">SMMAs</h3>
              <p className="text-slate-600">Create engaging social posts, captions, and ad copy for every platform—at scale.</p>
            </div>
            {/* Support Teams / API */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <span className="mb-4 text-purple-500 text-4xl transition-transform duration-200 hover:scale-110">🤖</span>
              <h3 className="text-lg font-medium mb-2">Support Teams & API Users</h3>
              <p className="text-slate-600">Integrate DeepWrite into your workflow to automate replies, knowledge base articles, and remote support with consistent quality.</p>
            </div>
            {/* Content Creators */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <span className="mb-4 text-yellow-500 text-4xl transition-transform duration-200 hover:scale-110">✍️</span>
              <h3 className="text-lg font-medium mb-2">Content Creators</h3>
              <p className="text-slate-600">Bloggers, YouTubers, and podcasters can brainstorm, script, and polish content with ease.</p>
            </div>
            {/* Developers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <span className="mb-4 text-indigo-500 text-4xl transition-transform duration-200 hover:scale-110">💻</span>
              <h3 className="text-lg font-medium mb-2">Developers</h3>
              <p className="text-slate-600">Generate documentation, code comments, and integrate AI writing into your apps with our API.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <span className="inline-block bg-blue-50 text-blue-700 px-6 py-3 rounded-full font-medium text-lg">No matter your role, DeepWrite helps you write smarter.</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            {/* Left: Text and Benefits List */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-6">
                The Writing Assistant You've Been Waiting For
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-black">Effortless Drafting</div>
                    <div className="text-slate-600">Start, expand, and finish your writing faster with AI-powered suggestions and completions.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-black">Personalized to You</div>
                    <div className="text-slate-600">DeepWrite adapts to your style and tone, so every piece sounds authentically you.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-black">Professional Results</div>
                    <div className="text-slate-600">Grammar, clarity, and style improvements help you publish with confidence.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.121 2.121 0 013 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-black">Seamless Workflow</div>
                    <div className="text-slate-600">Integrate with your favorite tools and export in multiple formats.</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Illustration or Placeholder */}
            <div className="flex justify-center">
              <div className="w-full max-w-md aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-5xl text-slate-300">✍️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-4">
              Join the Early Access Community
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Be among the first to experience DeepWrite and help shape its future. Get exclusive updates, early feature access, and special pricing.
            </p>
            
            {!showSuccess ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Joining..." : "Join Early Access"}
                </button>
              </form>
            ) : (
              <div className="text-green-600 font-medium">
                🎉 Welcome to the community! We'll be in touch soon.
              </div>
            )}
            
            <p className="text-sm text-slate-500 mt-4">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section - Honest Early Access Pricing */}
      <section id="pricing" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-4">Early Access Pricing</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">Special pricing for early adopters. Lock in these rates before we launch publicly.</p>
            
            {/* Early Access Banner */}
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-6 py-3 text-blue-700 font-medium mt-6">
              <span className="mr-2">🎯</span>
              Early Access: 50% off Launch Pricing
              <span className="ml-2">🎯</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-start transition-all duration-200 ease-in-out hover:shadow-md hover:border-slate-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <h3 className="text-2xl font-medium mb-2">Free</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-light">$0</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <p className="text-slate-600 mb-4">Perfect for trying DeepWrite</p>
              <ul className="mb-6 space-y-2 text-slate-700">
                <li>5,000 words per month</li>
                <li>Basic grammar checking</li>
                <li>3 document limit</li>
                <li>Community support</li>
              </ul>
              <Link href="/signin" className="w-full px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-center">Start Free</Link>
            </div>
            {/* Pro Plan */}
            <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-lg flex flex-col items-start scale-105 relative z-10 transition-all duration-200 ease-in-out hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <div className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-4">Early Access</div>
              <h3 className="text-2xl font-medium mb-2">Pro</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-light line-through text-slate-400">$21</span>
                <span className="text-4xl font-light text-blue-600 ml-2">$10.50</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <p className="text-slate-600 mb-4">Best for professionals and creators</p>
              <ul className="mb-6 space-y-2 text-slate-700">
                <li>50,000 words per month</li>
                <li>Advanced AI suggestions</li>
                <li>Unlimited documents</li>
                <li>Premium AI models</li>
                <li>Priority support</li>
                <li>Export to PDF/Word</li>
                <li>Custom writing styles</li>
              </ul>
              <Link href="/signin" className="w-full px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-slate-900 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-center">Start Free Trial</Link>
            </div>
            {/* Team Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-start transition-all duration-200 ease-in-out hover:shadow-md hover:border-slate-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <h3 className="text-2xl font-medium mb-2">Team</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-light">$15</span>
                <span className="text-slate-500 ml-2">/user/month</span>
              </div>
              <p className="text-slate-600 mb-4">For teams and organizations</p>
              <ul className="mb-6 space-y-2 text-slate-700">
                <li>100,000 words per user</li>
                <li>All Pro features</li>
                <li>Team collaboration</li>
                <li>Admin controls</li>
                <li>Brand voice customization</li>
                <li>API access</li>
                <li>Advanced analytics</li>
              </ul>
              <Link href="/contact" className="w-full px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-center">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-20 bg-white">
        <h2 className="text-3xl sm:text-4xl font-light text-center mb-3">Frequently Asked Questions</h2>
        <p className="text-lg text-center text-slate-500 mb-8 sm:mb-12">Answers to common questions about DeepWrite</p>
        <FAQSection />
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-6">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join the early access community and be part of building the future of AI writing. 
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin" className="px-8 py-4 rounded-xl bg-black text-white font-medium text-lg shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Start Writing Free
            </Link>
            <Link href="/editor" className="px-8 py-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Try the Editor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Features data - honest about what we're building
const features = [
  {
    icon: "🎯",
    title: "Voice Preservation",
    description: "Unlike generic AI tools, DeepWrite learns and maintains your unique writing style and tone."
  },
  {
    icon: "⚡",
    title: "Smart Suggestions",
    description: "Get contextual writing suggestions that actually make sense for your content and audience."
  },
  {
    icon: "🛡️",
    title: "Privacy First",
    description: "Your content is never stored permanently or used to train our models. Complete privacy guaranteed."
  },
  {
    icon: "🔧",
    title: "Seamless Integration",
    description: "Works with your existing workflow. Export to any format and integrate with your favorite tools."
  },
  {
    icon: "📈",
    title: "Continuous Learning",
    description: "The more you use DeepWrite, the better it understands your style and improves its suggestions."
  },
  {
    icon: "🎨",
    title: "Customizable",
    description: "Adapt the AI to your specific needs, whether you're writing emails, essays, or creative content."
  }
];

// Early access benefits - honest value propositions
const earlyAccessBenefits = [
  {
    title: "Lock in Early Access Pricing",
    description: "Get 50% off launch pricing for life when you join during early access."
  },
  {
    title: "Shape the Product",
    description: "Your feedback directly influences new features and improvements."
  },
  {
    title: "Priority Support",
    description: "Direct access to our development team for questions and feature requests."
  },
  {
    title: "Exclusive Features",
    description: "Be the first to try new AI models and advanced features before public release."
  }
];

const faqs = [
  {
    q: "What makes DeepWrite different from other AI writing tools?",
    a: "DeepWrite focuses specifically on preserving your authentic voice while providing intelligent writing assistance. Unlike generic AI tools that produce cookie-cutter content, we learn your unique style and adapt to your needs. We're also built with privacy-first principles - your content is never stored permanently or used to train our models."
  },
  {
    q: "Is my content secure and private?",
    a: "Absolutely. We use enterprise-grade encryption and never store your content permanently. Your writing remains completely private and is never used to train our models or shared with third parties. We believe your ideas and content should stay yours."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period."
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with DeepWrite, contact our support team for a full refund, no questions asked."
  },
  {
    q: "How accurate is the AI writing assistance?",
    a: "Our AI combines multiple advanced language models for high accuracy. While we recommend reviewing all AI-generated content, our suggestions consistently help improve clarity, grammar, and overall writing quality. The more you use it, the better it becomes at understanding your style."
  },
  {
    q: "What's included in early access?",
    a: "Early access users get exclusive pricing (50% off launch rates), priority support, direct input on product development, and first access to new features. You'll also be part of a community helping to shape the future of AI writing."
  }
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-3xl mx-auto grid gap-6">
      {faqs.map((item, idx) => (
        <div
          key={idx}
          className={`bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 ${open === idx ? 'ring-2 ring-blue-200' : ''}`}
        >
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
          >
            <span className="text-lg font-medium text-black">{item.q}</span>
            <svg
              className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${open === idx ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`px-6 pb-5 text-slate-700 text-base transition-all duration-300 overflow-hidden ${open === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            style={{
              transitionProperty: 'max-height, opacity',
            }}
          >
            {open === idx && <div>{item.a}</div>}
          </div>
        </div>
      ))}
    </div>
  );
} 
