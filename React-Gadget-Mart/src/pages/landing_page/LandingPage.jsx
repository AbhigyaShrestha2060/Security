import { LockOutlined, SyncOutlined, TruckOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Layout,
  Modal,
  Row,
  Statistic,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium sound quality with noise cancellation',
      image: '/assets/images/headphone.png',
    },
    {
      id: 2,
      name: 'Mac Book',
      description: 'High-precision optical sensor for pro gamers',
      image: '/assets/images/macbook.png',
    },
    {
      id: 3,
      name: 'Ultrabook Laptop',
      description: 'Powerful performance in a slim design',
      image: '/assets/images/laptop.png',
    },
    {
      id: 4,
      name: 'Condenser Microphone',
      description: 'Studio-quality audio recording',
      image: '/assets/images/mic.png',
    },
  ];

  return (
    <Layout className='min-h-screen'>
      <Content>
        {/* Hero Section */}
        <section className='bg-gray-50 py-20'>
          <div className='max-w-7xl mx-auto px-4'>
            <Row
              gutter={[48, 48]}
              align='middle'>
              <Col
                xs={24}
                md={12}>
                <Title>
                  Discover Amazing{' '}
                  <span className='text-blue-600'>Gadgets</span>
                </Title>
                <Paragraph className='text-lg mb-8'>
                  Explore our curated collection of cutting-edge technology
                </Paragraph>
                <div className='space-x-4'>
                  <Button
                    type='primary'
                    size='large'>
                    Shop Now
                  </Button>
                </div>
              </Col>
              <Col
                xs={24}
                md={12}>
                <img
                  src='/assets/images/iphone.png'
                  alt='Hero'
                  className='rounded-lg shadow-lg w-75'
                />
              </Col>
            </Row>

            {/* Stats */}
            <Row
              gutter={[32, 32]}
              className='mt-16'>
              <Col
                xs={24}
                md={8}>
                <Card>
                  <Statistic
                    title='Products'
                    value='299K+'
                  />
                </Card>
              </Col>
              <Col
                xs={24}
                md={8}>
                <Card>
                  <Statistic
                    title='Sellers'
                    value='99K+'
                  />
                </Card>
              </Col>
              <Col
                xs={24}
                md={8}>
                <Card>
                  <Statistic
                    title='Reviews'
                    value='2K+'
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* Products Section */}
        <section className='py-20'>
          <div className='max-w-7xl mx-auto px-4'>
            <Title className='text-center'>Featured Products</Title>
            <Row
              gutter={[32, 32]}
              className='mt-12'>
              {products.map((product) => (
                <Col
                  xs={24}
                  sm={12}
                  lg={6}
                  key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        className='h-64 w-full object-contain'
                      />
                    }
                    className='h-full'>
                    <Card.Meta
                      title={product.name}
                      description={product.description}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className='bg-gray-50 py-20'>
          <div className='max-w-7xl mx-auto px-4'>
            <Title className='text-center'>Why Choose Us</Title>
            <Row
              gutter={[32, 32]}
              className='mt-12'>
              <Col
                xs={24}
                md={8}>
                <Card className='text-center'>
                  <TruckOutlined className='text-4xl text-blue-600 mb-4' />
                  <Title level={4}>Free Shipping</Title>
                  <Paragraph>Free shipping on orders over $50</Paragraph>
                </Card>
              </Col>
              <Col
                xs={24}
                md={8}>
                <Card className='text-center'>
                  <LockOutlined className='text-4xl text-blue-600 mb-4' />
                  <Title level={4}>Secure Payments</Title>
                  <Paragraph>Your transactions are always safe</Paragraph>
                </Card>
              </Col>
              <Col
                xs={24}
                md={8}>
                <Card className='text-center'>
                  <SyncOutlined className='text-4xl text-blue-600 mb-4' />
                  <Title level={4}>Easy Returns</Title>
                  <Paragraph>30-day money-back guarantee</Paragraph>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className='bg-blue-600 text-white py-20'>
          <div className='max-w-7xl mx-auto px-4 text-center'>
            <Title className='text-white'>Ready to Upgrade Your Tech?</Title>
            <Paragraph className='text-lg mb-8'>
              Join thousands of satisfied customers today
            </Paragraph>
            <Button
              size='large'
              ghost>
              Shop Now
            </Button>
          </div>
        </section>

        {/* Video Modal */}
        <Modal
          open={isVideoModalOpen}
          onCancel={() => setIsVideoModalOpen(false)}
          footer={null}
          width={800}
          centered>
          <div className='aspect-w-16 aspect-h-9'>
            <iframe
              className='w-full h-full'
              src='https://www.youtube.com/embed/dQw4w9WgXcQ'
              title='Product Video'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default LandingPage;
