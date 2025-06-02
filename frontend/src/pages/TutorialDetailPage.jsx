import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Star, User, Calendar, ArrowLeft } from 'lucide-react';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import { tutorialService } from '../services/tutorialService';

const TutorialDetailPage = () => {
  const { slug } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    fetchTutorial();
  }, [slug]);

  // Note: Removed image replacement useEffect - now showing actual images

  const fetchTutorial = async () => {
    setLoading(true);
    try {
      const data = await tutorialService.getTutorialBySlug(slug);
      setTutorial(data.tutorial);
    } catch (error) {
      console.error('Failed to fetch tutorial:', error);
      setError(error.response?.status === 404 ? 'Tutorial not found' : 'Failed to load tutorial');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-8"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h1>
          <Link
            to="/tutorials"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Back Button */}
        <Link
          to="/tutorials"
          className="group inline-flex items-center px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tutorials
        </Link>

        {/* Enhanced Tutorial Header */}
        <div className="relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-10 mb-12">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50">
                {tutorial.category}
              </span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  tutorial.difficulty === 'Beginner' ? 'bg-green-500' :
                  tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100/50 dark:bg-gray-700/50 rounded-full">
                  {tutorial.difficulty}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                {tutorial.title}
              </span>
            </h1>

            {tutorial.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {tutorial.excerpt}
              </p>
            )}

            {/* Enhanced Meta Information */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500">Author</div>
                  <div className="text-sm font-semibold">{tutorial.author?.username || 'Anonymous'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500">Published</div>
                  <div className="text-sm font-semibold">{new Date(tutorial.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500">Read Time</div>
                  <div className="text-sm font-semibold">{tutorial.estimatedReadTime} min</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500">Views</div>
                  <div className="text-sm font-semibold">{tutorial.views}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500">Likes</div>
                  <div className="text-sm font-semibold">{tutorial.likes}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tutorial Content */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-10 mb-12">
          {/* Render Content Blocks if available */}
          {tutorial.contentBlocks && tutorial.contentBlocks.length > 0 ? (
            <div className="space-y-6">
              {tutorial.contentBlocks.map((block, index) => (
                <div key={block.id || index} className="content-block">
                  {block.type === 'heading' && (
                    <div className="heading-block">
                      {block.level === 'h1' && (
                        <h1 className="text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-white">
                          {block.content}
                        </h1>
                      )}
                      {block.level === 'h2' && (
                        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800 dark:text-gray-200">
                          {block.content}
                        </h2>
                      )}
                      {block.level === 'h3' && (
                        <h3 className="text-xl font-medium mt-4 mb-3 text-gray-700 dark:text-gray-300">
                          {block.content}
                        </h3>
                      )}
                      {block.level === 'h4' && (
                        <h4 className="text-lg font-medium mt-3 mb-2 text-gray-700 dark:text-gray-300">
                          {block.content}
                        </h4>
                      )}
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div className="text-block prose prose-lg max-w-none dark:prose-invert">
                      <div
                        className="text-gray-600 dark:text-gray-400 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: block.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
                            .replace(/\n\n/g, '</p><p class="mb-4">')
                            .replace(/\n/g, '<br>')
                        }}
                      />
                    </div>
                  )}

                  {block.type === 'image' && block.url && (
                    <div className="image-block my-8">
                      <div className="text-center">
                        {/* Show actual image */}
                        <img
                          src={block.url}
                          alt={block.alt || 'Tutorial image'}
                          className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="hidden text-center text-gray-500 dark:text-gray-400 py-8">
                          <div className="text-sm">Failed to load image</div>
                          <div className="text-xs mt-1">Please check the URL</div>
                        </div>
                        {block.caption && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {block.type === 'code' && (
                    <div className="code-block my-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {block.title && (
                          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {block.title}
                            </h4>
                          </div>
                        )}
                        <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 uppercase tracking-wide">
                              {block.language || 'code'}
                            </span>
                          </div>
                          <pre className="text-sm">
                            <code>{block.content}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Fallback to regular content rendering */
            <div
              ref={contentRef}
              className="tutorial-content prose prose-lg dark:prose-invert max-w-none prose-headings:bg-gradient-to-r prose-headings:from-blue-600 prose-headings:to-indigo-600 prose-headings:bg-clip-text prose-headings:text-transparent prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700"
              dangerouslySetInnerHTML={{ __html: tutorial.content }}
            />
          )}
        </div>

        {/* Enhanced Code Examples */}
        {tutorial.codeExamples && tutorial.codeExamples.length > 0 && (
          <div className="space-y-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  Interactive Examples
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Try these hands-on examples to practice what you've learned
              </p>
            </div>
            {tutorial.codeExamples.map((example, index) => (
              <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
                {example.title && (
                  <h3 className="text-2xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {example.title}
                    </span>
                  </h3>
                )}
                {example.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    {example.description}
                  </p>
                )}
                <div className="rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                  <CodeEditor
                    initialCode={example.code}
                    language={example.language}
                    height="300px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
            <h3 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Related Topics
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {tutorial.tags.map((tag, index) => (
                <span
                  key={index}
                  className="group px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 transition-all duration-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialDetailPage;
