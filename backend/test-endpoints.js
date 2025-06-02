import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test all tutorial endpoints
const testEndpoints = async () => {
  console.log('🧪 Testing Tutorial API Endpoints...\n');

  const tests = [
    {
      name: 'Get Categories',
      method: 'GET',
      url: `${BASE_URL}/tutorials/meta/categories`,
      expected: 'categories array'
    },
    {
      name: 'Get Stats',
      method: 'GET', 
      url: `${BASE_URL}/tutorials/meta/stats`,
      expected: 'stats object'
    },
    {
      name: 'Search Tutorials',
      method: 'GET',
      url: `${BASE_URL}/tutorials/search?q=javascript`,
      expected: 'search results'
    },
    {
      name: 'Get All Tutorials',
      method: 'GET',
      url: `${BASE_URL}/tutorials`,
      expected: 'tutorials array'
    },
    {
      name: 'Get Tutorials with Pagination',
      method: 'GET',
      url: `${BASE_URL}/tutorials?page=1&limit=5`,
      expected: 'paginated tutorials'
    },
    {
      name: 'Get Tutorials by Category',
      method: 'GET',
      url: `${BASE_URL}/tutorials?category=JavaScript`,
      expected: 'filtered tutorials'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axios.get(test.url);
      
      if (response.status === 200) {
        console.log(`✅ PASS - ${test.name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Data keys: ${Object.keys(response.data).join(', ')}`);
        passed++;
      } else {
        console.log(`❌ FAIL - ${test.name} - Status: ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ FAIL - ${test.name}`);
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data?.message || 'No message'}`);
      }
      failed++;
    }
    console.log(''); // Empty line for readability
  }

  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Tutorial API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the server and database connection.');
  }
};

// Test specific tutorial by slug (if exists)
const testTutorialBySlug = async () => {
  try {
    console.log('\n🔍 Testing tutorial by slug...');
    const response = await axios.get(`${BASE_URL}/tutorials/javascript-fundamentals-for-beginners`);
    
    if (response.status === 200) {
      console.log('✅ Tutorial by slug test passed');
      console.log(`   Title: ${response.data.tutorial?.title || 'No title'}`);
      console.log(`   Views: ${response.data.tutorial?.views || 0}`);
    }
  } catch (error) {
    console.log('❌ Tutorial by slug test failed');
    console.log(`   Error: ${error.message}`);
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Tutorial API Tests...\n');
  console.log('Make sure the server is running on http://localhost:5000\n');

  try {
    await testEndpoints();
    await testTutorialBySlug();
  } catch (error) {
    console.error('❌ Test runner error:', error.message);
  }

  console.log('\n✨ Testing complete!');
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testEndpoints, testTutorialBySlug, runTests };
