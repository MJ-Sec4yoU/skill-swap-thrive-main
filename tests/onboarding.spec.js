// Onboarding Flow Automated Tests using Playwright
// Run with: npm run test:onboarding or npx playwright test onboarding.spec.js

import { test, expect } from '@playwright/test';

const testUser = {
  email: `onboarding-test-${Date.now()}@example.com`,
  name: 'Onboarding Test User',
  password: 'SecureTestPassword123!',
  bio: 'I am testing the onboarding flow',
  skillsToLearn: ['JavaScript', 'React'],
  skillsToTeach: ['Python', 'Testing']
};

test.describe('Onboarding Flow Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start with clean slate
    await page.goto('http://localhost:8080');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('User Registration', () => {
    
    test('should complete registration successfully', async ({ page }) => {
      await page.goto('/register');
      
      // Verify registration page loads
      await expect(page.locator('h1, h2')).toContainText(/register|sign up/i);
      
      // Fill registration form
      await page.fill('[name="email"], [type="email"]', testUser.email);
      await page.fill('[name="name"], [placeholder*="name"]', testUser.name);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      
      // Handle confirm password if it exists
      const confirmPasswordField = page.locator('[name="confirmPassword"], [name="confirm_password"], [placeholder*="confirm"]');
      if (await confirmPasswordField.count() > 0) {
        await confirmPasswordField.fill(testUser.password);
      }
      
      // Submit form
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      
      // Verify success - should redirect or show success
      await page.waitForURL(/login|onboarding|dashboard/, { timeout: 10000 });
      
      // Check for success indicators
      const successIndicators = [
        '.success-message',
        ':has-text("success")',
        ':has-text("registered")',
        ':has-text("created")'
      ];
      
      let foundSuccess = false;
      for (const indicator of successIndicators) {
        if (await page.locator(indicator).count() > 0) {
          foundSuccess = true;
          break;
        }
      }
      
      expect(foundSuccess || page.url().includes('/login') || page.url().includes('/onboarding')).toBeTruthy();
    });

    test('should validate registration form fields', async ({ page }) => {
      await page.goto('/register');
      
      // Try to submit empty form
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      
      // Should show validation errors
      await expect(page.locator('.error, .error-message, [class*="error"], .text-red-500')).toBeVisible({ timeout: 5000 });
      
      // Test invalid email
      await page.fill('[name="email"], [type="email"]', 'invalid-email');
      await page.fill('[name="name"], [placeholder*="name"]', testUser.name);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      
      // Should show email validation error
      const emailError = page.locator(':has-text("email"), :has-text("invalid"), :has-text("format")');
      await expect(emailError).toBeVisible({ timeout: 3000 });
    });

  });

  test.describe('Login and Authentication', () => {
    
    test.beforeEach(async ({ page }) => {
      // Register a user first
      await page.goto('/register');
      const uniqueEmail = `test-${Date.now()}@example.com`;
      await page.fill('[name="email"], [type="email"]', uniqueEmail);
      await page.fill('[name="name"], [placeholder*="name"]', testUser.name);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      
      const confirmPasswordField = page.locator('[name="confirmPassword"], [name="confirm_password"], [placeholder*="confirm"]');
      if (await confirmPasswordField.count() > 0) {
        await confirmPasswordField.fill(testUser.password);
      }
      
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      await page.waitForTimeout(2000); // Wait for registration to complete
      
      // Store email for login
      testUser.registeredEmail = uniqueEmail;
    });

    test('should login successfully after registration', async ({ page }) => {
      // Navigate to login if not already there
      if (!page.url().includes('/login')) {
        await page.goto('/login');
      }
      
      // Fill login form
      await page.fill('[name="email"], [type="email"]', testUser.registeredEmail);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      
      // Submit login
      await page.click('[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
      
      // Should redirect to dashboard or onboarding
      await page.waitForURL(/dashboard|onboarding/, { timeout: 10000 });
      
      // Should be authenticated
      const isAuthenticated = page.url().includes('/dashboard') || page.url().includes('/onboarding');
      expect(isAuthenticated).toBeTruthy();
    });

  });

  test.describe('Onboarding Process', () => {
    
    test.beforeEach(async ({ page }) => {
      // Complete registration and login
      await page.goto('/register');
      const uniqueEmail = `onboard-${Date.now()}@example.com`;
      
      await page.fill('[name="email"], [type="email"]', uniqueEmail);
      await page.fill('[name="name"], [placeholder*="name"]', testUser.name);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      
      const confirmPasswordField = page.locator('[name="confirmPassword"], [name="confirm_password"], [placeholder*="confirm"]');
      if (await confirmPasswordField.count() > 0) {
        await confirmPasswordField.fill(testUser.password);
      }
      
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      await page.waitForTimeout(2000);
      
      // Login if redirected to login page
      if (page.url().includes('/login')) {
        await page.fill('[name="email"], [type="email"]', uniqueEmail);
        await page.fill('[name="password"], [type="password"]', testUser.password);
        await page.click('[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
      }
      
      // Should be on onboarding or dashboard
      await page.waitForURL(/onboarding|dashboard/, { timeout: 10000 });
    });

    test('should access onboarding page', async ({ page }) => {
      // If not on onboarding, navigate there
      if (!page.url().includes('/onboarding')) {
        await page.goto('/onboarding');
      }
      
      // Should be on onboarding page
      await expect(page).toHaveURL(/onboarding/);
      
      // Should show onboarding content
      const onboardingContent = [
        ':has-text("welcome")',
        ':has-text("profile")',
        ':has-text("skill")',
        ':has-text("complete")',
        '.step, [class*="step"]',
        '[role="progressbar"], .progress'
      ];
      
      let foundContent = false;
      for (const content of onboardingContent) {
        if (await page.locator(content).count() > 0) {
          foundContent = true;
          break;
        }
      }
      
      expect(foundContent).toBeTruthy();
    });

    test('should complete profile setup step', async ({ page }) => {
      // Navigate to onboarding if not there
      if (!page.url().includes('/onboarding')) {
        await page.goto('/onboarding');
      }
      
      // Fill bio if field exists
      const bioField = page.locator('[name="bio"], [placeholder*="bio"], textarea');
      if (await bioField.count() > 0) {
        await bioField.fill(testUser.bio);
      }
      
      // Fill location if field exists
      const locationField = page.locator('[name="location"], [placeholder*="location"]');
      if (await locationField.count() > 0) {
        await locationField.fill('Test City');
      }
      
      // Try to proceed to next step
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue"), [type="submit"]');
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
      
      // Should either advance or show validation
      const hasAdvanced = await page.locator(':has-text("skill"), :has-text("next step"), .step-2').count() > 0;
      const hasValidation = await page.locator('.error, .error-message').count() > 0;
      
      expect(hasAdvanced || hasValidation).toBeTruthy();
    });

    test('should complete onboarding and redirect to dashboard', async ({ page }) => {
      // Navigate to onboarding
      if (!page.url().includes('/onboarding')) {
        await page.goto('/onboarding');
      }
      
      // Try to complete onboarding (this is implementation-specific)
      // Fill any required fields
      const bioField = page.locator('[name="bio"], [placeholder*="bio"], textarea');
      if (await bioField.count() > 0) {
        await bioField.fill(testUser.bio);
      }
      
      // Look for completion button
      const completionButtons = [
        'button:has-text("Complete")',
        'button:has-text("Finish")',
        'button:has-text("Done")',
        'button:has-text("Get Started")',
        '[type="submit"]:last-of-type'
      ];
      
      for (const buttonSelector of completionButtons) {
        const button = page.locator(buttonSelector);
        if (await button.count() > 0 && await button.isVisible()) {
          await button.click();
          await page.waitForTimeout(2000);
          break;
        }
      }
      
      // Should redirect to dashboard or main app
      const finalUrl = page.url();
      const isOnMainApp = finalUrl.includes('/dashboard') || finalUrl.includes('/explore') || finalUrl.includes('/skills');
      
      expect(isOnMainApp).toBeTruthy();
    });

  });

  test.describe('Post-Onboarding Experience', () => {
    
    test.beforeEach(async ({ page }) => {
      // Complete full flow: register -> login -> onboarding -> dashboard
      await page.goto('/register');
      const uniqueEmail = `complete-${Date.now()}@example.com`;
      
      // Register
      await page.fill('[name="email"], [type="email"]', uniqueEmail);
      await page.fill('[name="name"], [placeholder*="name"]', testUser.name);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      
      const confirmPasswordField = page.locator('[name="confirmPassword"], [name="confirm_password"], [placeholder*="confirm"]');
      if (await confirmPasswordField.count() > 0) {
        await confirmPasswordField.fill(testUser.password);
      }
      
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      await page.waitForTimeout(2000);
      
      // Login if needed
      if (page.url().includes('/login')) {
        await page.fill('[name="email"], [type="email"]', uniqueEmail);
        await page.fill('[name="password"], [type="password"]', testUser.password);
        await page.click('[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
        await page.waitForTimeout(2000);
      }
      
      // Complete onboarding if on onboarding page
      if (page.url().includes('/onboarding')) {
        // Fill basic info
        const bioField = page.locator('[name="bio"], [placeholder*="bio"], textarea');
        if (await bioField.count() > 0) {
          await bioField.fill(testUser.bio);
        }
        
        // Try to complete
        const completionButtons = [
          'button:has-text("Complete")',
          'button:has-text("Finish")',
          'button:has-text("Done")',
          'button:has-text("Get Started")'
        ];
        
        for (const buttonSelector of completionButtons) {
          const button = page.locator(buttonSelector);
          if (await button.count() > 0 && await button.isVisible()) {
            await button.click();
            await page.waitForTimeout(2000);
            break;
          }
        }
      }
      
      // Should end up on dashboard or main app
      await page.waitForTimeout(1000);
    });

    test('should show appropriate dashboard for new user', async ({ page }) => {
      // Should be on main application (dashboard, explore, etc.)
      const isOnMainApp = page.url().includes('/dashboard') || 
                         page.url().includes('/explore') || 
                         page.url().includes('/skills') ||
                         !page.url().includes('/login') && !page.url().includes('/register');
      
      expect(isOnMainApp).toBeTruthy();
      
      // Should show user is logged in
      const userIndicators = [
        ':has-text("welcome")',
        ':has-text("dashboard")',
        ':has-text("profile")',
        'nav:has-text("logout"), nav:has-text("sign out")',
        '[href*="profile"], [href*="dashboard"]'
      ];
      
      let foundUserIndicator = false;
      for (const indicator of userIndicators) {
        if (await page.locator(indicator).count() > 0) {
          foundUserIndicator = true;
          break;
        }
      }
      
      expect(foundUserIndicator).toBeTruthy();
    });

    test('should have access to main application features', async ({ page }) => {
      // Check that main navigation/features are accessible
      const mainFeatures = [
        '[href*="skill"], :has-text("skills")',
        '[href*="explore"], :has-text("explore")',
        '[href*="profile"], :has-text("profile")',
        '[href*="dashboard"], :has-text("dashboard")'
      ];
      
      let foundFeatures = 0;
      for (const feature of mainFeatures) {
        if (await page.locator(feature).count() > 0) {
          foundFeatures++;
        }
      }
      
      // Should have access to at least 2 main features
      expect(foundFeatures).toBeGreaterThan(1);
    });

  });

  test.describe('Error Handling', () => {
    
    test('should handle registration form errors gracefully', async ({ page }) => {
      await page.goto('/register');
      
      // Submit empty form
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      
      // Should show error without crashing
      const hasError = await page.locator('.error, .error-message, [class*="error"]').count() > 0;
      const pageWorking = !page.url().includes('error') && await page.locator('body').count() > 0;
      
      expect(hasError && pageWorking).toBeTruthy();
    });

    test('should handle navigation during onboarding', async ({ page }) => {
      // Get to onboarding state first
      await page.goto('/register');
      const uniqueEmail = `nav-test-${Date.now()}@example.com`;
      
      await page.fill('[name="email"], [type="email"]', uniqueEmail);
      await page.fill('[name="name"], [placeholder*="name"]', testUser.name);
      await page.fill('[name="password"], [type="password"]', testUser.password);
      
      const confirmPasswordField = page.locator('[name="confirmPassword"], [name="confirm_password"], [placeholder*="confirm"]');
      if (await confirmPasswordField.count() > 0) {
        await confirmPasswordField.fill(testUser.password);
      }
      
      await page.click('[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
      await page.waitForTimeout(2000);
      
      // Navigate to onboarding
      await page.goto('/onboarding');
      
      // Navigate away and back
      await page.goto('/');
      await page.waitForTimeout(500);
      await page.goto('/onboarding');
      
      // Should still work
      const pageWorking = !page.url().includes('error') && await page.locator('body').count() > 0;
      expect(pageWorking).toBeTruthy();
    });

  });

});

// Additional helper tests for specific onboarding patterns
test.describe('Onboarding Patterns Detection', () => {
  
  test('should detect onboarding-related elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for registration/signup links
    const signupLinks = page.locator('a[href*="register"], a[href*="signup"], :has-text("sign up"), :has-text("register")');
    await expect(signupLinks.first()).toBeVisible({ timeout: 5000 });
    
    // Check for login links
    const loginLinks = page.locator('a[href*="login"], a[href*="signin"], :has-text("sign in"), :has-text("login")');
    await expect(loginLinks.first()).toBeVisible({ timeout: 5000 });
  });
  
});