import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Favourites from './Favourites';
import { getFavoriteByUserApi, deleteFromFavoriteApi } from '../../Apis/api';
import { message } from 'antd';

// Mock the API calls
jest.mock('../../Apis/api', () => ({
  getFavoriteByUserApi: jest.fn(),
  deleteFromFavoriteApi: jest.fn(),
}));

// Mock Ant Design message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Favourites Component', () => {
  const mockFavorites = [
    {
      _id: '1',
      productId: {
        _id: 'product1',
        productName: 'Test Product',
        productPrice: 100,
        productImage: 'test.jpg',
        productDescription: 'Test description',
      },
    },
  ];

  beforeEach(() => {
    getFavoriteByUserApi.mockResolvedValue({ data: { favorites: mockFavorites } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading skeleton initially', async () => {
    render(<Favourites />);
    expect(screen.getByText(/Your Favourites/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  test('renders favourite items when loaded', async () => {
    render(<Favourites />);
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Rs. 100')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  test('handles delete favourite item', async () => {
    deleteFromFavoriteApi.mockResolvedValue({});
    render(<Favourites />);
    
    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: /Remove/i });
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(deleteFromFavoriteApi).toHaveBeenCalledWith('product1');
      expect(message.success).toHaveBeenCalledWith('Item removed from favourites');
    });
  });

  test('displays error message when delete fails', async () => {
    deleteFromFavoriteApi.mockRejectedValue({ response: { data: { message: 'Delete failed' } } });
    render(<Favourites />);
    
    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: /Remove/i });
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Delete failed');
    });
  });

  test('displays empty favourites message when no items', async () => {
    getFavoriteByUserApi.mockResolvedValue({ data: { favorites: [] } });
    render(<Favourites />);

    await waitFor(() => {
      expect(screen.getByText(/Your favourites list is empty/i)).toBeInTheDocument();
    });
  });

  test('handles error when fetching favourites', async () => {
    getFavoriteByUserApi.mockRejectedValue({ response: { data: { message: 'Fetch failed' } } });
    render(<Favourites />);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Fetch failed');
    });
  });
});