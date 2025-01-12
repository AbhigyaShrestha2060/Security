import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom"; // Importing BrowserRouter
import { toast } from "react-toastify";
import { loginUserApi } from "../../Apis/api";
import Login from "./Login"; // Component to test

// Mocking the API
jest.mock("../../Apis/api");

describe("Login Component Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should show error message on failed test", async () => {
    // Rendering the component with BrowserRouter
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Mocking the API
    const mockResponse = {
      data: {
        success: false,
        message: "Password is incorrect",
      },
    };
    // Configure mock resolved value
    loginUserApi.mockResolvedValue(mockResponse);

    // Mock toast error function
    toast.error = jest.fn();

    // Testing real UI components

    // 1. Find the email, password and login button
    const email = await screen.getByPlaceholderText("Email Address");
    const password = await screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Log In");

    // 2. Simulate the email, password, and login
    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "test123" } });
    fireEvent.click(loginButton);

    // Wait for the async function
    waitFor(() => {
      // 3. Expect the toast error to be called
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "test123",
      });
      expect(toast.error).toHaveBeenCalledWith("Password is incorrect");
    });
  });
});
