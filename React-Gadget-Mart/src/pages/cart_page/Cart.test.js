import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import * as api from "../../Apis/api";
import Cart from "./Cart";

// Mock the API calls
jest.mock("../../Apis/api");

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock KhaltiCheckout
jest.mock("khalti-checkout-web", () => {
  return jest.fn().mockImplementation(() => ({
    show: jest.fn(),
  }));
});

describe("Cart Component", () => {
  const mockCartItems = [
    {
      _id: "1",
      productId: {
        productName: "Test Product",
        productPrice: 100,
        productImage: "test.jpg",
        productDescription: "Test description",
      },
      quantity: 2,
      total: 200,
    },
  ];

  beforeEach(() => {
    api.getAllCartApi.mockResolvedValue({ data: { carts: mockCartItems } });
  });

  test("renders cart items when loaded", async () => {
    render(<Cart />);
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Rs. 100")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
    });
  });

  test("displays empty cart message when no items", async () => {
    api.getAllCartApi.mockResolvedValue({ data: { carts: [] } });
    render(<Cart />);
    await waitFor(() => {
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });

  test("handles address input", async () => {
    render(<Cart />);
    await waitFor(() => {
      const addressInput = screen.getByPlaceholderText("Enter your address");
      fireEvent.change(addressInput, { target: { value: "Test Address" } });
      expect(addressInput.value).toBe("Test Address");
    });
  });

  test("handles payment method selection", async () => {
    render(<Cart />);
    await waitFor(() => {
      const khaltiRadio = screen.getByLabelText("Khalti");
      fireEvent.click(khaltiRadio);
      expect(khaltiRadio).toBeChecked();
    });
  });
});
