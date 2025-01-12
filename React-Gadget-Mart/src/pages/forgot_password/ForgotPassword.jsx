import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { forgotPasswordApi, resetPasswordApi } from "../../Apis/api";

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (validatePhoneNumber(phoneNumber)) {
      setError("");
      forgotPasswordApi({ phoneNumber })
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            setStep(2);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    } else {
      setError("Please enter a valid phone number.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setOtpError("");
    setPasswordError("");
    const data = {
      otp,
      password: newPassword,
      phoneNumber,
    };
    resetPasswordApi(data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setStep(1);
          setPhoneNumber("");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Forgot Password</h2>
          {step === 1 ? (
            <Form onSubmit={handleSendOTP}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">+977</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter valid phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    isInvalid={!!error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {error}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send OTP
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleResetPassword}>
              <Form.Group className="mb-3">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  isInvalid={!!otpError}
                />
                <Form.Control.Feedback type="invalid">
                  {otpError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!passwordError}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordError}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Reset Password
              </Button>
              <Button
                variant="link"
                className="w-100 mt-2"
                onClick={() => setStep(1)}
              >
                Back to Phone Number
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
