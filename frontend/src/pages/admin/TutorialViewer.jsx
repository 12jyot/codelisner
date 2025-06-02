import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Edit,
  Eye,
  Calendar,
  User,
  Tag,
  Globe,
  BarChart3,
  Heart,
  Share2,
  Code
} from 'lucide-react';

const TutorialViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchTutorial();
  }, [id]);

  // Note: Removed image replacement useEffect - now showing actual images

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tutorials/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTutorial(response.data.tutorial);
    } catch (error) {
      console.error('Failed to fetch tutorial:', error);
      alert('Failed to load tutorial');
      navigate('/admin/tutorials');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tutorial Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The tutorial you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/admin/tutorials')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tutorials
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/tutorials')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tutorial Preview
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Preview how this tutorial appears to users
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/tutorials/${tutorial.slug}`)}
            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Live
          </button>
          <button
            onClick={() => navigate(`/admin/tutorials/edit/${tutorial._id}`)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Tutorial
          </button>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tutorial Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {tutorial.title}
              </h1>
              {tutorial.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {tutorial.excerpt}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-6">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                tutorial.isPublished
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
                <Globe className="h-3 w-3 mr-1" />
                {tutorial.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {tutorial.author?.username || 'Unknown Author'}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(tutorial.createdAt)}
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {tutorial.category}
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
              {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
            </span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {tutorial.views || 0} views
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {tutorial.likes || 0} likes
              </span>
            </div>
          </div>

          {/* Tags */}
          {tutorial.tags && tutorial.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tutorial Content */}
        <div className="p-6">
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
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div ref={contentRef} className="tutorial-content">
                {tutorial.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return <br key={index} />;

                  // Simple markdown-like formatting
                  let formattedParagraph = paragraph
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>');

                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                        {paragraph.substring(2)}
                      </h1>
                    );
                  } else if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">
                        {paragraph.substring(3)}
                      </h2>
                    );
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-700 dark:text-gray-300">
                        {paragraph.substring(4)}
                      </h3>
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                      />
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* Code Examples */}
        {tutorial.codeExamples && tutorial.codeExamples.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Code Examples
            </h2>
            <div className="space-y-6">
              {tutorial.codeExamples.map((example, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {example.title && (
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {example.title}
                      </h3>
                    </div>
                  )}
                  <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {example.language}
                      </span>
                    </div>
                    <pre className="text-sm">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                  {example.explanation && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Explanation:</strong> {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialViewer;
