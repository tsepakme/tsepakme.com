import { render, screen } from '@testing-library/react';
import { BlogPosts } from 'app/components/posts';
import { BlogPost } from 'scripts/utils';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('BlogPosts Component', () => {
  const mockPosts: BlogPost[] = [
    {
      slug: 'post-1',
      metadata: {
        title: 'First Post',
        description: 'This is the first post',
        date: '2023-10-29',
        tags: ['react', 'typescript'],
        published: true
      }
    },
    {
      slug: 'post-2', 
      metadata: {
        title: 'Second Post',
        description: 'This is the second post',
        date: '2023-10-28',
        tags: ['nextjs'],
        published: true
      }
    }
  ];

  it('should render all posts', () => {
    render(<BlogPosts posts={mockPosts} />);
    
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('should render post descriptions', () => {
    render(<BlogPosts posts={mockPosts} />);
    
    expect(screen.getByText('This is the first post')).toBeInTheDocument();
    expect(screen.getByText('This is the second post')).toBeInTheDocument();
  });

  it('should create correct links for posts', () => {
    render(<BlogPosts posts={mockPosts} />);
    
    const firstPostLink = screen.getByRole('link', { name: 'First Post' });
    const secondPostLink = screen.getByRole('link', { name: 'Second Post' });
    
    expect(firstPostLink).toHaveAttribute('href', '/blog/post-1');
    expect(secondPostLink).toHaveAttribute('href', '/blog/post-2');
  });

  it('should display formatted dates', () => {
    render(<BlogPosts posts={mockPosts} />);
    
    // Note: formatDate function formats as "29 October 2023" etc
    expect(screen.getByText(/29 October 2023/)).toBeInTheDocument();
    expect(screen.getByText(/28 October 2023/)).toBeInTheDocument();
  });

  it('should sort posts by date descending', () => {
    const unsortedPosts: BlogPost[] = [
      {
        slug: 'old-post',
        metadata: {
          title: 'Old Post',
          description: 'Older post',
          date: '2023-10-01',
          published: true
        }
      },
      {
        slug: 'new-post',
        metadata: {
          title: 'New Post', 
          description: 'Newer post',
          date: '2023-10-29',
          published: true
        }
      }
    ];

    render(<BlogPosts posts={unsortedPosts} />);
    
    const postTitles = screen.getAllByRole('link');
    expect(postTitles[0]).toHaveTextContent('New Post');
    expect(postTitles[1]).toHaveTextContent('Old Post');
  });

  it('should handle empty posts array', () => {
    const { container } = render(<BlogPosts posts={[]} />);
    
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'gap-4');
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('should filter out posts without slugs', () => {
    const postsWithInvalid: any[] = [
      {
        slug: 'valid-post',
        metadata: {
          title: 'Valid Post',
          description: 'This has a slug',
          date: '2023-10-29',
          published: true
        }
      },
      {
        slug: null,
        metadata: {
          title: 'Invalid Post',
          description: 'This has no slug',
          date: '2023-10-28',
          published: true
        }
      }
    ];

    render(<BlogPosts posts={postsWithInvalid} />);
    
    expect(screen.getByText('Valid Post')).toBeInTheDocument();
    expect(screen.queryByText('Invalid Post')).not.toBeInTheDocument();
  });

  it('should handle posts with missing metadata gracefully', () => {
    const postsWithMissingData: any[] = [
      {
        slug: 'minimal-post',
        metadata: {
          title: undefined,
          description: undefined,
          date: '2023-10-29'
        }
      }
    ];

    render(<BlogPosts posts={postsWithMissingData} />);
    
    expect(screen.getByText('Untitled Post')).toBeInTheDocument();
  });

  it('should add proper spacing between posts', () => {
    render(<BlogPosts posts={mockPosts} />);
    
    const container = screen.getByTestId('blog-posts-container') || 
                     screen.getAllByRole('generic')[0];
    expect(container).toHaveClass('flex', 'flex-col', 'gap-4');
  });

  it('should render proper time elements with datetime attributes', () => {
    render(<BlogPosts posts={mockPosts} />);
    
    const timeElements = screen.getAllByText(/October 2023/, { selector: 'time' });
    expect(timeElements[0]).toHaveAttribute('dateTime', '2023-10-29');
    expect(timeElements[1]).toHaveAttribute('dateTime', '2023-10-28');
  });
});