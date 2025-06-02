import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Eye,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const ImageManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Since we don't have a get images endpoint, we'll start with empty array
      // In a real implementation, you'd fetch from an endpoint that lists uploaded images
      setImages([]);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      showNotification('Failed to fetch images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    try {
      if (files.length === 1) {
        formData.append('image', files[0]);
        const response = await axios.post('http://localhost:5000/api/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const newImage = {
          id: response.data.image.public_id,
          url: response.data.image.url,
          public_id: response.data.image.public_id,
          width: response.data.image.width,
          height: response.data.image.height,
          uploadedAt: new Date().toISOString(),
          name: files[0].name
        };

        setImages(prev => [newImage, ...prev]);
        showNotification('Image uploaded successfully!');
      } else {
        // Multiple images
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });

        const response = await axios.post('http://localhost:5000/api/upload/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const newImages = response.data.images.map((img, index) => ({
          id: img.public_id,
          url: img.url,
          public_id: img.public_id,
          width: img.width,
          height: img.height,
          uploadedAt: new Date().toISOString(),
          name: files[index].name
        }));

        setImages(prev => [...newImages, ...prev]);
        showNotification(`${newImages.length} images uploaded successfully!`);
      }

      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
      showNotification(
        error.response?.data?.message || 'Upload failed. Please try again.',
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId, publicId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/upload/image/${publicId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImages(prev => prev.filter(id => id !== imageId));
      showNotification('Image deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification('Failed to delete image', 'error');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    showNotification('Image URL copied to clipboard!');
  };

  const filteredImages = images.filter(image =>
    image.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.public_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload and manage images for your tutorials and content
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Images
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Images Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No images found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm ? 'No images match your search criteria.' : 'Upload your first image to get started.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Images
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              viewMode={viewMode}
              onDelete={() => handleDeleteImage(image.id, image.public_id)}
              onCopy={() => copyToClipboard(image.url)}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <ImageUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleImageUpload}
          uploading={uploading}
        />
      )}
    </div>
  );
};

// ImageCard Component
const ImageCard = ({ image, viewMode, onDelete, onCopy }) => {
  const [showPreview, setShowPreview] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <img
            src={image.url}
            alt={image.name}
            className="w-16 h-16 object-cover rounded-lg cursor-pointer"
            onClick={() => setShowPreview(true)}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {image.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {image.width} × {image.height}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(image.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={onCopy}
              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              title="Copy URL"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showPreview && (
          <ImagePreviewModal
            image={image}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <div className="aspect-square relative">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setShowPreview(true)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={onCopy}
              className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              title="Copy URL"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {image.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {image.width} × {image.height}
        </p>
      </div>

      {showPreview && (
        <ImagePreviewModal
          image={image}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

// ImageUploadModal Component
const ImageUploadModal = ({ onClose, onUpload, uploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    setSelectedFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload Images
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop images here, or click to select
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Select Images
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {file.name}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {uploading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ImagePreviewModal Component
const ImagePreviewModal = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl max-h-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={image.url}
          alt={image.name}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
          <p className="font-medium">{image.name}</p>
          <p className="text-sm opacity-75">{image.width} × {image.height}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageManagement;
