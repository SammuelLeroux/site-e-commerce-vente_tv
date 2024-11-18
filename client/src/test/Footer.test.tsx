import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Footer from '../components/Footer/Footer';

describe('Footer component', () => {
  it('renders with correct text', () => {
    render(<Footer />);
    const footerElement = screen.getByText((content, element) => {
      // Custom matching logic
      return content.includes(`© 2024 e-Commerce by STG_20`);
    });
    expect(footerElement).toBeInTheDocument();
  });
});