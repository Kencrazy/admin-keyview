import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import AnalyticsPage from "./routes/analytics/page";
import ReportPage from "./routes/report/page";
import Customer from "./routes/customer/page";
import ProductsPage from "./routes/products/page";
import SettingsPage from "./routes/settings/page";
import LoginPage from "./routes/login/page";

function App() {
    const router = createBrowserRouter([
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
        }
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
