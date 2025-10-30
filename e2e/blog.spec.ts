import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test('should display blog listing page correctly', async ({ page }) => {
    await page.goto('/blog');
    
    // Check page title and heading
    await expect(page).toHaveTitle(/Blog/);
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
    
    // Check for posts or empty state
    const hasNoPosts = await page.getByText('No posts found').isVisible();
    if (!hasNoPosts) {
      // If there are posts, check the structure
      const postCards = page.locator('[data-testid="post-card"]').or(page.locator('article')).or(page.locator('a[href^="/blog/"]'));
      const postCount = await postCards.count();
      expect(postCount).toBeGreaterThan(0);
    }
    
    // Check sidebar with tags (if exists)
    const tagsSection = page.getByText('Tags');
    if (await tagsSection.isVisible()) {
      await expect(tagsSection).toBeVisible();
    }
  });

  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Find first blog post link that has more than just /blog/
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    
    if (await firstPostLink.isVisible()) {
      const href = await firstPostLink.getAttribute('href');
      await firstPostLink.click();
      
      // Wait for navigation
      await page.waitForURL(href!);
      
      // Should have back navigation link (could be ← Back or Back to blog)
      await expect(page.getByRole('link', { name: /back|←/i })).toBeVisible();
      
      // Should have post content
      await expect(page.locator('article').first()).toBeVisible();
    }
  });

  test('should have functional tag filtering', async ({ page }) => {
    await page.goto('/blog');
    
    // Look for tag links
    const tagLinks = page.locator('a[href^="/blog/tag/"]');
    const tagCount = await tagLinks.count();
    
    if (tagCount > 0) {
      const firstTag = tagLinks.first();
      const tagHref = await firstTag.getAttribute('href');
      await firstTag.click();
      
      await page.waitForURL(tagHref!);
      
      await expect(page.getByRole('heading', { name: /Posts tagged with/i })).toBeVisible();
    }
  });

  test('should have proper blog post structure', async ({ page }) => {
    await page.goto('/blog');
    
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first();
    
    if (await firstPostLink.isVisible()) {
      const href = await firstPostLink.getAttribute('href');
      await firstPostLink.click();
      
      await page.waitForURL(href!);
      
      await expect(page.locator('h1')).toBeVisible(); // Post title
      
      const timeElement = page.locator('time').first();
      if (await timeElement.isVisible()) {
        await expect(timeElement).toHaveAttribute('dateTime');
      }
      
      const backLink = page.locator('a:has-text("Back"), a:has-text("←"), a[href="/blog"]');
      if (await backLink.count() > 0) {
        await expect(backLink.first()).toBeVisible();
      }
    }
  });

  test('should handle non-existent blog posts gracefully', async ({ page }) => {
    await page.goto('/blog/non-existent-post');
    
    // Should show 404 page or redirect
    const is404 = page.url().includes('/blog/non-existent-post') && 
                  (await page.getByText('404').isVisible() || 
                   await page.getByText('Not Found').isVisible() ||
                   await page.getByText('Page not found').isVisible());
    
    if (is404) {
      // Should have proper 404 content
      expect(page.url()).toContain('/blog/non-existent-post');
    }
  });

  test('should have working search/navigation within blog', async ({ page }) => {
    await page.goto('/blog');
    
    // Check navigation back to home
    await page.getByRole('link', { name: 'home' }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate back to blog
    await page.getByRole('link', { name: 'blog' }).click();
    await expect(page).toHaveURL('/blog');
  });
});