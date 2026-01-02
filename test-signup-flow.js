const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3009';

async function testSignupFlow() {
  console.log('Starting signup flow test...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
  };

  try {
    // Step 1: Navigate to landing page
    console.log('1. Navigating to landing page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    console.log(`   Page title: ${title}`);
    results.passed.push('Landing page loads');

    // Step 2: Find and click signup button
    console.log('\n2. Looking for signup link...');
    const signupLink = await page.locator('a[href="/signup"]').first();
    const signupExists = await signupLink.count() > 0;

    if (signupExists) {
      console.log('   Found signup link, clicking...');
      await signupLink.click();
      await page.waitForURL('**/signup', { timeout: 10000 });
      console.log(`   Current URL: ${page.url()}`);
      results.passed.push('Signup link works');
    } else {
      console.log('   ERROR: No signup link found on landing page');
      results.failed.push('Signup link not found');
    }

    // Step 3: Check signup page loaded
    console.log('\n3. Checking signup page...');
    const signupTitle = await page.locator('text=Create your account').count();
    if (signupTitle > 0) {
      console.log('   Signup page loaded correctly');
      results.passed.push('Signup page displays');
    } else {
      console.log('   ERROR: Signup page title not found');
      results.failed.push('Signup page not displaying correctly');
    }

    // Step 4: Check form fields exist
    console.log('\n4. Checking form fields...');
    const fields = {
      'First name': await page.locator('#firstName').count() > 0,
      'Last name': await page.locator('#lastName').count() > 0,
      'Email': await page.locator('#email').count() > 0,
      'Password': await page.locator('#password').count() > 0,
      'Company': await page.locator('#company').count() > 0,
    };

    for (const [field, exists] of Object.entries(fields)) {
      if (exists) {
        console.log(`   ✓ ${field} field exists`);
        results.passed.push(`${field} field exists`);
      } else {
        console.log(`   ✗ ${field} field missing`);
        results.failed.push(`${field} field missing`);
      }
    }

    // Step 5: Fill out the form
    console.log('\n5. Filling out signup form...');
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', 'testuser@example.com');
    await page.fill('#password', 'TestPassword123!');
    await page.fill('#company', 'Test Company');
    console.log('   Form filled successfully');
    results.passed.push('Form can be filled');

    // Step 6: Check submit button
    console.log('\n6. Checking submit button...');
    const submitButton = await page.locator('button[type="submit"]');
    const buttonExists = await submitButton.count() > 0;
    if (buttonExists) {
      const buttonText = await submitButton.textContent();
      console.log(`   Submit button found: "${buttonText}"`);
      results.passed.push('Submit button exists');
    } else {
      console.log('   ERROR: Submit button not found');
      results.failed.push('Submit button missing');
    }

    // Step 7: Try to submit the form
    console.log('\n7. Attempting form submission...');

    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for network requests
    let signupApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/auth/signup') || request.url().includes('/api/auth/register')) {
        signupApiCalled = true;
        console.log(`   API Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/auth')) {
        console.log(`   API Response: ${response.status()} ${response.url()}`);
      }
    });

    await submitButton.click();
    await page.waitForTimeout(2000); // Wait for any async actions

    if (signupApiCalled) {
      console.log('   Signup API was called');
      results.passed.push('Signup API called');
    } else {
      console.log('   WARNING: No signup API call detected');
      results.failed.push('No signup API called - form submission not working');
    }

    // Check for navigation or error
    const currentUrl = page.url();
    console.log(`   Current URL after submit: ${currentUrl}`);

    if (currentUrl.includes('/dashboard')) {
      console.log('   Redirected to dashboard - signup successful!');
      results.passed.push('Redirect to dashboard');
    } else if (currentUrl.includes('/signup')) {
      console.log('   Still on signup page - checking for errors...');
      const errorMessage = await page.locator('.text-red-500, .text-danger, [class*="error"]').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`   Error displayed: ${errorMessage}`);
        results.failed.push(`Signup error: ${errorMessage}`);
      } else {
        console.log('   No error message displayed, but form did not submit');
        results.failed.push('Form submission not functional');
      }
    }

    // Step 8: Check login page link
    console.log('\n8. Checking login link from signup page...');
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
    const loginLink = await page.locator('a[href="/login"]').first();
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await page.waitForURL('**/login', { timeout: 10000 });
      console.log('   Login link works');
      results.passed.push('Login link from signup works');
    } else {
      console.log('   ERROR: Login link not found');
      results.failed.push('Login link not found on signup page');
    }

    // Step 9: Test login with demo credentials
    console.log('\n9. Testing login with demo credentials...');
    await page.fill('#email', 'demo@ragaurd.com');
    await page.fill('#password', 'demo123');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);

    const loginUrl = page.url();
    console.log(`   Current URL after login: ${loginUrl}`);

    if (loginUrl.includes('/dashboard')) {
      console.log('   Login successful - redirected to dashboard!');
      results.passed.push('Demo login works');
    } else {
      const loginError = await page.locator('.text-danger, [class*="error"]').textContent().catch(() => null);
      if (loginError) {
        console.log(`   Login error: ${loginError}`);
        results.failed.push(`Login error: ${loginError}`);
      } else {
        console.log('   Login did not redirect to dashboard');
        results.failed.push('Login not working');
      }
    }

  } catch (error) {
    console.error('\nTest error:', error.message);
    results.failed.push(`Test error: ${error.message}`);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`\nPassed: ${results.passed.length}`);
  results.passed.forEach(msg => console.log(`  ✓ ${msg}`));
  console.log(`\nFailed: ${results.failed.length}`);
  results.failed.forEach(msg => console.log(`  ✗ ${msg}`));
  console.log('\n' + '='.repeat(50));

  if (results.failed.length > 0) {
    console.log('\nRECOMMENDATIONS:');
    if (results.failed.some(f => f.includes('signup API'))) {
      console.log('- Create /api/auth/signup endpoint');
      console.log('- Add form submission handler to signup page');
    }
    process.exit(1);
  }

  process.exit(0);
}

testSignupFlow();
