import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Code,
  Image,
  Eye,
  Type,
  FileText,
  Settings,
  Globe,
  GripVertical,
  Heading,
  AlignLeft,
  Upload,
  Loader
} from 'lucide-react';

const TutorialEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [newTag, setNewTag] = useState('');
  const [uploadingImages, setUploadingImages] = useState({});

  const [tutorial, setTutorial] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    difficulty: 'Beginner',
    tags: [],
    isPublished: false,
    contentBlocks: [],
    codeExamples: [],
    images: []
  });

  const categories = [
    'HTML',
    'CSS',
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'C',
    'SQL',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'React',
    'Node.js',
    'MongoDB',
    'Other'
  ];

  const difficulties = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchTutorial();
    }
  }, [id, isEditing]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTutorial(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!tutorial.title.trim()) {
        alert('Title is required');
        return;
      }

      const hasContent = tutorial.content.trim() || (tutorial.contentBlocks && tutorial.contentBlocks.length > 0);
      if (!hasContent) {
        alert('Please add some content to your tutorial');
        return;
      }

      let finalContent = tutorial.content;
      if (tutorial.contentBlocks && tutorial.contentBlocks.length > 0) {
        finalContent = generateContentFromBlocks(tutorial.contentBlocks);
      }

      const tutorialData = {
        ...tutorial,
        content: finalContent,
        slug: tutorial.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      if (isEditing) {
        await axios.patch(`http://localhost:5000/api/tutorials/${id}`, tutorialData, { headers });
        alert('Tutorial updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/tutorials', tutorialData, { headers });
        alert('Tutorial created successfully!');
      }

      navigate('/admin/tutorials');
    } catch (error) {
      console.error('Failed to save tutorial:', error);
      alert('Failed to save tutorial. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const generateContentFromBlocks = (blocks) => {
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          const level = block.level === 'h1' ? '#' : block.level === 'h2' ? '##' : block.level === 'h3' ? '###' : '####';
          return `${level} ${block.content}`;

        case 'text':
          return block.content;

        case 'image':
          const imageMarkdown = `![${block.alt || 'Image'}](${block.url})`;
          return block.caption ? `${imageMarkdown}\n*${block.caption}*` : imageMarkdown;

        case 'code':
          const codeBlock = `\`\`\`${block.language}\n${block.content}\n\`\`\``;
          return block.title ? `**${block.title}**\n\n${codeBlock}` : codeBlock;

        default:
          return '';
      }
    }).join('\n\n');
  };

  const addTag = () => {
    if (newTag.trim() && !tutorial.tags.includes(newTag.trim())) {
      setTutorial(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTutorial(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === 'heading' && { level: 'h2' }),
      ...(type === 'image' && { url: '', alt: '', caption: '', uploading: false }),
      ...(type === 'code' && { language: 'javascript', title: '' })
    };

    setTutorial(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }));
  };

  const updateContentBlock = (blockId, field, value) => {
    setTutorial(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(block =>
        block.id === blockId ? { ...block, [field]: value } : block
      )
    }));
  };

  const removeContentBlock = (blockId) => {
    setTutorial(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter(block => block.id !== blockId)
    }));
  };

  const handleImageUpload = async (blockId, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB. Please choose a smaller image.');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [blockId]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading image:', {
        name: file.name,
        size: file.size,
        type: file.type,
        token: localStorage.getItem('token')?.substring(0, 20) + '...'
      });

      const response = await axios.post('http://localhost:5000/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Upload successful:', response.data);

      // Update the image block with the uploaded image URL
      updateContentBlock(blockId, 'url', response.data.image.url);

      // Set alt text to filename if not already set
      const currentBlock = tutorial.contentBlocks.find(block => block.id === blockId);
      if (!currentBlock.alt) {
        updateContentBlock(blockId, 'alt', file.name.replace(/\.[^/.]+$/, ""));
      }

      // Show success message
      const successMsg = `✅ Image "${file.name}" uploaded successfully!`;
      alert(successMsg);

    } catch (error) {
      console.error('Image upload failed:', error);

      let errorMessage = 'Image upload failed. ';

      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Upload timeout. Please try with a smaller image.';
      } else if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 401:
            errorMessage += 'Authentication failed. Please log in again.';
            break;
          case 403:
            errorMessage += 'Permission denied. Admin access required.';
            break;
          case 413:
            errorMessage += 'File too large. Maximum size is 5MB.';
            break;
          case 415:
            errorMessage += 'Unsupported file type. Please use JPG, PNG, or GIF.';
            break;
          case 500:
            errorMessage += 'Server error. Please try again later.';
            break;
          default:
            errorMessage += data?.message || `Server error (${status})`;
        }
      } else if (error.request) {
        // Network error
        errorMessage += 'Network error. Please check your connection and try again.';
      } else {
        // Other error
        errorMessage += error.message || 'Unknown error occurred.';
      }

      alert(errorMessage);
    } finally {
      setUploadingImages(prev => ({ ...prev, [blockId]: false }));
    }
  };

  const handlePreview = () => {
    let previewContent = tutorial.content;
    if (tutorial.contentBlocks && tutorial.contentBlocks.length > 0) {
      previewContent = generateContentFromBlocks(tutorial.contentBlocks);
    }

    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview: ${tutorial.title || 'Untitled Tutorial'}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              line-height: 1.6;
              color: #333;
            }
            h1, h2, h3, h4 { color: #2563eb; margin-top: 2rem; margin-bottom: 1rem; }
            h1 { font-size: 2.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
            h2 { font-size: 2rem; }
            h3 { font-size: 1.5rem; }
            h4 { font-size: 1.25rem; }
            p { margin-bottom: 1rem; }
            code {
              background: #f3f4f6;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-family: 'Monaco', 'Consolas', monospace;
            }
            pre {
              background: #1f2937;
              color: #f9fafb;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
            }
            pre code { background: none; padding: 0; color: inherit; }
            img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
            blockquote {
              border-left: 4px solid #2563eb;
              padding-left: 1rem;
              margin: 1rem 0;
              font-style: italic;
            }
            .preview-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 2rem;
              margin: -2rem -2rem 2rem -2rem;
              border-radius: 0.5rem;
            }
            .preview-badge {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.875rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="preview-header">
            <div class="preview-badge">📖 Tutorial Preview</div>
            <h1 style="color: white; border: none; margin: 0; padding: 0;">${tutorial.title || 'Untitled Tutorial'}</h1>
            ${tutorial.excerpt ? `<p style="margin: 0.5rem 0 0 0; opacity: 0.9;">${tutorial.excerpt}</p>` : ''}
          </div>
          <div id="content"></div>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <script>
            const content = ${JSON.stringify(previewContent)};
            document.getElementById('content').innerHTML = marked.parse(content);
          </script>
        </body>
      </html>
    `);
    previewWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/tutorials')}
                className="p-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {isEditing ? 'Edit Tutorial' : 'Create Tutorial'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {isEditing ? 'Update tutorial content and settings' : 'Create engaging content with our visual editor'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTutorial(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                  tutorial.isPublished
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Globe className="h-4 w-4 mr-2" />
                {tutorial.isPublished ? 'Published' : 'Draft'}
              </button>
              <button
                onClick={handlePreview}
                className="inline-flex items-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Tutorial'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'builder', label: 'Content Builder', icon: Type },
                { id: 'content', label: 'Raw Content', icon: FileText },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'builder' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visual Content Builder</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addContentBlock('heading')}
                      className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Heading className="h-4 w-4 mr-2" />
                      Heading
                    </button>
                    <button
                      onClick={() => addContentBlock('text')}
                      className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <AlignLeft className="h-4 w-4 mr-2" />
                      Text
                    </button>
                    <button
                      onClick={() => addContentBlock('image')}
                      className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Image
                    </button>
                    <button
                      onClick={() => addContentBlock('code')}
                      className="inline-flex items-center px-3 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </button>
                  </div>
                </div>

                {tutorial.contentBlocks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Start building your tutorial</p>
                    <p className="text-sm">Add content blocks using the buttons above</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {tutorial.contentBlocks.map((block) => (
                      <div key={block.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {block.type} Block
                            </span>
                          </div>
                          <button
                            onClick={() => removeContentBlock(block.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {block.type === 'heading' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Heading Text
                              </label>
                              <input
                                type="text"
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, 'content', e.target.value)}
                                placeholder="Enter heading text..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                              />
                            </div>
                          </div>
                        )}

                        {block.type === 'text' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Text Content
                              </label>
                              <textarea
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, 'content', e.target.value)}
                                placeholder="Enter your text content here..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors shadow-sm resize-y"
                              />
                            </div>
                          </div>
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Image Source
                              </label>
                              <div className="flex space-x-3">
                                <input
                                  type="url"
                                  value={block.url}
                                  onChange={(e) => updateContentBlock(block.id, 'url', e.target.value)}
                                  placeholder="https://example.com/image.jpg or upload an image"
                                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm"
                                />
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        handleImageUpload(block.id, file);
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={uploadingImages[block.id]}
                                  />
                                  <button
                                    type="button"
                                    disabled={uploadingImages[block.id]}
                                    className="inline-flex items-center px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                  >
                                    {uploadingImages[block.id] ? (
                                      <>
                                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Upload an image from your device (JPG, PNG, GIF - max 5MB) or enter an image URL
                              </p>
                            </div>

                            {/* Image Preview */}
                            {block.url && (
                              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Preview
                                </label>
                                <div className="relative">
                                  <img
                                    src={block.url}
                                    alt={block.alt || 'Preview'}
                                    className="max-w-full h-auto max-h-64 rounded-lg shadow-sm mx-auto"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'block';
                                    }}
                                  />
                                  <div className="hidden text-center text-gray-500 dark:text-gray-400 py-8">
                                    <div className="text-sm">Failed to load image</div>
                                    <div className="text-xs mt-1">Please check the URL or upload a new image</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Alt Text
                              </label>
                              <input
                                type="text"
                                value={block.alt}
                                onChange={(e) => updateContentBlock(block.id, 'alt', e.target.value)}
                                placeholder="Describe the image for accessibility..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Caption (Optional)
                              </label>
                              <input
                                type="text"
                                value={block.caption || ''}
                                onChange={(e) => updateContentBlock(block.id, 'caption', e.target.value)}
                                placeholder="Add a caption for the image..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors shadow-sm"
                              />
                            </div>
                          </div>
                        )}

                        {block.type === 'code' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Language
                                </label>
                                <select
                                  value={block.language}
                                  onChange={(e) => updateContentBlock(block.id, 'language', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-sm"
                                >
                                  <option value="javascript">JavaScript</option>
                                  <option value="python">Python</option>
                                  <option value="java">Java</option>
                                  <option value="cpp">C++</option>
                                  <option value="c">C</option>
                                  <option value="html">HTML</option>
                                  <option value="css">CSS</option>
                                  <option value="sql">SQL</option>
                                  <option value="php">PHP</option>
                                  <option value="ruby">Ruby</option>
                                  <option value="go">Go</option>
                                  <option value="rust">Rust</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Title (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={block.title}
                                  onChange={(e) => updateContentBlock(block.id, 'title', e.target.value)}
                                  placeholder="Code example title..."
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Code
                              </label>
                              <textarea
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, 'content', e.target.value)}
                                placeholder="Enter your code here..."
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-sm resize-y font-mono text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={tutorial.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter tutorial title..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={tutorial.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your tutorial content here..."
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={tutorial.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={tutorial.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {difficulties.map(diff => (
                        <option key={diff.value} value={diff.value}>{diff.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tutorial.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add a tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialEditor;
