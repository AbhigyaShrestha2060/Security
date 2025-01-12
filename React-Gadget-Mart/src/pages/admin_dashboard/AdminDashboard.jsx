import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  createProductApi,
  deleteProductApi,
  getOrdersApi,
  getProductsApi,
  updateOrderStatusApi,
  updateProductApi,
} from "../../Apis/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [gadgets, setGadgets] = useState([]);
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [currentGadget, setCurrentGadget] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("laptop");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  useEffect(() => {
    getProductsApi().then((res) => {
      setGadgets(res.data.products);
      setFilteredGadgets(res.data.products);
    });

    getOrdersApi().then((res) => {
      console.log(res.data.orders);
      setOrders(res.data.orders);
    });
  }, []);

  useEffect(() => {
    const results = gadgets.filter(
      (gadget) =>
        gadget.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gadget.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGadgets(results);
  }, [searchTerm, gadgets]);

  const handleAddGadget = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", name);
    formData.append("productPrice", price);
    formData.append("productCategory", category);
    formData.append("productDescription", description);
    formData.append("productImage", imageFile);

    createProductApi(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          getProductsApi().then((res) => {
            setGadgets(res.data.products);
            setFilteredGadgets(res.data.products);
          });
          resetForm();
        }
      })
      .catch((error) => {
        toast.error("An error occurred while adding the gadget");
      });
  };

  const handleEditGadget = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", name);
    formData.append("productPrice", price);
    formData.append("productCategory", category);
    formData.append("productDescription", description);
    formData.append("productImage", imageFile);

    updateProductApi(currentGadget._id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          getProductsApi().then((res) => {
            setGadgets(res.data.products);
            setFilteredGadgets(res.data.products);
          });
          resetForm();
        }
      })
      .catch((error) => {
        toast.error("An error occurred while updating the gadget");
      });
  };

  const handleDeleteGadget = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this gadget?"
    );
    if (confirm) {
      deleteProductApi(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            getProductsApi().then((res) => {
              setGadgets(res.data.products);
              setFilteredGadgets(res.data.products);
            });
          }
        })
        .catch((error) => {
          toast.error("An error occurred while deleting the gadget");
        });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusApi(orderId, {
        status: newStatus,
      });
      if (response.status === 200) {
        toast.success("Order status updated successfully");
        const updatedOrders = await getOrdersApi();
        setOrders(updatedOrders.data.orders);
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status");
    }
  };

  const openEditModal = (gadget) => {
    setCurrentGadget(gadget);
    setName(gadget.productName);
    setDescription(gadget.productDescription);
    setPrice(gadget.productPrice);
    setCategory(gadget.productCategory);
    setImageFile(null);
    document.getElementById("addGadgetModal").style.display = "flex";
  };

  const resetForm = () => {
    setCurrentGadget(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("laptop");
    setImageFile(null);
    document.getElementById("addGadgetModal").style.display = "none";
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setOrderModalVisible(false);
  };

  const categoryData = [
    {
      name: "Laptop",
      value: gadgets.filter((g) => g.productCategory === "laptop").length,
    },
    {
      name: "Accessories",
      value: gadgets.filter((g) => g.productCategory === "accessories").length,
    },
    {
      name: "Speaker",
      value: gadgets.filter((g) => g.productCategory === "speaker").length,
    },
    {
      name: "Mobile",
      value: gadgets.filter((g) => g.productCategory === "mobile").length,
    },
  ];

  const priceData = gadgets.map((gadget) => ({
    name: gadget.productName,
    price: parseFloat(gadget.productPrice),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Gadget Admin Hub</h1>
      </header>
      <main className="dashboard-grid">
        <div className="sidebar">
          <div className="quick-stats">
            <h2>Quick Stats</h2>
            <ul>
              <li>
                <span>Total Gadgets</span>
                <span className="stat-value">{gadgets.length}</span>
              </li>
              <li>
                <span>Categories</span>
                <span className="stat-value">4</span>
              </li>
              <li>
                <span>Avg. Price</span>
                <span className="stat-value">
                  Rs.{" "}
                  {(
                    gadgets.reduce(
                      (acc, curr) => acc + parseFloat(curr.productPrice),
                      0
                    ) / gadgets.length
                  ).toFixed(2)}
                </span>
              </li>
            </ul>
          </div>
          <button
            className="add-gadget-btn"
            onClick={() =>
              (document.getElementById("addGadgetModal").style.display = "flex")
            }
          >
            <FaPlus /> Add New Gadget
          </button>
          <div className="category-distribution">
            <h2>Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="main-content">
          <div className="price-analytics">
            <h2>Price Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="gadget-inventory">
            <h2>Gadget Inventory</h2>
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search gadgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGadgets.map((gadget) => (
                  <tr key={gadget._id}>
                    <td>{gadget.productName}</td>
                    <td>${gadget.productPrice}</td>
                    <td>
                      <span
                        className={`category-tag ${gadget.productCategory}`}
                      >
                        {gadget.productCategory}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(gadget)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteGadget(gadget._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="order-management">
            <h2>Order Management</h2>
            <div className="order-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">
                      Order #{order._id.slice(-6)}
                    </span>
                    <span
                      className={`order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-info">
                    <p>
                      <strong>Customer:</strong>{" "}
                      {order.userId?.fullname || "N/A"}
                    </p>
                    <p>
                      <strong>Total:</strong> Rs.{order.total.toFixed(2)}
                    </p>
                    <p>
                      <strong>Payment:</strong> {order.paymentType}
                    </p>
                  </div>
                  <div className="order-actions">
                    <button
                      className="view-btn"
                      onClick={() => openOrderModal(order)}
                    >
                      <FaEye /> View Details
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Add/Edit Gadget Modal */}
      <div id="addGadgetModal" className="modal">
        <div className="modal-content">
          <h2>{currentGadget ? "Edit Gadget" : "Add New Gadget"}</h2>
          <form onSubmit={currentGadget ? handleEditGadget : handleAddGadget}>
            <div className="form-group">
              <label htmlFor="gadgetName">Name</label>
              <input
                type="text"
                id="gadgetName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gadgetPrice">Price</label>
              <input
                type="number"
                id="gadgetPrice"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gadgetCategory">Category</label>
              <select
                id="gadgetCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="laptop">Laptop</option>
                <option value="accessories">Accessories</option>
                <option value="speaker">Speaker</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="gadgetDescription">Description</label>
              <textarea
                id="gadgetDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="gadgetImage">Image</label>
              <input
                type="file"
                id="gadgetImage"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {currentGadget ? "Update Gadget" : "Add Gadget"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Order Details Modal */}
      {orderModalVisible && selectedOrder && (
        <div className="modal order-modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <button className="close-btn" onClick={closeOrderModal}>
              &times;
            </button>
            <div className="order-details">
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.userId.fullname}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.userId.email}
              </p>
              <p>
                <strong>Total Amount:</strong> Rs.
                {selectedOrder.total.toFixed(2)}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.paymentType}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <h3>Ordered Items:</h3>
              <ul className="ordered-items">
                {selectedOrder.carts.map((item, index) => (
                  <li key={index}>
                    {item.productId.productName} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
