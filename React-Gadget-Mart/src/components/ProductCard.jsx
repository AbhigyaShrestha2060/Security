import React, { useState } from "react";
import {
  EyeOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Radio, Tooltip } from "antd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { addToFavoriteApi } from "../Apis/api";

// ... (keep all the styled components as they were)
const StyledCard = styled(Card)`
  height: 100%;
  .ant-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 200px; // Adjust this value as needed
  object-fit: cover;
`;

const ListViewProductImage = styled(Image)`
  width: 150px;
  height: 150px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PriceTag = styled.p`
  font-weight: bold;
  color: #1890ff;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
  .ant-modal-header {
    border-radius: 8px 8px 0 0;
  }
  .ant-modal-body {
    padding: 24px;
  }
`;

const ProductCard = ({ productInformation, viewMode, addToCart, cartItem }) => {
  const [show, setShow] = useState(false);
  const [buyNowShow, setBuyNowShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleBuyNowClose = () => setBuyNowShow(false);
  const handleBuyNowShow = () => {
    setQuantity(1);
    setAddress("");
    setPaymentMethod("");
    setBuyNowShow(true);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  const addToFavourites = async (product) => {
    try {
      await addToFavoriteApi({ productId: product._id });
      toast.success("Added to favourites successfully");
    } catch (error) {
      toast.error("Error adding to favourites");
    }
  };

  const placeOrder = () => {
    if (!address || !paymentMethod) {
      toast.error("All fields are required");
      return;
    }

    console.log("Order placed", {
      product: productInformation,
      quantity,
      address,
      paymentMethod,
    });
    toast.success("Order Successful");
    handleBuyNowClose();
  };

  const totalPrice = productInformation.productPrice * quantity;

  const cardContent = (
    <>
      <ProductImage
        src={`http://localhost:5000/products/${productInformation.productImage}`}
        alt={productInformation.productName}
        preview={false}
        onClick={handleShow}
      />
      <ProductInfo>
        <h3>{productInformation.productName}</h3>
        <PriceTag>Rs {productInformation.productPrice}</PriceTag>
        <ActionButtons>
          <Tooltip title="Add to Cart">
            <Button
              icon={<ShoppingCartOutlined />}
              onClick={() => handleAddToCart(productInformation)}
            >
              Add to Cart
            </Button>
          </Tooltip>
          <Tooltip title="Add to Favorites">
            <Button
              icon={<HeartOutlined />}
              onClick={() => addToFavourites(productInformation)}
            />
          </Tooltip>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={handleShow} />
          </Tooltip>
        </ActionButtons>
      </ProductInfo>
    </>
  );

  return (
    <>
      {viewMode === "grid" ? (
        <StyledCard hoverable cover={null}>
          {cardContent}
        </StyledCard>
      ) : (
        <Card style={{ width: "100%", marginBottom: "16px" }}>
          <div style={{ display: "flex" }}>
            <ListViewProductImage
              src={`http://localhost:5000/products/${productInformation.productImage}`}
              alt={productInformation.productName}
              preview={false}
              onClick={handleShow}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {cardContent}
            </div>
          </div>
        </Card>
      )}

      <StyledModal
        title={productInformation.productName}
        visible={show}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
          <Button
            key="addToCart"
            type="primary"
            onClick={() => {
              handleAddToCart(productInformation);
              handleClose();
            }}
          >
            Add to Cart
          </Button>,
          <Button
            key="addToFavorites"
            onClick={() => {
              addToFavourites(productInformation);
              handleClose();
            }}
          >
            Add to Favorites
          </Button>,
          <Button key="buyNow" type="primary" danger onClick={handleBuyNowShow}>
            Buy Now
          </Button>,
        ]}
      >
        <Image
          src={`http://localhost:5000/products/${productInformation.productImage}`}
          alt={productInformation.productName}
          style={{ width: "100%", marginBottom: "16px" }}
        />
        <p>{productInformation.productDescription}</p>
        <PriceTag>Rs {productInformation.productPrice}</PriceTag>
      </StyledModal>

      <StyledModal
        title="Buy Now"
        visible={buyNowShow}
        onCancel={handleBuyNowClose}
        footer={[
          <Button key="close" onClick={handleBuyNowClose}>
            Close
          </Button>,
          <Button key="placeOrder" type="primary" onClick={placeOrder}>
            Place Order
          </Button>,
        ]}
      >
        <div style={{ display: "flex", marginBottom: "16px" }}>
          <Image
            src={`http://localhost:5000/products/${productInformation.productImage}`}
            alt={productInformation.productName}
            style={{ width: "100px", height: "100px", marginRight: "16px" }}
          />
          <div>
            <h4>{productInformation.productName}</h4>
            <p>{productInformation.productDescription}</p>
            <PriceTag>Rs {productInformation.productPrice} per unit</PriceTag>
          </div>
        </div>
        <Form layout="vertical">
          <Form.Item label="Quantity">
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </Form.Item>
          <Form.Item label="Total Price">
            <PriceTag>Rs {totalPrice}</PriceTag>
          </Form.Item>
          <Form.Item label="Address" required>
            <Input.TextArea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </Form.Item>
          <Form.Item label="Payment Method" required>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Radio value="Khalti">
                <img
                  src="assets/icons/khalti.png"
                  alt="Khalti"
                  style={{ width: "40px", height: "40px", marginRight: "8px" }}
                />
                Khalti
              </Radio>
              <Radio value="COD">
                <img
                  src="assets/icons/cod.png"
                  alt="Cash on Delivery"
                  style={{ width: "40px", height: "40px", marginRight: "8px" }}
                />
                Cash on Delivery
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </StyledModal>
    </>
  );
};

export default ProductCard;
