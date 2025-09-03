import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryCard from './SummaryCard';

// Mock the useApp context
jest.mock('../contexts/AppContext', () => ({
  useApp: () => ({
    deleteSummary: jest.fn(),
  }),
}));

describe('SummaryCard Component', () => {
  const mockSummary = {
    id: 'sum_123',
    url: 'https://example.com/paper',
    dateCreated: '2023-09-15T12:34:56Z',
    summaryText: 'This is a test summary',
    metadata: {
      title: 'Test Paper',
      authors: ['Author One', 'Author Two'],
    },
  };

  it('renders the summary card correctly', () => {
    render(<SummaryCard summary={mockSummary} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Paper')).toBeInTheDocument();
    
    // Check if authors are rendered
    expect(screen.getByText('Author One, Author Two')).toBeInTheDocument();
    
    // Check if date is rendered
    const date = new Date(mockSummary.dateCreated).toLocaleDateString();
    expect(screen.getByText(date)).toBeInTheDocument();
    
    // Check if summary text is rendered
    expect(screen.getByText('This is a test summary')).toBeInTheDocument();
  });

  it('handles expand/collapse correctly', () => {
    render(<SummaryCard summary={mockSummary} />);
    
    // Initially, the summary should be collapsed
    const expandButton = screen.getByRole('button', { name: /expand/i });
    expect(expandButton).toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(expandButton);
    
    // Now it should show collapse button
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    expect(collapseButton).toBeInTheDocument();
    
    // Click to collapse again
    fireEvent.click(collapseButton);
    
    // Should be back to expand button
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
  });

  it('handles copy to clipboard', () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    
    render(<SummaryCard summary={mockSummary} />);
    
    // Find and click the copy button
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);
    
    // Check if clipboard API was called with the correct text
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockSummary.summaryText);
  });

  it('handles view paper link correctly', () => {
    render(<SummaryCard summary={mockSummary} />);
    
    // Find the view paper link
    const viewPaperLink = screen.getByRole('link', { name: /view paper/i });
    
    // Check if it has the correct href
    expect(viewPaperLink).toHaveAttribute('href', mockSummary.url);
    
    // Check if it opens in a new tab
    expect(viewPaperLink).toHaveAttribute('target', '_blank');
    expect(viewPaperLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

