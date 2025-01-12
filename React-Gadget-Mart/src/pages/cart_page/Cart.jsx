import {
  CreditCardOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, message, Radio, Skeleton } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CountUp } from "use-count-up";
import {
  createOrderApi,
  deleteCartApi,
  getAllCartApi,
  updateCartApi,
  updateCartStatusApi,
} from "../../Apis/api";

const CartContainer = styled(motion.div)`
  display: flex;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const CartItemsSection = styled.div`
  flex: 1;
  margin-right: 2rem;

  @media (max-width: 1200px) {
    margin-right: 0;
    margin-bottom: 2rem;
  }
`;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  margin-left: 1.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ItemPrice = styled.p`
  font-weight: bold;
  color: #e74c3c;
  font-size: 1.1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const BillSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  width: 400px;
  position: sticky;
  top: 2rem;
  height: fit-content;

  @media (max-width: 1200px) {
    width: 100%;
  }
`;

const BillItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const TotalAmount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f1faee;
  display: flex;
  justify-content: space-between;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const Cart = () => {
  const [address, setAddress] = useState("KTM");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(50);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [change, setChange] = useState(false);

  const handleQuantityChange = (value, cart) => {
    if (value < 1) return;

    const updatedCartItems = cartItems.map((item) =>
      item._id === cart._id
        ? {
            ...item,
            quantity: value,
            total: item.productId.productPrice * value,
          }
        : item
    );
    setCartItems(updatedCartItems);

    const data = {
      quantity: value,
      total: cart.productId.productPrice * value,
    };

    updateCartApi(cart._id, data)
      .then(() => {
        message.success("Cart updated successfully");
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
      });
  };

  const handleDeleteCartItem = (cartId) => {
    deleteCartApi(cartId)
      .then(() => {
        setCartItems(cartItems.filter((item) => item._id !== cartId));
        message.success("Item deleted successfully");
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
      });
  };

  useEffect(() => {
    getAllCartApi()
      .then((res) => {
        setCartItems(res.data.carts);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [change]);

  useEffect(() => {
    const total = cartItems.reduce((acc, cart) => acc + cart.total, 0);
    setSubTotal(total);
    setTotal(total + deliveryCharge);
  }, [cartItems, deliveryCharge, change]);

  const khaltiConfig = {
    publicKey: "test_public_key_0800545e039d45368cab4d1b2fb93d01",
    productIdentity: "1234567890",
    productName: "Cart Items",
    productUrl: "http://localhost:3000/cart",
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
    eventHandler: {
      onSuccess(payload) {
        console.log(payload);
        handlePayment();
        message.success("Payment successful");
      },
      onError(error) {
        console.log(error);
        message.error("Payment failed");
      },
      onClose() {
        console.log("widget is closing");
      },
    },
  };

  const handleKhaltiPayment = () => {
    if (!address.trim()) {
      message.error("Please enter your address");
      return;
    }
    const checkout = new KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: total });
    checkout.show({ amount: total * 100 });
  };

  const handlePayment = () => {
    const data = {
      address,
      carts: cartItems,
      totalAmount: total,
      paymentType: paymentMethod,
    };
    createOrderApi(data)
      .then(() => {
        updateCartStatusApi({ status: "ordered" }).then(() => {
          setChange(!change);
        });
        message.success("Order placed successfully");
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
      });
  };

  const handleBuyNow = () => {
    if (!address.trim()) {
      message.error("Please enter your address");
      return;
    }
    if (!paymentMethod) {
      message.error("Please select a payment method");
      return;
    }
    if (paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else {
      message.info("Cash on Delivery selected");
      handlePayment();
    }
  };

  if (loading) {
    return (
      <CartContainer>
        <CartItemsSection>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 3 }} />
          ))}
        </CartItemsSection>
        <BillSection>
          <Skeleton active paragraph={{ rows: 6 }} />
        </BillSection>
      </CartContainer>
    );
  }

  return (
    <CartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {cartItems.length > 0 ? (
        <>
          <CartItemsSection>
            <h2>
              <ShoppingCartOutlined /> Your Shopping Cart
            </h2>
            <AnimatePresence>
              {cartItems.map((cart, index) => (
                <CartItem
                  key={cart._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Image
                    width={150}
                    src={`http://localhost:5000/products/${cart.productId.productImage}`}
                    alt={cart.productName}
                    preview={{
                      src: `http://localhost:5000/products/${cart.productId.productImage}`,
                    }}
                  />
                  <ItemDetails>
                    <ItemName>{cart.productId.productName}</ItemName>
                    <ItemPrice>Rs. {cart.productId.productPrice}</ItemPrice>
                    <p>{cart.productId.productDescription}</p>
                    <QuantityControl>
                      <Button
                        icon={<MinusOutlined />}
                        onClick={() =>
                          handleQuantityChange(cart.quantity - 1, cart)
                        }
                      />
                      <Input
                        style={{
                          width: 50,
                          margin: "0 8px",
                          textAlign: "center",
                        }}
                        value={cart.quantity}
                        onChange={(e) =>
                          handleQuantityChange(Number(e.target.value), cart)
                        }
                        min={1}
                      />
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() =>
                          handleQuantityChange(cart.quantity + 1, cart)
                        }
                      />
                    </QuantityControl>
                    <p>
                      Total: Rs.{" "}
                      <CountUp isCounting end={cart.total} duration={1} />
                    </p>
                  </ItemDetails>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteCartItem(cart._id)}
                  >
                    Delete
                  </Button>
                </CartItem>
              ))}
            </AnimatePresence>
          </CartItemsSection>

          <BillSection>
            <h3>Order Summary</h3>
            <BillItem>
              <span>Subtotal:</span>
              <span>
                Rs. <CountUp isCounting end={subTotal} duration={1} />
              </span>
            </BillItem>

            <BillItem>
              <span>Delivery Charge:</span>
              <span>Rs. {deliveryCharge}</span>
            </BillItem>
            <TotalAmount>
              <span>Total:</span>
              <span>
                Rs. <CountUp isCounting end={total} duration={1} />
              </span>
            </TotalAmount>

            <Input
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ marginTop: "1rem" }}
            />

            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
              style={{ marginTop: "1rem" }}
            >
              <Radio value="Khalti">
                <img
                  src="assets/icons/khalti.png"
                  alt="Khalti"
                  style={{ width: 20, marginRight: 8 }}
                />
                Khalti
              </Radio>
              <Radio value="Cash On Delivery">
                <img
                  src="assets/icons/cod.png"
                  alt="Cash on Delivery"
                  style={{ width: 20, marginRight: 8 }}
                />
                Cash on Delivery
              </Radio>
            </Radio.Group>

            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              size="large"
              onClick={handleBuyNow}
              style={{ marginTop: "1rem", width: "100%" }}
            >
              Place Order
            </Button>
          </BillSection>
        </>
      ) : (
        <EmptyCartMessage>
          <ShoppingCartOutlined
            style={{ fontSize: 50, marginBottom: "1rem" }}
          />
          <p>Your cart is empty. Start shopping now!</p>
        </EmptyCartMessage>
      )}
    </CartContainer>
  );
};

export default Cart;
