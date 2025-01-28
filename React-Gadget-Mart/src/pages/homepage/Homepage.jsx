import {
  AppstoreOutlined,
  BarsOutlined,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Carousel,
  Empty,
  Image,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  addToCartApi,
  addToFavoriteApi,
  deleteFromFavoriteApi,
  getAllCartApi,
  getFavoriteByUserApi,
  getProductCountApi,
  paginationApi,
} from '../../Apis/api';

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#4f9cff',
  accent: '#60a5fa',
  background: '#0f172a',
  text: '#f1f5f9',
  white: '#1e293b',
  grey: '#334155',
};

const StyledHomepage = styled.div`
  min-height: 100vh;
  background: ${COLORS.background};
  padding: 2rem 0;

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .carousel-container {
    margin-bottom: 3rem;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  .search-container {
    max-width: 800px;
    margin: 2rem auto 3rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 4px;
      background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.secondary});
      border-radius: 2px;
    }

    .ant-input-search {
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid ${COLORS.secondary};

      .ant-input {
        font-size: 1.1rem;
        padding: 12px 24px;
        background: ${COLORS.white};
        color: ${COLORS.text};
      }

      .ant-btn {
        height: 54px;
        width: 60px;
        background: ${COLORS.secondary};
        &:hover {
          background: ${COLORS.accent};
        }
      }
    }
  }

  .section-title {
    color: ${COLORS.text};
    font-size: 2.2rem;
    margin-bottom: 2rem;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40%;
      height: 4px;
      background: ${COLORS.secondary};
      border-radius: 2px;
    }
  }

  .controls-container {
    background: ${COLORS.white};
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .view-controls {
      .ant-radio-button-wrapper {
        padding: 8px 16px;
        border-color: ${COLORS.secondary};
        color: ${COLORS.text};
        background: ${COLORS.white};

        &-checked {
          background: ${COLORS.secondary};
          color: ${COLORS.background};
        }
      }
    }

    .sort-control {
      min-width: 200px;
      .ant-select-selector {
        border-color: ${COLORS.secondary};
        border-radius: 8px;
        background: ${COLORS.white};
        color: ${COLORS.text};
      }
    }

    .cart-icon {
      font-size: 28px;
      color: ${COLORS.text};
      transition: all 0.3s ease;

      &:hover {
        color: ${COLORS.secondary};
        transform: scale(1.1);
      }
    }
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProductList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const CarouselItem = styled.div`
  position: relative;
  height: 400px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carousel-content {
    position: absolute;
    bottom: 40px;
    left: 40px;
    z-index: 1;
    color: ${COLORS.text};

    h2 {
      color: ${COLORS.text};
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }
`;

const GridViewItem = styled(Card)`
  background: ${COLORS.white};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .ant-card-cover {
    height: 280px;
    overflow: hidden;
    background: ${COLORS.background};

    img {
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .ant-card-body {
    padding: 1.5rem;
    background: ${COLORS.white};
  }

  .ant-card-meta-title {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    color: ${COLORS.text};
  }

  .ant-card-meta-description {
    color: ${COLORS.text};
  }

  .price {
    font-size: 1.3rem;
    font-weight: 600;
    color: ${COLORS.secondary};
    margin: 1rem 0;
    display: block;
  }

  .ant-card-actions {
    background: ${COLORS.background};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    li {
      margin: 12px 0;
    }
  }
`;

const ListViewItem = styled.div`
  background: ${COLORS.white};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .list-image-container {
    width: 240px;
    height: 240px;
    overflow: hidden;
    background: ${COLORS.background};

    img {
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .list-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: ${COLORS.text};

    h3 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
      color: ${COLORS.text};
    }

    .price {
      font-size: 1.3rem;
      font-weight: 600;
      color: ${COLORS.secondary};
    }
  }

  .list-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    button {
      min-width: 120px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: ${COLORS.background};
      border-color: ${COLORS.secondary};
      color: ${COLORS.text};

      &:hover {
        background: ${COLORS.secondary};
        color: ${COLORS.background};
      }
    }
  }
`;

const Homepage = () => {
  const [gadgets, setGadgets] = useState([]);
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name_asc');
  const [cart, setCart] = useState([]);
  const [selectedGadget, setSelectedGadget] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoriteChange, setFavoriteChange] = useState(false);

  const pageSize = 8;

  useEffect(() => {
    getProductCountApi()
      .then((res) => {
        setTotalItems(res.data.count);
      })
      .catch((err) => {
        console.error('Error fetching product count:', err);
      });

    getFavoriteByUserApi()
      .then((res) => {
        setFavorites(res.data.favorites);
      })
      .catch((err) => {
        console.error('Error fetching favorites:', err);
      });

    fetchProducts(page);
    fetchCart();
  }, [page, favoriteChange]);

  const fetchProducts = (pageNumber) => {
    paginationApi(pageNumber, pageSize)
      .then((res) => {
        setGadgets(res.data.products);
        applySearchAndSort(res.data.products, searchQuery, sortBy);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });
  };

  const fetchCart = async () => {
    try {
      const response = await getAllCartApi();
      setCart(response.data.carts);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handlePagination = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    applySearchAndSort(gadgets, value, sortBy);
  };

  const handleSort = (value) => {
    setSortBy(value);
    applySearchAndSort(gadgets, searchQuery, value);
  };

  const applySearchAndSort = (products, search, sort) => {
    let filtered = products.filter((gadget) =>
      gadget.productName?.toLowerCase().includes(search.toLowerCase())
    );

    const [field, order] = sort.split('_');
    filtered.sort((a, b) => {
      if (field === 'name') {
        return order === 'asc'
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName);
      } else if (field === 'price') {
        return order === 'asc'
          ? a.productPrice - b.productPrice
          : b.productPrice - a.productPrice;
      }
      return 0;
    });

    setFilteredGadgets(filtered);
  };

  const addToCart = async (product) => {
    try {
      await addToCartApi({
        productId: product._id,
        quantity: 1,
        total: product.productPrice,
      });
      await fetchCart();
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const addToFavorites = (product) => {
    addToFavoriteApi({ productId: product._id })
      .then((res) => {
        setFavoriteChange(!favoriteChange);
        toast.success('Added to favorites');
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Error adding to favorites');
        }
        console.error('Error adding to favorites:', err);
      });
  };

  const removeFromFavorites = (product) => {
    deleteFromFavoriteApi(product._id)
      .then((res) => {
        setFavoriteChange(!favoriteChange);
        toast.success('Removed from favorites');
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Error removing from favorites');
        }
        console.error('Error removing from favorites:', err);
      });
  };

  const showProductDetails = (gadget) => {
    setSelectedGadget(gadget);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const renderProductItem = (gadget) => {
    const isFavorite = favorites.some(
      (fav) => fav.productId._id === gadget._id
    );
    if (viewMode === 'grid') {
      return (
        <motion.div
          key={gadget._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}>
          <GridViewItem
            hoverable
            cover={
              <Image
                src={`http://localhost:5000/products/${gadget.productImage}`}
                alt={gadget.productName}
                preview={false}
                onClick={() => showProductDetails(gadget)}
              />
            }
            actions={[
              <Tooltip title='Add to Cart'>
                <Button
                  type='text'
                  icon={<ShoppingCartOutlined style={{ color: COLORS.text }} />}
                  onClick={() => addToCart(gadget)}
                />
              </Tooltip>,
              <Tooltip
                title={
                  isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
                }>
                <Button
                  type='text'
                  icon={
                    isFavorite ? (
                      <HeartFilled style={{ color: COLORS.secondary }} />
                    ) : (
                      <HeartOutlined style={{ color: COLORS.text }} />
                    )
                  }
                  onClick={() =>
                    isFavorite
                      ? removeFromFavorites(gadget)
                      : addToFavorites(gadget)
                  }
                />
              </Tooltip>,
              <Tooltip title='View Details'>
                <Button
                  type='text'
                  icon={<EyeOutlined style={{ color: COLORS.text }} />}
                  onClick={() => showProductDetails(gadget)}
                />
              </Tooltip>,
            ]}>
            <Card.Meta
              title={gadget.productName}
              description={
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ color: COLORS.text }}>
                  {gadget.productDescription}
                </Paragraph>
              }
            />
            <Text className='price'>
              Rs {gadget.productPrice.toLocaleString()}
            </Text>
          </GridViewItem>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          key={gadget._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}>
          <ListViewItem>
            <div className='list-image-container'>
              <Image
                src={`http://localhost:5000/products/${gadget.productImage}`}
                alt={gadget.productName}
                preview={false}
                onClick={() => showProductDetails(gadget)}
              />
            </div>
            <div className='list-content'>
              <div>
                <h3>{gadget.productName}</h3>
                <Paragraph ellipsis={{ rows: 2 }}>
                  {gadget.productDescription}
                </Paragraph>
                <Text className='price'>
                  Rs {gadget.productPrice.toLocaleString()}
                </Text>
              </div>
              <div className='list-actions'>
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={() => addToCart(gadget)}>
                  Add to Cart
                </Button>
                <Button
                  icon={
                    isFavorite ? (
                      <HeartFilled style={{ color: COLORS.secondary }} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={() =>
                    isFavorite
                      ? removeFromFavorites(gadget)
                      : addToFavorites(gadget)
                  }>
                  {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => showProductDetails(gadget)}>
                  View Details
                </Button>
              </div>
            </div>
          </ListViewItem>
        </motion.div>
      );
    }
  };

  return (
    <StyledHomepage>
      <div className='container'>
        <div className='carousel-container'>
          <Carousel
            autoplay
            effect='fade'>
            <CarouselItem>
              <img
                src='/assets/icons/longps5.jpg'
                alt='PlayStation 5 Pro'
              />
              <div className='carousel-content'>
                <Title level={2}>PlayStation 5 Pro</Title>
                <p>Experience next-gen gaming</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src='/assets/icons/image.png'
                alt='Latest Gadgets'
              />
              <div className='carousel-content'>
                <Title level={2}>Cutting-Edge Technology</Title>
                <p>Discover the latest in tech innovation</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <img
                src='https://img.freepik.com/free-photo/close-up-games-with-joystick_23-2148514527.jpg'
                alt='Gaming Accessories'
              />
              <div className='carousel-content'>
                <Title level={2}>Gaming Accessories</Title>
                <p>Elevate your gaming experience</p>
              </div>
            </CarouselItem>
          </Carousel>
        </div>

        <div className='search-container'>
          <Search
            placeholder='Search for gadgets'
            allowClear
            enterButton={
              <SearchOutlined style={{ color: COLORS.background }} />
            }
            size='large'
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Title
          level={2}
          style={{ color: COLORS.text }}>
          Available Products
        </Title>

        <div className='controls-container'>
          <div className='view-controls'>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}>
              <Radio.Button value='grid'>
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value='list'>
                <BarsOutlined />
              </Radio.Button>
            </Radio.Group>
          </div>
          <Select
            className='sort-control'
            defaultValue='name_asc'
            onChange={handleSort}
            dropdownStyle={{
              background: COLORS.white,
              color: COLORS.text,
            }}>
            <Option value='name_asc'>Sort by Name (A-Z)</Option>
            <Option value='name_desc'>Sort by Name (Z-A)</Option>
            <Option value='price_asc'>Sort by Price (Low to High)</Option>
            <Option value='price_desc'>Sort by Price (High to Low)</Option>
          </Select>
          <Link to='/cart'>
            <Badge
              count={cartItemCount}
              style={{
                backgroundColor: COLORS.secondary,
              }}>
              <ShoppingCartOutlined className='cart-icon' />
            </Badge>
          </Link>
        </div>

        <AnimatePresence>
          {filteredGadgets.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              {viewMode === 'grid' ? (
                <ProductGrid>
                  {filteredGadgets.map(renderProductItem)}
                </ProductGrid>
              ) : (
                <ProductList>
                  {filteredGadgets.map(renderProductItem)}
                </ProductList>
              )}
            </motion.div>
          ) : (
            <Empty
              description={
                <span style={{ color: COLORS.text }}>No products found</span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </AnimatePresence>

        <Pagination
          current={page}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePagination}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          style={{
            textAlign: 'center',
            margin: '2rem 0',
            '& .ant-pagination-item': {
              backgroundColor: COLORS.white,
              borderColor: COLORS.secondary,
              color: COLORS.text,
            },
            '& .ant-pagination-item-active': {
              backgroundColor: COLORS.secondary,
              borderColor: COLORS.secondary,
            },
          }}
        />

        <Modal
          title={
            <Text style={{ color: COLORS.text }}>
              {selectedGadget?.productName}
            </Text>
          }
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button
              key='close'
              onClick={handleModalClose}
              style={{
                background: COLORS.background,
                borderColor: COLORS.secondary,
                color: COLORS.text,
              }}>
              Close
            </Button>,
            <Button
              key='addToCart'
              type='primary'
              onClick={() => {
                addToCart(selectedGadget);
                handleModalClose();
              }}
              style={{
                background: COLORS.secondary,
                borderColor: COLORS.secondary,
              }}>
              Add to Cart
            </Button>,
            <Button
              key='addToFavorites'
              onClick={() => {
                const isFavorite = favorites.some(
                  (fav) => fav.productId._id === selectedGadget._id
                );
                if (isFavorite) {
                  removeFromFavorites(selectedGadget);
                } else {
                  addToFavorites(selectedGadget);
                }
                handleModalClose();
              }}
              style={{
                background: COLORS.background,
                borderColor: COLORS.secondary,
                color: COLORS.text,
              }}>
              {favorites.some(
                (fav) => fav.productId._id === selectedGadget?._id
              )
                ? 'Remove from Favorites'
                : 'Add to Favorites'}
            </Button>,
          ]}
          bodyStyle={{ background: COLORS.white }}
          style={{
            '& .ant-modal-content': {
              background: COLORS.white,
              color: COLORS.text,
            },
          }}>
          {selectedGadget && (
            <>
              <Image
                src={`https://localhost:5000/products/${selectedGadget.productImage}`}
                alt={selectedGadget.productName}
                style={{ width: '100%', marginBottom: '16px' }}
              />
              <Paragraph style={{ color: COLORS.text }}>
                {selectedGadget.productDescription}
              </Paragraph>
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                }}>
                Price: Rs {selectedGadget.productPrice.toLocaleString()}
              </Text>
            </>
          )}
        </Modal>
      </div>
    </StyledHomepage>
  );
};

export default Homepage;
