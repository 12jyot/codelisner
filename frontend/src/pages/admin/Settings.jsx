import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Save, 
  Globe, 
  Shield, 
  Mail, 
  Database,
  Key,
  Upload,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'CodeNotes',
      siteDescription: 'Learn programming with interactive tutorials',
      siteUrl: 'http://localhost:5714',
      adminEmail: 'admin@codenotes.com'
    },
    security: {
      jwtSecret: '',
      sessionTimeout: 7,
      maxLoginAttempts: 5,
      requireEmailVerification: false
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@codenotes.com',
      fromName: 'CodeNotes'
    },
    compiler: {
      judge0ApiUrl: 'https://judge0-ce.p.rapidapi.com',
      judge0ApiKey: '',
      executionTimeout: 10,
      memoryLimit: 128
    },
    storage: {
      cloudinaryCloudName: '',
      cloudinaryApiKey: '',
      cloudinaryApiSecret: '',
      maxFileSize: 5
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Note: This endpoint needs to be created in the backend
      const response = await axios.get('http://localhost:5000/api/admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Use default settings if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('http://localhost:5000/api/admin/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const testCompilerConnection = async () => {
    try {
      setTestingConnection(true);
      setConnectionStatus(null);

      const response = await axios.get('http://localhost:5000/api/compiler/health');

      setConnectionStatus({
        success: true,
        message: response.data.message,
        details: response.data.test_output ? `Test output: "${response.data.test_output}"` : response.data.details
      });
    } catch (error) {
      console.error('Connection test failed:', error);

      const errorData = error.response?.data;
      setConnectionStatus({
        success: false,
        message: errorData?.message || 'Connection test failed',
        details: errorData?.details || error.message
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'compiler', label: 'Compiler', icon: Database },
    { id: 'storage', label: 'Storage', icon: Upload }
  ];

  const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, helpText }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {helpText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );

  const CheckboxField = ({ label, checked, onChange, description }) => (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div className="ml-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure your platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Site Name"
                    value={settings.general.siteName}
                    onChange={(value) => updateSetting('general', 'siteName', value)}
                    required
                  />
                  <InputField
                    label="Admin Email"
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(value) => updateSetting('general', 'adminEmail', value)}
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Site Description"
                      value={settings.general.siteDescription}
                      onChange={(value) => updateSetting('general', 'siteDescription', value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField
                      label="Site URL"
                      value={settings.general.siteUrl}
                      onChange={(value) => updateSetting('general', 'siteUrl', value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Security settings are sensitive. Changes will require server restart.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="JWT Secret"
                    type="password"
                    value={settings.security.jwtSecret}
                    onChange={(value) => updateSetting('security', 'jwtSecret', value)}
                    placeholder="Enter a strong secret key"
                    required
                  />
                  <InputField
                    label="Session Timeout (days)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(value) => updateSetting('security', 'sessionTimeout', parseInt(value))}
                  />
                  <InputField
                    label="Max Login Attempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(value) => updateSetting('security', 'maxLoginAttempts', parseInt(value))}
                  />
                  <div className="md:col-span-2">
                    <CheckboxField
                      label="Require Email Verification"
                      checked={settings.security.requireEmailVerification}
                      onChange={(value) => updateSetting('security', 'requireEmailVerification', value)}
                      description="Users must verify their email before accessing the platform"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="SMTP Host"
                    value={settings.email.smtpHost}
                    onChange={(value) => updateSetting('email', 'smtpHost', value)}
                    placeholder="smtp.gmail.com"
                  />
                  <InputField
                    label="SMTP Port"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(value) => updateSetting('email', 'smtpPort', parseInt(value))}
                  />
                  <InputField
                    label="SMTP Username"
                    value={settings.email.smtpUser}
                    onChange={(value) => updateSetting('email', 'smtpUser', value)}
                  />
                  <InputField
                    label="SMTP Password"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(value) => updateSetting('email', 'smtpPassword', value)}
                  />
                  <InputField
                    label="From Email"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(value) => updateSetting('email', 'fromEmail', value)}
                  />
                  <InputField
                    label="From Name"
                    value={settings.email.fromName}
                    onChange={(value) => updateSetting('email', 'fromName', value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'compiler' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Code Execution Settings</h2>
                  <button
                    onClick={testCompilerConnection}
                    disabled={testingConnection}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {testingConnection ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Test Connection
                      </>
                    )}
                  </button>
                </div>

                {connectionStatus && (
                  <div className={`p-4 rounded-lg border ${
                    connectionStatus.success
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
                      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
                  }`}>
                    <div className="flex items-center">
                      {connectionStatus.success ? (
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="font-medium">{connectionStatus.message}</span>
                    </div>
                    {connectionStatus.details && (
                      <p className="mt-2 text-sm">{connectionStatus.details}</p>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">📋 Setup Instructions</h3>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Visit <a href="https://rapidapi.com/judge0-official/api/judge0-ce" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-100">RapidAPI Judge0 CE</a></li>
                    <li>Subscribe to the free plan (500 requests/month)</li>
                    <li>Copy your API key from the dashboard</li>
                    <li>Paste it in the field below and save settings</li>
                    <li>Click "Test Connection" to verify it works</li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputField
                      label="Judge0 API URL"
                      value={settings.compiler.judge0ApiUrl}
                      onChange={(value) => updateSetting('compiler', 'judge0ApiUrl', value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField
                      label="Judge0 API Key"
                      type="password"
                      value={settings.compiler.judge0ApiKey}
                      onChange={(value) => updateSetting('compiler', 'judge0ApiKey', value)}
                      placeholder="Your RapidAPI key (e.g., 1234567890abcdef...)"
                      required
                      helpText="Get your free API key from RapidAPI Judge0 CE service"
                    />
                  </div>
                  <InputField
                    label="Execution Timeout (seconds)"
                    type="number"
                    value={settings.compiler.executionTimeout}
                    onChange={(value) => updateSetting('compiler', 'executionTimeout', parseInt(value))}
                  />
                  <InputField
                    label="Memory Limit (MB)"
                    type="number"
                    value={settings.compiler.memoryLimit}
                    onChange={(value) => updateSetting('compiler', 'memoryLimit', parseInt(value))}
                  />
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Storage Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Cloudinary Cloud Name"
                    value={settings.storage.cloudinaryCloudName}
                    onChange={(value) => updateSetting('storage', 'cloudinaryCloudName', value)}
                  />
                  <InputField
                    label="Max File Size (MB)"
                    type="number"
                    value={settings.storage.maxFileSize}
                    onChange={(value) => updateSetting('storage', 'maxFileSize', parseInt(value))}
                  />
                  <InputField
                    label="Cloudinary API Key"
                    value={settings.storage.cloudinaryApiKey}
                    onChange={(value) => updateSetting('storage', 'cloudinaryApiKey', value)}
                  />
                  <InputField
                    label="Cloudinary API Secret"
                    type="password"
                    value={settings.storage.cloudinaryApiSecret}
                    onChange={(value) => updateSetting('storage', 'cloudinaryApiSecret', value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
