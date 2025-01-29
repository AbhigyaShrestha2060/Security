const path = require('path');
const productModel = require('../models/productModel');
const Product = require('../models/productModel');
const fs = require('fs');
const DOMPurify = require('dompurify');

const sanitizeInput = (input) => DOMPurify.sanitize(input);

const isValidImage = (file) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  return file && allowedTypes.includes(file.mimetype);
};

const isValidPrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

const createProduct = async (req, res) => {
  let { productName, productPrice, productCategory, productDescription } =
    req.body;

  productName = sanitizeInput(productName);
  productCategory = sanitizeInput(productCategory);
  productDescription = sanitizeInput(productDescription);

  if (
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required!' });
  }

  if (!isValidPrice(productPrice)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid price value!' });
  }

  if (
    !req.files ||
    !req.files.productImage ||
    !isValidImage(req.files.productImage)
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid or missing image file!' });
  }

  const { productImage } = req.files;
  const imageName = `${Date.now()}-${productImage.name}`;
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  try {
    await productImage.mv(imageUploadPath);

    const newProduct = new productModel({
      productName,
      productPrice: parseFloat(productPrice.replace(/,/g, '')),
      productCategory,
      productDescription,
      productImage: imageName,
    });

    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products: allProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: 'Product not found' });
    }

    const imagePath = path.join(
      __dirname,
      `../public/products/${product.productImage}`
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await productModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Product Deleted Successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error });
  }
};

const getALlCategories = async (req, res) => {
  try {
    const allCategories = await productModel.find().distinct('productCategory');
    res.status(201).json({
      success: true,
      message: 'Categories fetched successfully',
      categories: allCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error,
    });
  }
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'No Product Found',
      });
    }
    res.status(201).json({
      success: true,
      message: 'Product fetched',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    let { productName, productPrice, productCategory, productDescription } =
      req.body;

    productName = sanitizeInput(productName);
    productCategory = sanitizeInput(productCategory);
    productDescription = sanitizeInput(productDescription);

    if (
      !productName ||
      !productPrice ||
      !productCategory ||
      !productDescription
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required!' });
    }

    if (!isValidPrice(productPrice)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid price value!' });
    }

    let imageName;
    if (
      req.files &&
      req.files.productImage &&
      isValidImage(req.files.productImage)
    ) {
      const { productImage } = req.files;
      imageName = `${Date.now()}-${productImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );
      await productImage.mv(imageUploadPath);

      const existingProduct = await productModel.findById(req.params.id);
      if (existingProduct && existingProduct.productImage) {
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    productPrice = parseFloat(productPrice.replace(/,/g, ''));
    const updatedProductData = {
      productName,
      productPrice,
      productCategory,
      productDescription,
    };
    if (imageName) updatedProductData.productImage = imageName;

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      updatedProductData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error });
  }
};

const paginationProducts = async (req, res) => {
  const pageNo = req.query.page || 1;
  const resultPerPage = req.query.limit || 3;

  try {
    const products = await Product.find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No more products',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error,
    });
  }
};

const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.find({}).countDocuments();
    res.status(200).json({
      success: true,
      message: 'Total Products',
      count: totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  paginationProducts,
  getTotalProducts,
  getALlCategories,
};
