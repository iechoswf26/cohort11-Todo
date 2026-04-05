import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect } from 'vitest';
//import userEvent from "@testing-library/user-event";
import App from '../App.tsx';

describe('App.tsx', () => {
  it('should display heading', () => {
    // Arrange
    render(<App />);
    // Assert
    expect(
      screen.getByRole('heading', { name: /started/i }),
    ).toBeInTheDocument();
    screen.logTestingPlaygroundURL();
  });

  it('should count button increment counter', async () => {
    // Arrange
    render(<App />);
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /count/i });

    expect(screen.getByRole('button', { name: /0/i })).toBeVisible();

    await user.click(button);

    expect(screen.getByRole('button', { name: /1/i })).toBeInTheDocument();
  });
});
