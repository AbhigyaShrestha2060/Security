const router = require("express").Router();
const productController = require("../controllers/productController");

router.post("/create", productController.createProduct);

// fetch all products
router.get("/get_all", productController.getAllProducts);

// fetch single products
router.get("/get_single_products/:id", productController.getSingleProduct);

//delete product
router.delete("/delete/:id", productController.deleteProduct);

//update product
router.put("/update/:id", productController.updateProduct);

// pagination
router.get("/pagination", productController.paginationProducts);

// count products
router.get("/count", productController.getTotalProducts);

//  get all categories
router.get("/categories/all", productController.getALlCategories);

module.exports = router;
