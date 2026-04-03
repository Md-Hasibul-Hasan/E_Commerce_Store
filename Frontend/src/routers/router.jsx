import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Shipping from "../pages/Shipping";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Activate from "../components/Activate";
import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";
import Payment from "../pages/Payment";
import PlaceOrder from "../pages/PlaceOrder";
import OrderDetails from "../pages/OrderDetails";
import MyOrders from "../pages/MyOrders";
import AdminLayout from "../pages/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../pages/AdminRoute";
import AdminProducts from "../pages/AdminProducts";
import AdminOrders from "../pages/AdminOrders";
import AdminUsers from "../pages/AdminUsers";


export const myrouter = createBrowserRouter([
    {
        path: '/', element: <App />, children: [
            { index: true, element: <Home /> },
            { path: 'product/:id', element: <ProductDetails /> },
            { path: 'cart/:id?', element: <Cart /> },
            { path: 'shipping', element: <Shipping /> },
            { path: 'payment', element: <Payment /> },
            { path: 'placeorder', element: <PlaceOrder /> },
            { path: 'order/:id', element: <OrderDetails /> },
            { path: 'myorders', element: <MyOrders /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: "/activate/:uid/:token", element: <Activate /> },
            { path: "profile", element: <Profile /> },
            { path: "/password-reset/:uid/:token", element: <ResetPassword /> },

            {
                path: "admin",
                element: (
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                ),
                children: [
                    { path: "dashboard", element: <AdminDashboard /> },
                    { path: "products", element: <AdminProducts /> },
                    { path: "orders", element: <AdminOrders /> },
                    { path: "users", element: <AdminUsers /> },
                ],
            },


        ]
    },
])