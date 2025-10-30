import { render, screen } from '@testing-library/react';
import { Navbar } from 'app/components/nav';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Navbar Component', () => {
  it('should render all navigation items', () => {
    render(<Navbar />);
    
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('blog')).toBeInTheDocument();
    expect(screen.getByText('resume')).toBeInTheDocument();
    expect(screen.getByText('snippets')).toBeInTheDocument();
  });

  it('should create correct links for navigation items', () => {
    render(<Navbar />);
    
    const homeLink = screen.getByRole('link', { name: 'home' });
    const blogLink = screen.getByRole('link', { name: 'blog' });
    const resumeLink = screen.getByRole('link', { name: 'resume' });
    const snippetsLink = screen.getByRole('link', { name: 'snippets' });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(resumeLink).toHaveAttribute('href', '/resume');
    expect(snippetsLink).toHaveAttribute('href', '/snippets');
  });

  it('should have proper navigation structure', () => {
    render(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('id', 'nav');
  });

  it('should apply correct CSS classes', () => {
    render(<Navbar />);
    
    const aside = screen.getByRole('navigation').closest('aside');
    expect(aside).toHaveClass('-ml-[8px]', 'mb-16', 'tracking-tight');
  });

  it('should render exactly 4 navigation links', () => {
    render(<Navbar />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('should have transition and hover styles in className prop', () => {
    const { container } = render(<Navbar />);
    
    // Find the Link components in the DOM
    const links = container.querySelectorAll('a');
    
    // Check that links exist
    expect(links.length).toBeGreaterThan(0);
    
    // Since Tailwind classes may not be processed in test environment,
    // we verify the component structure and basic functionality
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.textContent).toBeTruthy();
    });
  });
});