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

const StyledHomepage = styled.div`
  padding: 2rem 0;

  .carousel-container {
    margin-bottom: 2rem;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .ant-carousel .slick-slide {
    text-align: center;
    height: 400px;
    line-height: 400px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel .slick-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carousel-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
    z-index: 1;
  }

  .search-container {
    margin: 2rem 0;
  }

  .products-container {
    margin-bottom: 2rem;
  }

  .ant-pagination {
    text-align: center;
    margin-top: 2rem;
  }

  .controls-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .view-controls {
    display: flex;
    align-items: center;
  }

  .sort-control {
    width: 200px;
  }

  .cart-icon {
    font-size: 24px;
    cursor: pointer;
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    background: rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ListViewItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .list-image-container {
    width: 200px;
    height: 200px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .list-content {
    flex-grow: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .list-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const GridViewItem = styled(Card)`
  .ant-card-cover {
    height: 300px;
    overflow: hidden;
  }

  .ant-card-body {
    padding: 1rem;
  }

  .ant-card-meta-title {
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .grid-actions {
    display: flex;
    justify-content: space-between;
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
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToFavorites = (product) => {
    addToFavoriteApi({ productId: product._id })
      .then((res) => {
        console.log(res.data);
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
        console.log(res.data);
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
    console.log('isFavorite', isFavorite);
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
                <ShoppingCartOutlined onClick={() => addToCart(gadget)} />
              </Tooltip>,
              <Tooltip title='Add to Favorites'>
                <Button
                  icon={
                    isFavorite ? (
                      <HeartFilled style={{ color: 'red' }} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={() =>
                    isFavorite
                      ? removeFromFavorites(gadget)
                      : addToFavorites(gadget)
                  }
                  // remove border
                  type='text'
                />
              </Tooltip>,
              <Tooltip title='View Details'>
                <EyeOutlined onClick={() => showProductDetails(gadget)} />
              </Tooltip>,
            ]}>
            <Card.Meta
              title={gadget.productName}
              description={
                <Paragraph ellipsis={{ rows: 2 }}>
                  {gadget.productDescription}
                </Paragraph>
              }
            />
            <Text className='price'>Rs {gadget.productPrice}</Text>
          </GridViewItem>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          key={gadget._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}>
          <ListViewItem>
            <div className='list-image-container'>
              <Image
                className='list-image'
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
                <Text strong>Rs {gadget.productPrice}</Text>
              </div>
              <div className='list-actions'>
                <Tooltip title='Add to Cart'>
                  <Button
                    icon={<ShoppingCartOutlined />}
                    onClick={() => addToCart(gadget)}>
                    Add to Cart
                  </Button>
                </Tooltip>
                <Tooltip title='Add to Favorites'>
                  <Button
                    icon={
                      isFavorite ? (
                        <HeartFilled style={{ color: 'red' }} />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={() =>
                      isFavorite
                        ? removeFromFavorites(gadget)
                        : addToFavorites(gadget)
                    }
                  />
                </Tooltip>
                <Tooltip title='View Details'>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => showProductDetails(gadget)}
                  />
                </Tooltip>
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
            enterButton={<SearchOutlined />}
            size='large'
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Title level={2}>Available Products</Title>

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
            onChange={handleSort}>
            <Option value='name_asc'>Sort by Name (A-Z)</Option>
            <Option value='name_desc'>Sort by Name (Z-A)</Option>
            <Option value='price_asc'>Sort by Price (Low to High)</Option>
            <Option value='price_desc'>Sort by Price (High to Low)</Option>
          </Select>
          <Link to='/cart'>
            <Badge
              count={cartItemCount}
              showZero>
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
            <Empty description='No products found' />
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
        />

        <Modal
          title={selectedGadget?.productName}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button
              key='close'
              onClick={handleModalClose}>
              Close
            </Button>,
            <Button
              key='addToCart'
              type='primary'
              onClick={() => {
                addToCart(selectedGadget);
                handleModalClose();
              }}>
              Add to Cart
            </Button>,
            <Button
              key='addToFavorites'
              onClick={() => {
                addToFavorites(selectedGadget);
                handleModalClose();
              }}>
              Add to Favorites
            </Button>,
          ]}>
          {selectedGadget && (
            <>
              <Image
                src={`http://localhost:5000/products/${selectedGadget.productImage}`}
                alt={selectedGadget.productName}
                style={{ width: '100%', marginBottom: '16px' }}
              />
              <Paragraph>{selectedGadget.productDescription}</Paragraph>
              <Text strong>Price: Rs {selectedGadget.productPrice}</Text>
            </>
          )}
        </Modal>
      </div>
    </StyledHomepage>
  );
};

export default Homepage;
