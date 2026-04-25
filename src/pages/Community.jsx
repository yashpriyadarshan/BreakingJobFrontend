import React, { useState } from 'react';

const postsData = [
  {
    id: 1,
    author: {
      name: "Alex Rivera",
      role: "Senior Frontend Engineer",
      avatar: "AR",
      company: "TechCorp Intl",
      verified: true,
      followers: "2.4k"
    },
    content: "Just finished migrating our design system to CSS variables and layers. The performance gains are incredible! Has anyone else tried the new CSS anchor positioning API yet?\n\nIt feels like a major shift in how we handle tooltips and popovers. No more heavy JS libraries for positioning!",
    timestamp: "2h ago",
    likes: 124,
    comments: 18,
    views: "1.2k",
    tags: ["Frontend", "CSS", "Performance"],
    type: "text"
  },
  {
    id: 2,
    author: {
      name: "Sarah Chen",
      role: "Product Designer",
      avatar: "SC",
      company: "Studio Brutal",
      verified: true,
      followers: "5.1k"
    },
    content: "Sharing some early concepts for our upcoming workspace feature. We're focusing on 'calm technology' principles. What do you think about the sidebar navigation?",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=2070&auto=format&fit=crop",
    timestamp: "5h ago",
    likes: 456,
    comments: 42,
    views: "8.5k",
    tags: ["Design", "UX", "Product"],
    type: "image"
  },
  {
    id: 3,
    author: {
      name: "Marcus Thorne",
      role: "Fullstack Developer",
      avatar: "MT",
      company: "Global Logistics",
      verified: false,
      followers: "842"
    },
    content: "Quick tip for Node.js developers: using `AbortController` with `fetch` is a game changer for handling timeouts gracefully. Here is a small snippet:",
    code: "const controller = new AbortController();\nconst timeout = setTimeout(() => controller.abort(), 5000);\n\ntry {\n  const res = await fetch(url, { signal: controller.signal });\n} finally {\n  clearTimeout(timeout);\n}",
    timestamp: "1d ago",
    likes: 82,
    comments: 15,
    views: "3.1k",
    tags: ["NodeJS", "Tips", "Backend"],
    type: "code"
  }
];

const trendingTags = [
  { name: "JavaScript", posts: "12.4k" },
  { name: "CareerAdvice", posts: "8.2k" },
  { name: "WebAssembly", posts: "3.1k" },
  { name: "RemoteWork", posts: "15.7k" },
  { name: "FinTech", posts: "5.4k" },
];

const suggestedPeople = [
  { name: "Elena Gilbert", role: "CTO @ NovaMed", avatar: "EG", color: "bg-blue-500/20 text-blue-400" },
  { name: "David Kim", role: "Staff Engineer @ FinEdge", avatar: "DK", color: "bg-purple-500/20 text-purple-400" },
];

