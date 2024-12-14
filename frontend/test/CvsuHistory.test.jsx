import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CvsuHistory from '/src/pages/CvsuHistory';
import styles from '/src/styles/CvsuHistory.module.css';
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock('/src/components/Header.jsx', () => () => <div data-testid="mock-header" />);

test('Renders Header component', () => {
    render(
      <Router>
        <CvsuHistory />
      </Router>
    );
  
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  
jest.mock('aos', () => ({
  init: jest.fn(),
}));

test('Checks AOS animations initialization', () => {
  render(
    <Router>
      <CvsuHistory />
    </Router>
  );

  expect(require('aos').init).toHaveBeenCalled();
});


test('Should apply the background image correctly to the designated section', () => {
    const { container } = render(<CvsuHistory />);
  
    const parallaxSection = container.querySelector('[data-testid="parallax-section"]');
  
    expect(parallaxSection).not.toBeNull();
  
    expect(parallaxSection.classList.contains(styles.parallax1)).toBe(true);
  });


test('Should render paragraphs with AOS fade-up animation', async () => {
    const { container } = render(
      <Router>
        <CvsuHistory />
      </Router>
    );
  
    await waitFor(() => {
      const paragraphs = container.querySelectorAll('p[data-aos="fade-up"]');
      expect(paragraphs.length).toBeGreaterThan(0); 
    });
  });

  
test('Renders Cavite State University History page correctly along with the footer', async () => {
  render(
    <Router>
      <CvsuHistory />
    </Router>
  );

  expect(screen.getByText('CAVITE STATE UNIVERSITY')).toBeInTheDocument();

  expect(screen.getByText('HISTORY')).toBeInTheDocument();

  expect(screen.getByText('About CvSU')).toBeInTheDocument();

  expect(screen.getByText(/The Cavite State University \(CvSU\) has its humble beginnings /)).toBeInTheDocument();
  expect(screen.getByText(/On January 22, 1998, by virtue of Republic Act No.8468/)).toBeInTheDocument();
  expect(screen.getByText(/CvSU is mandated “to provide excellent, equitable and relevant educational opportunities/)).toBeInTheDocument();
  expect(screen.getByText(/The University is offering close to 100 curricular programs in the undergraduate and graduate levels/)).toBeInTheDocument();
  expect(screen.getByText(/CvSU adheres to its commitment to Truth, Excellence and Service/)).toBeInTheDocument();

  const footer = screen.getByRole('contentinfo');
  expect(footer).toHaveTextContent(/© Copyright.*Cavite State University.*All Rights Reserved./);
  expect(footer).toHaveTextContent(/Designed by BSCS 3-5 Group 4/);
});

