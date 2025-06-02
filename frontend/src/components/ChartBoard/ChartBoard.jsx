import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  BookOpen,
  Eye,
  Star,
  Clock,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Award,
  Activity,
  Zap,
  Send,
  MessageSquare,
  Bot,
  Sparkles
} from 'lucide-react';

const ChartBoard = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [activeChart, setActiveChart] = useState('overview');
  const [customQuestion, setCustomQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomAnswer, setShowCustomAnswer] = useState(false);
  const [error, setError] = useState(null);



  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // Q&A Data
  const questionsAndAnswers = [
    {
      question: "What is the most popular programming language on CodeNotes?",
      answer: "JavaScript leads with 35% of all tutorials, followed by Python (28%) and Java (20%).",
      chart: "languages",
      note: "JavaScript's popularity stems from its versatility in both frontend and backend development.",
      emoji: "🚀",
      category: "Languages"
    },
    {
      question: "How many users are actively learning on the platform?",
      answer: "We have 1,234 active users with an average of 156 new registrations per week.",
      chart: "users",
      note: "User engagement has increased by 23% this month compared to last month.",
      emoji: "👥",
      category: "Users"
    },
    {
      question: "Which tutorials get the most views?",
      answer: "Beginner-friendly tutorials receive 60% more views than advanced topics.",
      chart: "views",
      note: "Interactive tutorials with code examples perform 40% better than text-only content.",
      emoji: "👀",
      category: "Views"
    },
    {
      question: "What's the completion rate for tutorials?",
      answer: "Average completion rate is 78%, with JavaScript tutorials having the highest rate at 85%.",
      chart: "completion",
      note: "Shorter tutorials (under 15 minutes) have significantly higher completion rates.",
      emoji: "✅",
      category: "Completion"
    }
  ];

  // AI Service Configuration - Using Gemini as primary (OpenAI key invalid)
  const aiProvider = 'gemini'; // Use Gemini as primary AI provider

  // Use environment variable for OpenAI API key (currently invalid)
  const openaiApiKey = null; // Disabled due to invalid key
  // Use Gemini as primary provider
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDRULtMCOAKN389er9yOI9W0HcYDh9SKMs';



  // Enhanced AI Response Generator - Using Gemini as primary
  const generateAIResponse = async (question) => {
    console.log('🤖 Starting AI response generation for:', question);

    // Check if this is an educational question
    const isEducationalQuestion = checkIfNeedsWebSearch(question);
    console.log('📚 Is educational question:', isEducationalQuestion);

    // Use Gemini AI as primary provider
    console.log('🔮 Using Gemini AI as primary provider');
    try {
      const response = await callGeminiAI(question);
      console.log('✅ Gemini AI response received');

      const chartType = isEducationalQuestion ? 'languages' : 'users';
      const notePrefix = isEducationalQuestion ? 'Educational response' : 'Response';

      return {
        answer: response,
        chart: chartType,
        note: `${notePrefix} powered by Google Gemini AI`
      };
    } catch (error) {
      console.error('❌ Gemini AI failed:', error.message);

      // Final fallback to local response
      console.log('🏠 Using local response as fallback');
      const localResponse = generateLocalResponse(question);
      return {
        ...localResponse,
        note: `Local response (AI temporarily unavailable: ${error.message})`
      };
    }
  };

  // Check if question is educational (education and studies focused)
  const checkIfNeedsWebSearch = (question) => {
    const lowerQuestion = question.toLowerCase();

    // Education and study-related keywords that trigger educational AI responses
    const educationKeywords = [
      // Programming & Technology
      'javascript', 'python', 'java', 'react', 'nodejs', 'html', 'css',
      'angular', 'vue', 'typescript', 'php', 'c++', 'c#', 'ruby',
      'go', 'rust', 'swift', 'kotlin', 'flutter', 'programming', 'coding',
      'software', 'web development', 'mobile development', 'algorithm',

      // Academic Subjects
      'mathematics', 'math', 'calculus', 'algebra', 'geometry', 'statistics',
      'physics', 'chemistry', 'biology', 'science', 'history', 'geography',
      'literature', 'english', 'writing', 'grammar', 'language', 'linguistics',
      'psychology', 'sociology', 'philosophy', 'economics', 'business',
      'accounting', 'finance', 'marketing', 'management',

      // Study Topics
      'study', 'learn', 'education', 'course', 'lesson', 'tutorial',
      'training', 'skill', 'knowledge', 'research', 'academic',
      'university', 'college', 'school', 'degree', 'certification',
      'exam', 'test', 'assignment', 'homework', 'project',

      // Learning Methods
      'online learning', 'e-learning', 'distance learning', 'mooc',
      'educational', 'instructional', 'pedagogy', 'teaching method'
    ];

    // Triggers for educational AI responses
    const searchTriggers = [
      'what is', 'how to', 'tutorial', 'guide', 'learn', 'study',
      'explain', 'definition', 'meaning', 'examples', 'practice',
      'latest', 'recent', 'new', 'best practices', 'tips',
      'course', 'lesson', 'training', 'help with'
    ];

    // Check if question contains education keywords AND search triggers
    const hasEducationKeyword = educationKeywords.some(keyword =>
      lowerQuestion.includes(keyword)
    );

    const hasSearchTrigger = searchTriggers.some(trigger =>
      lowerQuestion.includes(trigger)
    );

    return hasEducationKeyword && hasSearchTrigger;
  };

  // Perform education-focused web search
  const performWebSearch = async (question) => {
    try {
      // Enhance search query with educational context
      const educationalQuery = `${question} tutorial guide learn study education`;
      const searchQuery = encodeURIComponent(educationalQuery);
      const response = await fetch(`https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`);

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract education-related information
      let answer = '';
      let sources = [];

      if (data.Abstract) {
        answer = data.Abstract;
        if (data.AbstractURL) {
          sources.push(data.AbstractURL);
        }
      } else if (data.Definition) {
        answer = data.Definition;
        if (data.DefinitionURL) {
          sources.push(data.DefinitionURL);
        }
      } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        // Filter for education-related topics
        const educationalTopics = data.RelatedTopics.filter(topic => {
          const topicText = topic.Text?.toLowerCase() || '';
          return topicText.includes('education') ||
                 topicText.includes('learn') ||
                 topicText.includes('study') ||
                 topicText.includes('tutorial') ||
                 topicText.includes('course') ||
                 topicText.includes('teaching') ||
                 topicText.includes('academic') ||
                 topicText.includes('school') ||
                 topicText.includes('university');
        });

        if (educationalTopics.length > 0) {
          answer = educationalTopics[0].Text;
        } else {
          answer = data.RelatedTopics[0].Text || 'Found educational information';
        }
      } else {
        // Education-specific fallback
        answer = `📚 I searched for educational information about "${question}" but couldn't find specific details. You could try asking about specific study topics, learning methods, or check our platform's educational resources and tutorial analytics.`;
      }

      if (!answer) {
        answer = `🔍 I searched for educational content about "${question}" but couldn't find specific results. You can ask about specific subjects, study methods, or check our platform's tutorial analytics instead.`;
      }

      return {
        answer: `📚 ${answer}`,
        chart: 'languages',
        note: `Educational web search results${sources.length > 0 ? ` • Sources: ${sources.join(', ')}` : ''}`
      };

    } catch (error) {
      console.error('❌ Educational web search error:', error);
      throw new Error(`Educational web search failed: ${error.message}`);
    }
  };

  // OpenAI call function for educational questions
  const callOpenAIForEducation = async (question) => {
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational AI assistant specializing in programming, computer science, and academic subjects. Provide comprehensive, educational answers with examples, explanations, and learning guidance. Focus on teaching concepts clearly and providing practical learning advice."
        },
        {
          role: "user",
          content: `Please provide an educational explanation for: ${question}. Include key concepts, examples if applicable, and learning tips.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`OpenAI Educational API Error ${response.status}: ${errorData.error?.message || errorText}`);
      } catch (parseError) {
        throw new Error(`OpenAI Educational API Error ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();

    // Extract the text from OpenAI's response format
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response format from OpenAI Educational API');
    }
  };

  // OpenAI call function for general questions
  const callOpenAI = async (question) => {
    console.log('🔧 Calling OpenAI API with question:', question);
    console.log('🔑 API Key (first 10 chars):', openaiApiKey?.substring(0, 10) + '...');

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for a programming tutorial platform. Answer questions about users, tutorials, and platform analytics in a concise and informative way."
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    };

    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error Response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`OpenAI API Error ${response.status}: ${errorData.error?.message || errorText}`);
      } catch (parseError) {
        throw new Error(`OpenAI API Error ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('📥 OpenAI Response data:', data);

    // Extract the text from OpenAI's response format
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      const content = data.choices[0].message.content.trim();
      console.log('✅ Extracted content:', content);
      return content;
    } else {
      console.error('❌ Invalid response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }
  };

  // Gemini AI call function
  const callGeminiAI = async (question) => {
    console.log('🔮 Calling Gemini AI with question:', question);
    console.log('🔑 Gemini API Key (first 10 chars):', geminiApiKey?.substring(0, 10) + '...');

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful AI assistant for a programming tutorial platform. Answer questions about users, tutorials, and platform analytics. Question: ${question}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 150
      }
    };

    console.log('📤 Gemini Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Gemini Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API Error Response:', errorText);

      // Parse the error for more details
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Gemini API Error ${response.status}: ${errorData.error?.message || errorText}`);
      } catch (parseError) {
        throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('📥 Gemini Response data:', data);

    // Extract the text from Gemini's response format
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const content = data.candidates[0].content.parts[0].text;
      console.log('✅ Extracted Gemini content:', content);
      return content;
    } else {
      console.error('❌ Invalid Gemini response format:', data);
      throw new Error('Invalid response format from Gemini AI');
    }
  };



  // Parse AI response to extract answer, chart, and note
  const parseAIResponse = (aiResponse) => {
    let answer = aiResponse;
    let chart = 'languages'; // default
    let note = '';

    // Extract chart suggestion
    const chartMatch = aiResponse.match(/\[CHART:(\w+)\]/);
    if (chartMatch) {
      chart = chartMatch[1];
      answer = answer.replace(/\[CHART:\w+\]/, '').trim();
    }

    // Extract note
    const noteMatch = aiResponse.match(/\[NOTE:([^\]]+)\]/);
    if (noteMatch) {
      note = noteMatch[1];
      answer = answer.replace(/\[NOTE:[^\]]+\]/, '').trim();
    }

    return { answer, chart, note };
  };

  // Fallback local response generator
  const generateLocalResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('tutorial') || lowerQuestion.includes('course')) {
      return {
        answer: "📚 We have 150+ tutorials with JavaScript leading at 35%, Python at 28%, and Java at 20%. Interactive exercises show 40% higher engagement than text-only content.",
        note: "Tutorials under 15 minutes have significantly higher completion rates.",
        chart: "languages"
      };
    } else if (lowerQuestion.includes('user') || lowerQuestion.includes('student')) {
      return {
        answer: "👥 Our platform serves 1,234 active users with 23.1% monthly growth. We see 156 new registrations weekly and 89 daily active users.",
        note: "Users completing hands-on exercises have 65% higher retention rates.",
        chart: "users"
      };
    } else if (lowerQuestion.includes('popular') || lowerQuestion.includes('trending')) {
      return {
        answer: "🚀 JavaScript dominates with 35% popularity, followed by Python (28%) and Java (20%). React tutorials show exceptional 80% completion rates.",
        note: "Popularity trends align with current job market demands.",
        chart: "languages"
      };
    } else if (lowerQuestion.includes('completion') || lowerQuestion.includes('rate')) {
      return {
        answer: "✅ Overall completion rate is 78%, with JavaScript leading at 85%, Python at 78%, Java at 72%, and React at 80%.",
        note: "Interactive tutorials show 40% better completion rates than video-only formats.",
        chart: "completion"
      };
    } else {
      return {
        answer: "🤖 I'm your AI analytics assistant! I can help with user statistics, tutorial performance, completion rates, and platform insights. Try asking about specific metrics or trends.",
        note: "Ask about users, tutorials, completion rates, or trending topics for detailed insights.",
        chart: "languages"
      };
    }
  };

  // Handle custom question submission with real AI
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user question to chat history
    const userMessage = {
      type: 'user',
      content: customQuestion,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    const currentQuestion = customQuestion;
    setCustomQuestion(''); // Clear input immediately

    try {
      // Debug: Log API key availability
      console.log('🔑 OpenAI API Key available:', !!openaiApiKey);
      console.log('🔑 Gemini API Key available:', !!geminiApiKey);
      console.log('❓ Question:', currentQuestion);

      // Call real AI service
      const aiResponse = await generateAIResponse(currentQuestion);

      console.log('✅ AI Response received:', aiResponse);

      const botMessage = {
        type: 'bot',
        content: aiResponse.answer,
        note: aiResponse.note,
        chart: aiResponse.chart,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, botMessage]);
      setShowCustomAnswer(true);
      setIsLoading(false);
    } catch (err) {
      console.error('❌ Error processing AI question:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });

      setError(`AI Error: ${err.message || 'Failed to get AI response. Please try again.'}`);
      setIsLoading(false);

      // Add error message to chat
      const errorMessage = {
        type: 'bot',
        content: `❌ Sorry, I encountered an error: ${err.message}. Please check the console for more details.`,
        note: "Check browser console for detailed error information.",
        chart: null,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  // Chart Data
  const chartData = {
    languages: [
      { name: 'JavaScript', value: 35, color: 'bg-yellow-500' },
      { name: 'Python', value: 28, color: 'bg-blue-500' },
      { name: 'Java', value: 20, color: 'bg-red-500' },
      { name: 'React', value: 17, color: 'bg-cyan-500' }
    ],
    users: {
      total: 1234,
      growth: 23.1,
      newThisWeek: 156,
      activeToday: 89
    },
    views: [
      { category: 'Beginner', views: 15678, percentage: 45 },
      { category: 'Intermediate', views: 9876, percentage: 28 },
      { category: 'Advanced', views: 5432, percentage: 16 },
      { category: 'Expert', views: 3890, percentage: 11 }
    ],
    completion: [
      { language: 'JavaScript', rate: 85, color: 'bg-green-500' },
      { language: 'Python', rate: 78, color: 'bg-blue-500' },
      { language: 'Java', rate: 72, color: 'bg-orange-500' },
      { language: 'React', rate: 80, color: 'bg-purple-500' }
    ]
  };

  // Render chart for chat messages
  const renderChartForMessage = (chartType) => {
    try {
      const data = chartData[chartType];
      if (!data) {
        return <div className="text-red-500 text-xs">Chart data not available</div>;
      }

      return renderChartByType(chartType, data);
    } catch (error) {
      return <div className="text-red-500 text-xs">Failed to render chart</div>;
    }
  };

  // Render chart by type (shared function)
  const renderChartByType = (chartType, data) => {
    switch (chartType) {
      case 'languages':
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`chart-bar h-3 rounded-full ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}%
                </div>
              </div>
            ))}
          </div>
        );

      case 'users':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">+{data.growth}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
            </div>
          </div>
        );

      case 'views':
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">{item.views.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'completion':
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.language}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`chart-bar h-3 rounded-full ${item.color}`}
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900 dark:text-white">
                  {item.rate}%
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-red-500 text-xs">Unknown chart type</div>;
    }
  };



  return (
    <div className="space-y-4">


      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <p className="text-red-700 dark:text-red-300 font-medium text-sm">Error</p>
          </div>
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
          >
            Dismiss
          </button>
        </div>
      )}



      {/* Question Input Bar - Compact */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
        <form onSubmit={handleQuestionSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask me anything about analytics, users, tutorials, or data..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!customQuestion.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>

      {/* AI Chat Interface */}
      <div className="space-y-4">
        {/* Chat History */}
        <div className="chat-container bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex space-x-2 mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <Bot className="h-6 w-6 text-indigo-600" />
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🤖 Gemini AI Chart Assistant
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                Ask me about platform analytics, user statistics, tutorial performance, or educational topics. I'm powered by Google Gemini AI and ready to help with intelligent responses and data visualizations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                  "Show user statistics"
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                  "What's trending?"
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                  "Tutorial completion rates"
                </span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                  "How to learn JavaScript?"
                </span>
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs">
                  "Explain React components"
                </span>

              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm">🤖</span>
                        <span className="text-xs font-medium text-blue-600">
                          Gemini AI Assistant
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>

                    {/* Show chart if available */}
                    {message.type === 'bot' && message.chart && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Data Visualization
                        </h5>
                        <div className="chart-container">
                          {renderChartForMessage(message.chart)}
                        </div>
                      </div>
                    )}

                    {/* Show note if available */}
                    {message.type === 'bot' && message.note && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700/50">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          💡 {message.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartBoard;
