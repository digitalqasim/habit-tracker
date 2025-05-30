import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HabitCard from './HabitCard';

describe('HabitCard', () => {
  it('renders habit card correctly', () => {
    const habitData = {
      id: '1',
      name: 'Test Habit',           // Changed from title to name
      description: 'Test Description',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
    };

    render(<HabitCard habit={habitData} />);
    
    expect(screen.getByText('Test Habit')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});