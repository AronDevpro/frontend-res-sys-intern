import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PageLayout from "./Component/Layout/PageLayout.jsx";
import HomePage from "./View/HomePage/HomePage.jsx";
import CustomerPage from "./View/CustomerPage/CustomerPage.jsx";
import EmployeePage from "./View/EmployeePage/EmployeePage.jsx";
import MenuPage from "./View/MenuPage/MenuPage.jsx";
import OrderPage from "./View/OrderPage/OrderPage.jsx";
import SupplierPage from "./View/SupplierPage/SupplierPage.jsx";
import InventoryPage from "./View/InventoryPage/InventoryPage.jsx";
import ReservationPage from "./View/ReservationPage/ReservationPage.jsx";
import RestaurantPage from "./View/RestaurantPage/RestaurantPage.jsx";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <PageLayout />,
            children: [
                {
                    path: '/Home',
                    element: <HomePage />,
                },
                {
                    path: '/',
                    element: <CustomerPage />,
                },
                {
                    path: '/employee',
                    element: <EmployeePage />,
                },
                {
                    path: '/menu',
                    element: <MenuPage />,
                },
                {
                    path: '/order',
                    element: <OrderPage />,
                },
                {
                    path: '/supplier',
                    element: <SupplierPage />,
                },
                {
                    path: '/inventory',
                    element: <InventoryPage />,
                },
                {
                    path: '/reservation',
                    element: <ReservationPage />,
                },
                {
                    path: '/restaurant',
                    element: <RestaurantPage />,
                },
            ],
        },
    ])
    return <RouterProvider router={router} />
}

export default App
