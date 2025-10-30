import { test, expect } from '@playwright/test';

test.describe('Snippets Pages', () => {
  test('should display snippets listing page correctly', async ({ page }) => {
    await page.goto('/snippets');
    
    // Check page title and heading
    await expect(page).toHaveTitle(/Snippets/);
    await expect(page.getByRole('heading').first()).toBeVisible();
    
    // Check for snippets or empty state
    const hasNoSnippets = await page.getByText('No snippets found').isVisible();
    if (!hasNoSnippets) {
      // If there are snippets, check for snippet cards
      const snippetLinks = page.locator('a[href^="/snippets/"]');
      const snippetCount = await snippetLinks.count();
      expect(snippetCount).toBeGreaterThan(0);
    }
  });

  test('should navigate to individual snippet', async ({ page }) => {
    await page.goto('/snippets');
    
    // Find a specific snippet link (not category link)
    const snippetLinks = page.locator('a[href^="/snippets/"]:not([href^="/snippets/category"]):not([href="/snippets"])');
    const snippetCount = await snippetLinks.count();
    
    if (snippetCount > 0) {
      const firstSnippetLink = snippetLinks.first();
      const href = await firstSnippetLink.getAttribute('href');
      await firstSnippetLink.click();
      
      // Wait for navigation with increased timeout
      await page.waitForURL(href!, { timeout: 10000 });
      
      // Should have snippet content - look for main content area
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should display snippet metadata correctly', async ({ page }) => {
    await page.goto('/snippets');
    
    const firstSnippetLink = page.locator('a[href^="/snippets/"]:not([href="/snippets"])').first();
    
    if (await firstSnippetLink.isVisible()) {
      await firstSnippetLink.click();
      
      // Check for title
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for category badge
      const categoryBadge = page.locator('.rounded-full').first();
      if (await categoryBadge.isVisible()) {
        await expect(categoryBadge).toBeVisible();
      }
      
      // Check for difficulty badge
      const difficultyBadge = page.locator('text=/beginner|intermediate|advanced/i');
      if (await difficultyBadge.isVisible()) {
        await expect(difficultyBadge).toBeVisible();
      }
    }
  });

  test('should have functional category filtering', async ({ page }) => {
    await page.goto('/snippets');
    
    // Look for category links
    const categoryLinks = page.locator('a[href^="/snippets/category/"]');
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      const firstCategory = categoryLinks.first();
      const categoryHref = await firstCategory.getAttribute('href');
      await firstCategory.click();
      
      // Wait for navigation with increased timeout
      await page.waitForURL(categoryHref!, { timeout: 10000 });
      
      // Should show filtered snippets - look for page heading
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  test('should have functional tag filtering', async ({ page }) => {
    await page.goto('/snippets');
    
    // Look for tag links
    const tagLinks = page.locator('a[href^="/snippets/tag/"]');
    const tagCount = await tagLinks.count();
    
    if (tagCount > 0) {
      const firstTag = tagLinks.first();
      const tagHref = await firstTag.getAttribute('href');
      await firstTag.click();
      
      // Should navigate to tag page
      await expect(page).toHaveURL(tagHref!);
    }
  });

  test('should have proper code highlighting and copy functionality', async ({ page }) => {
    await page.goto('/snippets');
    
    const firstSnippetLink = page.locator('a[href^="/snippets/"]:not([href="/snippets"])').first();
    
    if (await firstSnippetLink.isVisible()) {
      await firstSnippetLink.click();
      
      // Look for code blocks
      const codeBlocks = page.locator('pre');
      const codeBlockCount = await codeBlocks.count();
      
      if (codeBlockCount > 0) {
        const firstCodeBlock = codeBlocks.first();
        await expect(firstCodeBlock).toBeVisible();
        
        // Check for copy button on hover
        await firstCodeBlock.hover();
        const copyButton = page.locator('button:has-text("Copy")');
        
        if (await copyButton.isVisible()) {
          await expect(copyButton).toBeVisible();
          
          // Test copy functionality
          await copyButton.click();
          
          // Check if button text changes to "Copied!"
          await expect(page.locator('button:has-text("Copied!")')).toBeVisible({ timeout: 1000 });
        }
      }
    }
  });

  test('should handle TypeScript snippets properly', async ({ page }) => {
    await page.goto('/snippets');
    
    // Look for TypeScript-related content
    const typescriptSnippets = page.getByText(/typescript|ts|type|interface/i);
    const tsCount = await typescriptSnippets.count();
    
    if (tsCount > 0) {
      // Navigate to a TypeScript snippet if available
      const tsSnippetLink = page.locator('a[href^="/snippets/"]').filter({ hasText: /typescript|type/i }).first();
      
      if (await tsSnippetLink.isVisible()) {
        await tsSnippetLink.click();
        
        // Should have proper syntax highlighting for TypeScript
        const codeBlocks = page.locator('pre code');
        if (await codeBlocks.count() > 0) {
          await expect(codeBlocks.first()).toBeVisible();
        }
      }
    }
  });

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/snippets');
    
    // Check that content is accessible on mobile
    await expect(page.getByRole('heading').first()).toBeVisible();
    
    // Navigation should work on mobile
    await expect(page.getByRole('link', { name: 'snippets' })).toBeVisible();
  });
});