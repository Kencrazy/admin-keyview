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

function App() {
    const [userID, setUserID] = useState(null);
    const [metaData, setMetaData] = useState({})
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [terms, setTerms] = useState([])
    const [settings, setSettings] = useState({})
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        if (userId) {
            setUserID(userId);
        } else {
            setUserID(null);
        }
    }
    , [userId]);

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
                    element: <DashboardPage />,
                },
                {
                    path: "analytics",
                    element: <AnalyticsPage />,
                },
                {
                    path: "reports",
                    element: <ReportPage />,
                },
                {
                    path: "customers",
                    element: <Customer />,
                },
                {
                    path: "products",
                    element: <ProductsPage />,
                },
                {
                    path: "settings",
                    element: <SettingsPage />,
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
