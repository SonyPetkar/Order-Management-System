import { render, screen, fireEvent } from '@testing-library/react';
import MenuPage from '../MenuPage';
import { useMenu } from '../../hooks/useMenu';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../hooks/useMenu');

const mockMenu = [
  { _id: '1', name: 'Clean Salad', moodTags: ['Healthy'], category: 'Veg', price: 10 },
  { _id: '2', name: 'Party Pizza', moodTags: ['Celebrating'], category: 'Fast Food', price: 20 }
];

const renderComponent = () => render(
  <BrowserRouter>
    <MenuPage />
  </BrowserRouter>
);

test('Filters menu items by mood', () => {
  useMenu.mockReturnValue({ menu: mockMenu, loading: false });

  renderComponent();

  expect(screen.getByText('Clean Salad')).toBeInTheDocument();
  expect(screen.getByText('Party Pizza')).toBeInTheDocument();

  const healthyBtn = screen.getByRole('button', { name: /healthy/i });
  fireEvent.click(healthyBtn);

  expect(screen.getByText('Clean Salad')).toBeInTheDocument();
  expect(screen.queryByText('Party Pizza')).not.toBeInTheDocument();
});