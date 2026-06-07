const { getDb } = require('./src/db');
const { getEffectiveConfig } = require('./src/helpers/configHelper');

async function testModelSelection() {
    console.log('=== Testing Model Selection ===\n');

    // Test 1: Check database config
    console.log('1. Checking database configuration:');
    const db = await getDb();
    const configRows = await db.all('SELECT * FROM config');
    console.log('Config table contents:', configRows);

    // Test 2: Check effective config
    console.log('\n2. Checking effective config:');
    const model = await getEffectiveConfig('gemini_model');
    const apiKey = await getEffectiveConfig('gemini_api_key');
    console.log('Effective model:', model);
    console.log('Has API key:', !!apiKey);

    // Test 3: Simulate what the route does
    console.log('\n3. Simulating route behavior:');
    const routeModel = await getEffectiveConfig('gemini_model');
    console.log('Model passed to generatePosts:', routeModel);

    console.log('\n=== Test Complete ===');
    process.exit(0);
}

testModelSelection().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
