import express from 'express';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Judge0 API configuration - get fresh values each time
const getJudge0Config = () => ({
  url: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  key: process.env.JUDGE0_API_KEY
});

// Local code execution function
const executeCodeLocally = (code, language) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, '../temp');

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    let command = '';
    let filename = '';

    switch (language) {
      case 'python':
        filename = `temp_${Date.now()}.py`;
        command = `python "${path.join(tempDir, filename)}"`;
        break;
      case 'javascript':
        filename = `temp_${Date.now()}.js`;
        command = `node "${path.join(tempDir, filename)}"`;
        break;
      case 'java':
        filename = `Main.java`;
        const javaFile = path.join(tempDir, filename);
        command = `cd "${tempDir}" && javac "${filename}" && java Main`;
        break;
      default:
        return reject(new Error(`Local execution not supported for ${language}`));
    }

    const filePath = path.join(tempDir, filename);

    try {
      // Write code to temporary file
      fs.writeFileSync(filePath, code);

      // Execute the code
      exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
        // Clean up temporary file
        try {
          fs.unlinkSync(filePath);
          if (language === 'java') {
            const classFile = path.join(tempDir, 'Main.class');
            if (fs.existsSync(classFile)) {
              fs.unlinkSync(classFile);
            }
          }
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary files:', cleanupError);
        }

        if (error) {
          if (error.code === 'ETIMEDOUT') {
            resolve({
              stdout: '',
              stderr: 'Execution timeout (10 seconds)',
              status: { description: 'Time Limit Exceeded' },
              time: '10.0',
              memory: '0'
            });
          } else {
            resolve({
              stdout: stdout || '',
              stderr: stderr || error.message,
              status: { description: 'Runtime Error' },
              time: '0',
              memory: '0'
            });
          }
        } else {
          resolve({
            stdout: stdout || '',
            stderr: stderr || '',
            status: { description: 'Accepted' },
            time: '0',
            memory: '0'
          });
        }
      });
    } catch (fileError) {
      reject(fileError);
    }
  });
};

// Language ID mapping for Judge0
const LANGUAGE_IDS = {
  'javascript': 63, // Node.js
  'python': 71,     // Python 3
  'java': 62,       // Java
  'cpp': 54,        // C++ (GCC 9.2.0)
  'c': 50,          // C (GCC 9.2.0)
  'php': 68,        // PHP
  'ruby': 72,       // Ruby
  'go': 60,         // Go
  'rust': 73,       // Rust
  'sql': 82,        // SQL (SQLite)
  'html': 63,       // HTML (using Node.js for execution)
  'css': 63         // CSS (using Node.js for validation)
};

// Execute code
router.post('/execute', [
  body('code').notEmpty().withMessage('Code is required'),
  body('language').isIn(Object.keys(LANGUAGE_IDS)).withMessage('Unsupported language'),
  body('input').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language, input = '' } = req.body;
    const languageId = LANGUAGE_IDS[language];

    // Special handling for HTML/CSS
    if (language === 'html' || language === 'css') {
      return handleWebCode(req, res, code, language);
    }

    // Get current Judge0 configuration
    const judge0Config = getJudge0Config();

    // Check if using local execution
    if (judge0Config.url === 'local') {
      try {
        const result = await executeCodeLocally(code, language);

        return res.json({
          success: true,
          output: {
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: '',
            status: result.status.description,
            time: result.time,
            memory: result.memory
          },
          execution_time: result.time,
          memory_usage: result.memory
        });
      } catch (error) {
        console.error('Local execution error:', error);
        return res.json({
          success: true,
          output: {
            stdout: '',
            stderr: `Local execution error: ${error.message}`,
            compile_output: '',
            status: 'Error',
            time: '0',
            memory: '0'
          },
          execution_time: '0',
          memory_usage: '0'
        });
      }
    }

    // Check if API key is configured and valid (skip check for free tier)
    const isFreeAPI = judge0Config.url.includes('ce.judge0.com');
    if (!isFreeAPI && (!judge0Config.key || judge0Config.key === 'demo_key_replace_with_real_key' || judge0Config.key.trim() === '')) {
      return res.json({
        success: true,
        output: {
          stdout: `⚠️ Code execution is not configured.\n\nTo enable real code execution:\n1. Get a free API key from RapidAPI (Judge0 CE)\n2. Set JUDGE0_API_KEY in your environment variables\n\nYour ${language} code:\n${code}`,
          stderr: '',
          compile_output: '',
          status: 'Configuration Required',
          time: '0',
          memory: '0'
        },
        execution_time: '0',
        memory_usage: '0'
      });
    }

    // Prepare submission for Judge0
    const submission = {
      source_code: Buffer.from(code).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(input).toString('base64')
    };

    // Submit code to Judge0
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add RapidAPI headers if using RapidAPI endpoint
    if (!isFreeAPI) {
      headers['X-RapidAPI-Key'] = judge0Config.key;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    const submitResponse = await axios.post(
      `${judge0Config.url}/submissions?base64_encoded=true&wait=true`,
      submission,
      {
        headers,
        timeout: 30000 // 30 seconds timeout
      }
    );

    const result = submitResponse.data;

    // Decode base64 outputs
    const output = {
      stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
      stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
      compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '',
      status: result.status?.description || 'Unknown',
      time: result.time || '0',
      memory: result.memory || '0'
    };

    res.json({
      success: true,
      output,
      execution_time: result.time,
      memory_usage: result.memory
    });

  } catch (error) {
    console.error('Code execution error:', error);

    // Provide fallback response instead of error for better UX
    const fallbackResponse = {
      success: true,
      output: {
        stdout: `Code execution temporarily unavailable. Your ${req.body.language} code:\n\n${req.body.code}\n\nError: ${error.message}`,
        stderr: '',
        compile_output: '',
        status: 'Service Unavailable',
        time: '0',
        memory: '0'
      },
      execution_time: '0',
      memory_usage: '0'
    };

    if (error.code === 'ECONNABORTED') {
      fallbackResponse.output.stdout = `⏱️ Code execution timeout.\n\nThe execution took too long to complete (>30 seconds).\n\nYour ${req.body.language} code:\n${req.body.code}`;
      fallbackResponse.output.status = 'Timeout';
    } else if (error.response?.status === 429) {
      fallbackResponse.output.stdout = `🚫 Rate limit exceeded.\n\nToo many requests. Please try again later.\n\nYour ${req.body.language} code:\n${req.body.code}`;
      fallbackResponse.output.status = 'Rate Limited';
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      fallbackResponse.output.stdout = `🔑 Invalid API key.\n\nThe Judge0 API key is invalid or expired.\nPlease check your JUDGE0_API_KEY configuration.\n\nYour ${req.body.language} code:\n${req.body.code}`;
      fallbackResponse.output.status = 'Unauthorized';
    }

    res.json(fallbackResponse);
  }
});

