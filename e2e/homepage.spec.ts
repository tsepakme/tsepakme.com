import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display main content', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Aiusha Mikhailov/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'My Portfolio' })).toBeVisible();
    
    // Check description paragraph
    await expect(page.getByText('Hi, my name is Aiusha')).toBeVisible();
    
    // Check recent posts section
    await expect(page.getByRole('heading', { name: 'Recent Posts' })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation links exist
    await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'blog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'resume' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'snippets' })).toBeVisible();
    
    // Test navigation to blog with more reliable approach
    const blogLink = page.getByRole('link', { name: 'blog' });
    await blogLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL('/blog', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL('/blog');
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
  });

  test('should display recent posts if available', async ({ page }) => {
    await page.goto('/');
    
    const recentPostsSection = page.locator('text=Recent Posts').locator('..');
    
    // Check if there are posts or "no posts" message
    const hasNoPosts = await page.getByText('No posts found.').isVisible();
    const hasReadAllLink = await page.getByRole('link', { name: 'Read all posts' }).isVisible();
    
    if (!hasNoPosts) {
      // If there are posts, check for "Read all posts" link
      await expect(page.getByRole('link', { name: 'Read all posts' })).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Check that content is still visible and readable on mobile
    await expect(page.getByRole('heading', { name: 'My Portfolio' })).toBeVisible();
    await expect(page.getByText('Hi, my name is Aiusha')).toBeVisible();
    
    // Navigation should be accessible
    await expect(page.getByRole('link', { name: 'blog' })).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const title = await page.locator('title').textContent();
    expect(title).toContain('Aiusha Mikhailov');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', 'This is my portfolio.');
  });
});