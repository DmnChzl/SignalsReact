import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('<App />', () => {
  it('should mount', () => {
    const { unmount } = render(<App />);
    expect(screen.getByText('Signals + React')).toBeInTheDocument();
    unmount();
  });

  it('should triggers click events', async () => {
    render(<App />);
    const btn = screen.getByRole('button');

    fireEvent.click(btn);
    expect(await screen.findByText('count * 2 is 2')).toBeInTheDocument();

    fireEvent.click(btn);
    expect(await screen.findByText('count * 2 is 4')).toBeInTheDocument();
  });
});
