# Gagdet Mart

A React-based frontend for the Gadget Mart eCommerce website, offering tailored interfaces for both customers (User) and administrators (Admin) to browse and purchase products, manage orders, and handle inventory and customer information.

(https://youtu.be/QRtn9zYfFWs).

## Features

### Admin Role

- **Dashboard**: Overview of eCommerce operations, including current orders, product inventory, and sales statistics.
- **Product Management**: Manage product listings, add new products, and update product details.
- **Order Management**: View, process, and update orders placed by customers.
- **Billing & Invoices**: Generate and manage invoices for customer payments and track payment status.

### User Role

- **Product Search**: Browse and filter products based on categories, price, and preferences.
- **Favourites**: Add products to favourites in case you want to order.
- **Cart & Checkout**: Add products to the cart, review orders, and proceed to checkout.
- **Order History**: View and manage personal order history.
- **Profile Management**: Update personal details, addresses, and payment methods.

### Technologies

- ![React.js Logo](path/to/react-logo.png) **React.js**: Core frontend library
- ![Redux Logo](path/to/redux-logo.png) **Redux**: State management
- ![Tailwind CSS Logo](path/to/tailwind-logo.png) **Tailwind CSS**: UI styling

### API Integration

The frontend communicates with the backend via a RESTful API, handling operations for both Admin and User roles, such as product management, order processing, customer data handling, and AR try-on functionality.

### Future Works

- **AR Try-On Expansion**: Extend the virtual try-on feature to include more accessories such as hats and earrings for a more comprehensive experience.
- **Enhanced Personalization**: Implement AI-driven recommendations based on user preferences and past behavior to suggest products more accurately.
- **In-Store Pickup Option**: Introduce an option for users to reserve products online and pick them up at a physical store location.
- **Social Media Integration**: Enable users to share their try-on experiences and favorite products directly on social media platforms.

### Challenges

- **State Management**: Managing complex state across various components, particularly with features like virtual try-on, user authentication, and shopping cart, was challenging but effectively handled using React's Context API and useReducer hook.
- **AR Integration**: Integrating augmented reality for the virtual try-on feature in a web environment required overcoming challenges related to performance, accurate rendering, and compatibility with different browsers.
- **Responsive Design**: Ensuring that the user interface remained consistent and functional across a wide range of devices and screen sizes was challenging, but Tailwind CSS provided the flexibility needed to create a responsive design.
- **API Integration**: Handling API requests for real-time product updates, user authentication, and AR data processing while maintaining smooth and secure communication was crucial and required thorough testing.

### Environment Variables

- `REACT_APP_API_URL`: http://localhost:5000
- `REACT_APP_GOOGLE_CLIENT_ID`: 348505927725-nhamp4q2f0jkqp4ov57ch1t51oir47pe.apps.googleusercontent.com
- `REACT_APP_KHALTI_URL`: https://test-pay.khalti.com/
- `REACT_APP_KHALTI_PUBLIC_KEY`: 064d32e438be480288e4d15e300cbfce
- `REACT_APP_AR_SERVICE_URL`: The URL for the Augmented Reality service used in the virtual try-on feature.

# Screenshots

Below are some screenshots from the project:

#### Landing Page

![Landing Page](screenshots/landingpage.png)

#### Register

![Image 2](screenshots/register.png)

#### Login

![Image 3](screenshots/login.png)

#### User Dashboard

![Image 4](screenshots/userdashboard.png)

#### Cart

![Image 5](screenshots/cart.png)

#### Favourites

![Image 6](screenshots/favourites.png)

#### My Orders

![Image 7](screenshots/myorders.png)

#### Admin Dashboard

![Image 8](screenshots/admindashboard1.png)

#### Contact Us

![Image 10](screenshots/contactus.png)