const accentColors = [
  { bg: "bg-[#ffa116]/15", text: "text-[#ffa116]", border: "border-[#ffa116]/25" },
  { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/25" },
  { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/25" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
];

function PostCard({ post, index }) {
  const colorSet = accentColors[index % accentColors.length];
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  return (
    <div className="bg-[#282828] border border-[#333] rounded-2xl overflow-hidden hover:border-[#444] transition-all duration-300 group hover:shadow-xl hover:shadow-black/20">
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full ${colorSet.bg} ${colorSet.border} border flex items-center justify-center shrink-0 relative`}>
              <span className={`text-base font-bold ${colorSet.text}`}>{post.author.avatar}</span>
              {post.author.verified && (
                <div className="absolute -bottom-1 -right-1 bg-[#1a1a1a] rounded-full p-0.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white hover:text-[#ffa116] cursor-pointer transition-colors">{post.author.name}</h4>
                <button className="text-[10px] font-bold text-[#ffa116] bg-[#ffa116]/10 px-2 py-0.5 rounded-full hover:bg-[#ffa116]/20 transition-colors">Follow</button>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">{post.author.role} • {post.author.company}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-gray-600 font-medium uppercase tracking-wider">{post.timestamp}</span>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span className="text-[10px] text-gray-600 font-bold">{post.views}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-[15px] text-gray-300 leading-relaxed mb-5 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Media Content */}
        {post.type === 'image' && (
          <div className="mb-5 rounded-2xl overflow-hidden border border-[#333] relative group/media">
            <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[450px] transition-transform duration-700 group-hover/media:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
          </div>
        )}

        {post.type === 'code' && (
          <div className="mb-5 rounded-xl overflow-hidden border border-[#333] bg-[#1a1a1a] shadow-inner relative">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#333] bg-[#222]">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">JavaScript snippet</span>
              <button className="text-[10px] text-gray-500 hover:text-white transition-colors">Copy Code</button>
            </div>
            <div className="p-4 font-mono text-[13px] text-gray-400 overflow-x-auto">
              <pre><code>{post.code}</code></pre>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#333] text-gray-400 border border-[#333] hover:border-[#555] hover:text-white transition-all cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* Engagement Bar */}
        <div className="flex items-center justify-between pt-5 border-t border-[#333]">
          <div className="flex items-center gap-1 sm:gap-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 text-xs font-bold transition-all group/btn ${isLiked ? 'text-[#ffa116]' : 'text-gray-500 hover:text-[#ffa116]'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isLiked ? 'bg-[#ffa116]/20' : 'group-hover/btn:bg-[#ffa116]/10'}`}>
                <svg className={`w-5 h-5 transition-transform ${isLiked ? 'scale-110' : 'group-hover/btn:scale-110'}`} fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="hidden sm:inline">{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-400 transition-all group/btn">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover/btn:bg-blue-500/10 transition-all">
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="hidden sm:inline">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-400 transition-all group/btn">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover/btn:bg-emerald-500/10 transition-all">
                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'text-[#ffa116] bg-[#ffa116]/10' : 'text-gray-500 hover:text-white hover:bg-[#333]'}`}
          >
            <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const [postText, setPostText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 w-full text-[#eff1f6]">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT/CENTER CONTENT */}
        <div className="flex-grow max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Community Feed</h1>
            <p className="text-gray-400 text-sm font-medium">Insights, discussions, and updates from the network</p>
          </div>

          {/* Create Post Bar */}
          <div className={`bg-[#282828] border border-[#333] rounded-2xl p-6 mb-8 transition-all duration-500 ${isExpanded ? 'ring-2 ring-[#ffa116]/20 shadow-2xl shadow-[#ffa116]/5 border-[#ffa116]/30' : 'hover:border-[#444]'}`}>
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffa116] to-[#ffb03a] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffa116]/20">
                <span className="text-base font-black text-[#1a1a1a]">U</span>
              </div>
              <div className="flex-grow">
                <textarea
                  placeholder="Share something with the community..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  className="w-full bg-transparent border-none focus:ring-0 text-[15px] text-white placeholder-gray-500 resize-none min-h-[44px] pt-2 transition-all"
                  rows={isExpanded ? 4 : 1}
                />
                
                {isExpanded && (
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#333]">
                    <div className="flex items-center gap-1">
                      <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#333] transition-all group" title='Image'>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#333] transition-all group" title='Code'>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </button>
                      <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#333] transition-all group" title='Poll'>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => { setIsExpanded(false); setPostText(''); }}
                        className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={!postText.trim()}
                        className={`px-7 py-2.5 rounded-xl text-sm font-black transition-all ${postText.trim() ? 'bg-[#ffa116] text-[#1a1a1a] hover:bg-[#ffb03a] shadow-xl shadow-[#ffa116]/20 scale-100 hover:scale-105 active:scale-95' : 'bg-[#333] text-gray-600 cursor-not-allowed'}`}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-6">
            {postsData.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
          
          {/* Load More */}
          <div className="mt-12 text-center pb-20">
            <button className="px-8 py-3 rounded-2xl border border-[#333] text-sm font-bold text-gray-400 hover:text-white hover:bg-[#282828] transition-all hover:border-[#555] active:scale-95">
              Load more posts
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Desktop Only) */}
        <aside className="hidden lg:flex flex-col gap-6 w-80 shrink-0">
          
          {/* Trending Section */}
          <div className="bg-[#282828] border border-[#333] rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ffa116]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Trending Topics
            </h3>
            <div className="flex flex-col gap-5">
              {trendingTags.map((tag, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-sm font-bold text-gray-200 group-hover:text-[#ffa116] transition-colors mb-0.5">#{tag.name}</p>
                  <p className="text-[11px] text-gray-600 font-bold">{tag.posts} Posts</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl border border-[#333] text-xs font-bold text-[#ffa116] hover:bg-[#ffa116]/5 transition-all">
              Show more
            </button>
          </div>

          {/* Suggested People */}
          <div className="bg-[#282828] border border-[#333] rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ffa116]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Who to follow
            </h3>
            <div className="flex flex-col gap-6">
              {suggestedPeople.map((person, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center font-bold text-sm shrink-0 border border-white/5`}>
                      {person.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-white truncate group-hover:text-[#ffa116] transition-colors">{person.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium truncate">{person.role}</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-black text-white bg-[#333] px-4 py-1.5 rounded-full hover:bg-[#444] transition-all">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="px-2 flex flex-wrap gap-x-4 gap-y-2">
            {['About', 'Help Center', 'Privacy', 'Terms', 'Ad Choices'].map(link => (
              <a key={link} href="#" className="text-[11px] font-medium text-gray-600 hover:text-gray-400 transition-colors">{link}</a>
            ))}
            <p className="text-[11px] font-medium text-gray-700 mt-2">© 2026 Breaking Job Inc.</p>
          </div>
        </aside>

      </div>
    </main>
  );
}
