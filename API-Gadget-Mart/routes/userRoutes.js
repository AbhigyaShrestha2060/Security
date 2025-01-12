const router = require("express").Router();
const userController = require("../controllers/userController");
const { authGuard } = require("../middleware/authGuard");

// Login User
router.post("/login", userController.loginUser);

// Create User
router.post("/create", userController.createUser);

// forgot password
router.post("/forgot_password", userController.forgetPassword);

// reset password
router.post("/reset_password", userController.resetPassword);

// get single user
router.get("/get_single_user", authGuard, userController.getSingleUser);

// update profile
router.put("/update_profile", authGuard, userController.updateProfile);

// get all user
router.get("/get_all_user", authGuard, userController.getAllUser);

router.post("/getToken", userController.getToken);

module.exports = router;
