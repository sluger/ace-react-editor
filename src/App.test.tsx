import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { shallow } from 'enzyme';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/ace editor/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders without crashing', () => {
  shallow(<App />);
});