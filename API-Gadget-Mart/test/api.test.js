// Import request from supertest
const request = require("supertest");
// Importing server file
const app = require("../index");

// admin token
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmYwMGU3YmU1MmQ2ZmE4MjMzOGQ4ZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMzgwMDMyNn0.ltrYERatSJ9TbRXwz_cQDRtvM7C9PxsaPojakaiMyYU";

describe("API testing", () => {
  // // Testing '/test' API
  // it("GET /Coldfilms | Response with text", async () => {
  //   const response = await request(app).get("/Coldfilms");

  //   expect(response.statusCode).toBe(200);
  //   expect(response.text).toEqual("Test API is Working!");
  // });

  // Test Case 1: User Registration - Missing Details
  it("POST User Registration | Response with body", async () => {
    const response = await request(app).post("/api/user/create").send({
      fullName: "Marcus Rashford",
      phone: "9845012345",
      email: "rashford@gmail.com",
      password: "rashford10",
    });
    // if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual("User Already Exists!");
    } else {
      expect(response.body.message).toEqual("User Created!");
    }
  });

  // // Test Case 2: User Login - Incorrect Email or Password
  it("POST User Login | Incorrect credentials", async () => {
    // Mock user data
    const loginUser = {
      email: "wrong.email@example.com",
      password: "incorrectpassword",
    };

    const response = await request(app).post("/api/user/login").send(loginUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("User doesn't exist");
  });

  // // Test Case 3: User login -
  it("POST User Login | Successful login should return token and user data", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "rashford@gmail.com",
      password: "rashford10",
    });
    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual("Logged in Successfully!");
    expect(response.body).toHaveProperty("token");

    expect(response.body.user).toHaveProperty("email");
  });

  // // Test Case 4: Get single profile(user)
  it("GET Single profile | Fetch single user", async () => {
    const response = await request(app)
      .get("/api/user/get_single_user")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("User found");
  });

  it("GET All products | Fetch all products", async () => {
    const response = await request(app)
      .get("/api/product/get_all")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Products fetched successfully");
  });

  it("GET Single product | Fetch single product", async () => {
    const response = await request(app)
      .get("/api/product/get_single_products/66996098b16bf080ca2623e2")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Product fetched");
  });

  // test case for creating product
  it("POST create product | Buy product", async () => {
    const response = await request(app).post("/api/product/create").send({
      productName: "product",
      productDescription: "product description",
      productCategory: "product category",
      productImage: "product image",
      productPrice: "product price",
    });
    if (!response.body.success) {
      expect(response.body.message).toEqual("Image not found");
    } else {
      expect(response.body.message).toEqual("Product created successfully");
    }
  });

  // test case for adding to cart
  it("POST add to cart | Add to cart", async () => {
    const response = await request(app)
      .post("/api/cart/add")
      .set("authorization", `Bearer ${token}`)
      .send({
        productId: "66996098b16bf080ca2623e2",
        quantity: "5",
        total: "500",
      });
    if (!response.body.success) {
      expect(response.body.message).toEqual("Item quantity updated");
    } else {
      expect(response.body.message).toEqual("Item added to cart");
    }
  });

  // test case for get all cart items
  it("GET all cart items | Fetch all cart items", async () => {
    const response = await request(app)
      .get("/api/cart/all")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Cart items fetched successfully");
  });

  // test case for getting all orders
  it("GET all orders | Fetch all orders", async () => {
    const response = await request(app)
      .get("/api/order/get")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
  });
});
