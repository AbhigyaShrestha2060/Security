import { Skeleton, message } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getUserOrdersApi } from "../../Apis/api";

const PageContainer = styled.div`
  background-color: #f0f2f5;
  min-height: 100vh;
  padding: 2rem;
`;

const OrderListContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.h2`
  color: #1a237e;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const OrderCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OrderId = styled.h3`
  color: #1a237e;
  font-size: 1.2rem;
  margin: 0;
`;

const Status = styled.span`
  background-color: ${(props) => {
    switch (props.status) {
      case "dispatched":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "cancelled":
        return "#f44336";
      default:
        return "#2196f3";
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  margin: 0;
  color: #424242;
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Item = styled.li`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrdersApi()
      .then((res) => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch orders");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <OrderListContainer>
          <Header>Your Orders</Header>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 4 }} />
          ))}
        </OrderListContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <OrderListContainer>
        <Header>Your Orders</Header>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderHeader>
              <OrderId>Order ID: {order._id}</OrderId>
              <Status status={order.status}>{order.status}</Status>
            </OrderHeader>
            <OrderInfo>
              <InfoItem>
                <strong>Total:</strong> Rs. {order.total}
              </InfoItem>
              <InfoItem>
                <strong>Address:</strong> {order.address}
              </InfoItem>
              <InfoItem>
                <strong>Payment:</strong> {order.paymentType}
              </InfoItem>
              <InfoItem>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </InfoItem>
            </OrderInfo>
            <h4>Items:</h4>
            <ItemsList>
              {order.carts.map((item) => (
                <Item key={item._id}>
                  <p>
                    <strong>Product:</strong> {item.productId.productName}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs. {item.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>
                </Item>
              ))}
            </ItemsList>
          </OrderCard>
        ))}
      </OrderListContainer>
    </PageContainer>
  );
};

export default OrderList;
