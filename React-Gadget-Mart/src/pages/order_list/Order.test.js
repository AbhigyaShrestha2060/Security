import { render, waitFor } from "@testing-library/react";
import { message } from "antd";
import React from "react";
import { act } from "react-dom/test-utils";
import { getUserOrdersApi } from "../../Apis/api";
import OrderList from "./OrderList";

// Mock the API and Antd message
jest.mock("../../Apis/api");
jest.mock("antd", () => ({
  message: {
    error: jest.fn(),
  },
  Skeleton: () => <div data-testid="skeleton" />,
}));

const mockOrders = [
  {
    _id: "1",
    status: "dispatched",
    total: 100,
    address: "123 Test St",
    paymentType: "Credit Card",
    createdAt: "2023-08-18T12:00:00Z",
    carts: [
      {
        _id: "cart1",
        productId: {
          productName: "Test Product",
        },
        quantity: 2,
        total: 50,
        status: "shipped",
      },
    ],
  },
  {
    _id: "2",
    status: "pending",
    total: 200,
    address: "456 Mock Ave",
    paymentType: "PayPal",
    createdAt: "2023-08-17T12:00:00Z",
    carts: [
      {
        _id: "cart2",
        productId: {
          productName: "Another Product",
        },
        quantity: 1,
        total: 200,
        status: "processing",
      },
    ],
  },
];

test("displays error message when API call fails", async () => {
  getUserOrdersApi.mockRejectedValueOnce(new Error("API Error"));

  await act(async () => {
    render(<OrderList />);
  });

  await waitFor(() => {
    expect(message.error).toHaveBeenCalledWith("Failed to fetch orders");
  });
});
