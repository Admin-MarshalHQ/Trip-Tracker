import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.setItem("trip-splash-dismissed", "1");
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Trip savings tracker')).toBeInTheDocument();
  });

  it('shows the savings tab by default', () => {
    render(<App />);
    expect(screen.getByText('Projected balance')).toBeInTheDocument();
  });

  it('displays the progress ring', () => {
    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows tab switcher with all tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: /savings/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /pre-trip/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /in-trip/i })).toBeInTheDocument();
  });

  it('displays the departure info', () => {
    render(<App />);
    expect(screen.getByText(/departure.*june 8, 2026/i)).toBeInTheDocument();
  });
});
