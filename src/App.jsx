import { RouterProvider,createHashRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import AnalyticsPage from "./routes/analytics/page";
import ReportPage from "./routes/report/page";
import Customer from "./routes/customer/page";
import ProductsPage from "./routes/products/page";
import SettingsPage from "./routes/settings/page";
import LoginPage from "./routes/login/page";
import ForgotPasswordPage from "./routes/forgot/page";

import { handleGetData } from "./service/readFirebase";

function App() {
    const [userID, setUserID] = useState(null);
    const [metaData, setMetaData] = useState({})
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [settings, setSettings] = useState({})
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                setUserID(userId);
                const data = await handleGetData();
                setMetaData(data?.user ?? null);
                setProducts(data?.products ?? []);
                setOrders(data?.orders ?? []);
                setSettings(data?.settings ?? []);
            } else {
                setUserID(null);
            }
        };
        fetchData();
    }, [userId]);

    const router = createHashRouter([
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage productData={products} orderData={orders} />,
                },
                {
                    path: "analytics",
                    element: <AnalyticsPage metaData={metaData} orderData={orders} />,
                },
                {
                    path: "reports",
                    element: <ReportPage orderData={orders} />,
                },
                {
                    path: "customers",
                    element: <Customer orderData={orders} />,
                },
                {
                    path: "products",
                    element: <ProductsPage productData={products} setProductData={setProducts} metaData={metaData} setMetaData={setMetaData}/>,
                },
                {
                    path: "settings",
                    element: <SettingsPage metaData={metaData} setMetaData={setMetaData} />,
                },
            ],
        },
        {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
        }
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
