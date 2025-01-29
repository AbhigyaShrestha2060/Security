const router = require('express').Router();
const productController = require('../controllers/productController');
const { authGuard, adminGuard } = require('../middleware/authGuard');
const { activityLoggerMiddleware } = require('../middleware/LogActivity');

router.post(
  '/create',
  adminGuard,
  activityLoggerMiddleware,
  productController.createProduct
);

// fetch all products
router.get('/get_all', productController.getAllProducts);

// fetch single products
router.get('/get_single_products/:id', productController.getSingleProduct);

//delete product
router.delete(
  '/delete/:id',
  adminGuard,
  activityLoggerMiddleware,
  productController.deleteProduct
);

//update product
router.put(
  '/update/:id',
  adminGuard,
  activityLoggerMiddleware,
  productController.updateProduct
);

// pagination
router.get('/pagination', productController.paginationProducts);

// count products
router.get('/count', productController.getTotalProducts);

//  get all categories
router.get('/categories/all', productController.getALlCategories);

module.exports = router;
