const path = require("path");
const productModel = require("../models/productModel");
const Product = require("../models/productModel");
const fs = require("fs");

const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const { productName, productPrice, productCategory, productDescription } =
    req.body;

  if (
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Image not found",
    });
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
      productPrice: parseFloat(productPrice.replace(/,/g, "")),
      productCategory,
      productDescription,
      productImage: imageName,
    });

    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getALlCategories = async (req, res) => {
  try {
    const allCategories = await productModel.find().distinct("productCategory");
    res.status(201).json({
      success: true,
      message: "Categories fetched successfully",
      categories: allCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
        message: "No Product Found",
      });
    }
    res.status(201).json({
      success: true,
      message: "Product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    const imagePath = path.join(
      __dirname,
      `../public/products/${product.productImage}`
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await productModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (req.files && req.files.productImage) {
      const { productImage } = req.files;

      const imageName = `${Date.now()}-${productImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );
      await productImage.mv(imageUploadPath);

      req.body.productImage = imageName;

      const existingProduct = await productModel.findById(req.params.id);
      const oldImagePath = path.join(
        __dirname,
        `../public/products/${existingProduct.productImage}`
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    req.body.productPrice = parseFloat(req.body.productPrice.replace(/,/g, ""));

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Product updated!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
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
        message: "No more products",
      });
    }

    res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.find({}).countDocuments();
    res.status(200).json({
      success: true,
      message: "Total Products",
      count: totalProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