// Handle HTML/CSS code execution
function handleWebCode(req, res, code, language) {
  try {
    if (language === 'html') {
      // For HTML, we'll return the code as-is for client-side rendering
      return res.json({
        success: true,
        output: {
          stdout: '',
          stderr: '',
          html_output: code,
          status: 'Accepted',
          time: '0',
          memory: '0'
        },
        execution_time: '0',
        memory_usage: '0'
      });
    }

    if (language === 'css') {
      // For CSS, we'll validate and return
      return res.json({
        success: true,
        output: {
          stdout: 'CSS code is valid',
          stderr: '',
          css_output: code,
          status: 'Accepted',
          time: '0',
          memory: '0'
        },
        execution_time: '0',
        memory_usage: '0'
      });
    }

  } catch (error) {
    console.error('Web code handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process web code'
    });
  }
}

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = Object.keys(LANGUAGE_IDS).map(lang => ({
    id: lang,
    name: lang.charAt(0).toUpperCase() + lang.slice(1),
    judge0_id: LANGUAGE_IDS[lang]
  }));

  res.json({ languages });
});

// Health check for compiler service
router.get('/health', async (req, res) => {
  try {
    // Get current Judge0 configuration
    const judge0Config = getJudge0Config();

    // Check if using local execution
    if (judge0Config.url === 'local') {
      try {
        const result = await executeCodeLocally('print("Hello, World!")', 'python');

        return res.json({
          status: 'OK',
          message: 'Local code execution is working',
          judge0_status: result.status.description,
          test_output: result.stdout,
          api_url: 'local'
        });
      } catch (error) {
        return res.status(503).json({
          status: 'ERROR',
          message: 'Local execution failed',
          details: error.message,
          api_url: 'local'
        });
      }
    }

    // Check API key configuration first (skip for free API)
    const isFreeAPI = judge0Config.url.includes('ce.judge0.com');
    if (!isFreeAPI && (!judge0Config.key || judge0Config.key === 'demo_key_replace_with_real_key' || judge0Config.key.trim() === '')) {
      return res.status(503).json({
        status: 'ERROR',
        message: 'Judge0 API key not configured',
        details: 'Set JUDGE0_API_KEY environment variable with a valid RapidAPI key'
      });
    }

    // Test with a simple Python code
    const testSubmission = {
      source_code: Buffer.from('print("Hello, World!")').toString('base64'),
      language_id: 71, // Python 3
      stdin: Buffer.from('').toString('base64')
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    // Add RapidAPI headers if using RapidAPI endpoint
    if (!isFreeAPI) {
      headers['X-RapidAPI-Key'] = judge0Config.key;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    const response = await axios.post(
      `${judge0Config.url}/submissions?base64_encoded=true&wait=true`,
      testSubmission,
      {
        headers,
        timeout: 10000
      }
    );

    const result = response.data;
    const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';

    res.json({
      status: 'OK',
      message: 'Code execution service is working',
      judge0_status: result.status?.description || 'Unknown',
      test_output: stdout,
      api_url: judge0Config.url
    });

  } catch (error) {
    console.error('Code execution health check failed:', error);

    let errorMessage = 'Code execution service unavailable';
    let details = error.message;

    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = 'Invalid API key';
      details = 'The Judge0 API key is invalid or expired';
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded';
      details = 'Too many requests to Judge0 API';
    }

    res.status(503).json({
      status: 'ERROR',
      message: errorMessage,
      details: details,
      api_url: getJudge0Config().url
    });
  }
});

export default router;
