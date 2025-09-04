#!/usr/bin/env node

const http = require('http');

const testRoutes = [
  { path: '/', name: 'Home Page' },
  { path: '/demo', name: 'Demo Landing Page' },
  { path: '/patient-demo', name: 'Patient Demo' },
  { path: '/doctor-demo', name: 'Doctor Demo' },
  { path: '/simple', name: 'Simple Page' }
];

const baseUrl = 'http://localhost:3006';

function testRoute(route) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${route.path}`;
    
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === 200;
        const hasContent = data.length > 0;
        const hasTitle = data.includes('<title>') || data.includes('Health Optimization');
        
        resolve({
          route: route.name,
          path: route.path,
          status: res.statusCode,
          success: success && hasContent,
          hasTitle,
          contentLength: data.length
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        route: route.name,
        path: route.path,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        route: route.name,
        path: route.path,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Demo Routes...\n');
  
  const results = [];
  
  for (const route of testRoutes) {
    console.log(`Testing ${route.name} (${route.path})...`);
    const result = await testRoute(route);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.route}: OK (${result.status}, ${result.contentLength} bytes)`);
    } else {
      console.log(`❌ ${result.route}: FAILED (${result.status}) ${result.error || ''}`);
    }
  }
  
  console.log('\n📊 Test Summary:');
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All demo routes are working correctly!');
    console.log(`\n🌐 Demo URLs:`);
    console.log(`   • Demo Hub: ${baseUrl}/demo`);
    console.log(`   • Patient Demo: ${baseUrl}/patient-demo`);
    console.log(`   • Doctor Demo: ${baseUrl}/doctor-demo`);
  } else {
    console.log('\n⚠️  Some routes failed. Check the server logs for details.');
  }
}

runTests().catch(console.error);
