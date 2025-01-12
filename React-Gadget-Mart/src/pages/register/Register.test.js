import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUserApi } from "../../Apis/api";
import Register from "./Register";

// Mock the API calls
jest.mock("../../Apis/api", () => ({
  registerUserApi: jest.fn(),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock framer-motion (including motion.button)
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock react-spring
jest.mock("react-spring", () => ({
  useSpring: jest.fn(() => ({})),
  animated: {
    div: "div",
  },
}));

const renderRegister = () => {
  render(
    <Router>
      <Register />
    </Router>
  );
};

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form", () => {
    renderRegister();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  test("handles input changes", () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText("Full Name")).toHaveValue("John Doe");
    expect(screen.getByPlaceholderText("Email Address")).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByPlaceholderText("Phone Number")).toHaveValue(
      "1234567890"
    );
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password123");
    expect(screen.getByPlaceholderText("Confirm Password")).toHaveValue(
      "password123"
    );
  });

  test("toggles password visibility", () => {
    renderRegister();
    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getAllByRole("button")[0]; // Assuming it's the first button

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("handles form submission with mismatched passwords", async () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password456" },
    });
    fireEvent.click(
      screen.getByLabelText(
        /I agree to the Terms of Service and Privacy Policy/i
      )
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
    });
  });

  test("handles successful registration", async () => {
    registerUserApi.mockResolvedValue({
      status: 201,
      data: { message: "User Created!" },
    });

    renderRegister();
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(
      screen.getByLabelText(
        /I agree to the Terms of Service and Privacy Policy/i
      )
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith("User Created!");
    });
  });

  test("renders login link", () => {
    renderRegister();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toHaveAttribute("href", "/login");
  });
});
