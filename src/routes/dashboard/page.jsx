import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import { CreditCard, DollarSign, Package, Star, TrendingUp, Users, TrendingDown } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { generateOverviewData } from "../../service/interactiveCode";
import cleanQuillHtml from "../../utils/cleanQuillHtml";
import productImage from "../../assets/product-image.jpg";

const DashboardPage = ({ productData, orderData }) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [topProducts, setTopProducts] = useState([]);
    const [totalProductsCompared, setTotalProductsCompared] = useState(0);
    const [totalPaidOrdersCompared, setTotalPaidOrdersCompared] = useState(0);
    const [totalCustomersCompared, setTotalCustomersCompared] = useState(0);
    const [totalSalesCompared, setTotalSalesCompared] = useState(0);
    const [overviewData, setOverviewData] = useState([]);
    const [lastMonthStats, setLastMonthStats] = useState({});

    // Calculate stats for current and previous months
    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth(); // August 2025 (month 7)
        const currentYear = now.getFullYear(); // 2025

        // Current month: August 1, 2025 - August 31, 2025
        const currentMonthStart = new Date(currentYear, currentMonth, 1);
        const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        // Previous month: July 1, 2025 - July 31, 2025
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
        const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59, 999);

        // Filter orders for current month
        const thisMonthOrders = orderData.filter(order => {
            const date = new Date(order.orderedDate);
            return (
                date >= currentMonthStart &&
                date <= currentMonthEnd &&
                order.status === "Delivered"
            );
        });

        // Filter orders for previous month
        const lastMonthOrders = orderData.filter(order => {
            const date = new Date(order.orderedDate);
            return (
                date >= lastMonthStart &&
                date <= lastMonthEnd &&
                order.status === "Delivered"
            );
        });

        // Calculate stats
        const getStats = (orders) => {
            const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            const totalSales = orders.reduce((sum, o) => 
                sum + (o.products ? o.products.reduce((qty, p) => qty + (p.quantityOrdered || 0), 0) : 0), 0);
            const totalCustomers = new Set(orders.map(o => o.customerName || '')).size;
            return { totalRevenue, totalSales, totalCustomers };
        };

        const thisMonthStats = getStats(thisMonthOrders);
        const lastMonthStatsData = getStats(lastMonthOrders);
        setLastMonthStats(lastMonthStatsData);

        // Calculate percentage changes
        const percent = (current, prev) => {
            if (current === 0 && prev === 0) return 0;
            if (prev === 0) return current > 0 ? 100 : -100;
            return Math.round(((current - prev) / prev) * 100);
        };

        setTotalPaidOrdersCompared(percent(thisMonthStats.totalRevenue, lastMonthStatsData.totalRevenue));
        setTotalSalesCompared(percent(thisMonthStats.totalSales, lastMonthStatsData.totalSales));
        setTotalCustomersCompared(percent(thisMonthStats.totalCustomers, lastMonthStatsData.totalCustomers));

        // Product stats
        const thisMonthProducts = productData.filter(p => {
            const created = new Date(parseInt(p.id, 10));
            return created >= currentMonthStart && created <= currentMonthEnd;
        });
        const lastMonthProducts = productData.filter(p => {
            const created = new Date(parseInt(p.id, 10));
            return created >= lastMonthStart && created <= lastMonthEnd;
        });

        setTotalProductsCompared(percent(thisMonthProducts.length, lastMonthProducts.length));
        lastMonthStatsData.totalProducts = lastMonthProducts.length;
    }, [orderData, productData]);

    // Set chart date range to include current month
    useEffect(() => {
        if (orderData.length > 0) {
            const dates = orderData.map(order => new Date(order.orderedDate));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const currentMonthEnd = new Date(2025, 7, 31, 23, 59, 59, 999); // August 31, 2025

            // Ensure toDate includes the current month (August 2025)
            const toDate = maxDate > currentMonthEnd ? maxDate : currentMonthEnd;
            const formatDate = (date) => date.toISOString().slice(0, 10);
            setFromDate(formatDate(minDate));
            setToDate(formatDate(toDate));
        } else {
            // Default to current year if no orders
            const currentYear = new Date().getFullYear();
            setFromDate(`${currentYear}-01-01`);
            setToDate(`${currentYear}-12-31`);
        }
    }, [orderData]);

    // Calculate top products
    useEffect(() => {
        if (!orderData || orderData.length === 0 || !productData || productData.length === 0) {
            setTopProducts([]);
            return;
        }

        const productDataMap = new Map(
            productData.map(p => [p.name, p])
        );

        const productQuantities = orderData
            .filter(order => order.status === "Delivered")
            .reduce((acc, order) => {
                if (order.products) {
                    order.products.forEach(product => {
                        const key = product.name;
                        if (!acc[key]) {
                            acc[key] = {
                                name: product.name,
                                quantityOrdered: 0,
                                price: product.priceEach
                            };
                        }
                        acc[key].quantityOrdered += product.quantityOrdered || 0;
                    });
                }
                return acc;
            }, {});

        const sortedProducts = Object.values(productQuantities)
            .map(product => {
                const productInfo = productDataMap.get(product.name);
                return {
                    ...product,
                    image: productInfo?.image || productImage,
                    type: productInfo?.type || "Unknown",
                    rating: productInfo?.rating || 0,
                    status: productInfo?.status || "Unknown",
                    number: productInfo?.number || product.name
                };
            })
            .sort((a, b) => {
                if (b.quantityOrdered !== a.quantityOrdered) {
                    return b.quantityOrdered - a.quantityOrdered;
                }
                return b.rating - a.rating;
            })
            .slice(0, 20);

        setTopProducts(sortedProducts);
    }, [orderData, productData]);

    // Generate chart data
    useEffect(() => {
        if (fromDate && toDate && orderData.length > 0) {
            const data = generateOverviewData(orderData, fromDate, toDate);
            const sanitizedData = data
                ? data.map(item => ({
                    ...item,
                    total: isNaN(Number(item.total)) ? 0 : Number(item.total)
                }))
                : [];
            setOverviewData(sanitizedData);
        } else {
            setOverviewData([]);
        }
    }, [orderData, fromDate, toDate]);

    // Current month stats for display
    const filteredStats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth(); // August (7)
        const currentYear = now.getFullYear(); // 2025
        const from = new Date(currentYear, currentMonth, 1);
        const to = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        const filtered = orderData.filter(order => {
            const orderDate = new Date(order.orderedDate);
            return (
                order.status === "Delivered" &&
                orderDate >= from &&
                orderDate <= to
            );
        });

        const totalRevenue = filtered.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const totalSales = filtered.reduce((sum, order) => 
            sum + (order.products ? order.products.reduce((qty, p) => qty + (p.quantityOrdered || 0), 0) : 0), 0);
        const uniqueCustomers = new Set(filtered.map(o => o.customerName || ''));
        const totalProducts = productData.filter(p => {
            const created = new Date(parseInt(p.id, 10));
            return created >= from && created <= to;
        }).length;

        return {
            totalRevenue,
            totalSales,
            totalCustomers: uniqueCustomers.size,
            totalProducts
        };
    }, [orderData, productData]);

    // Formatting utilities
    const formatNumber = (num) => {
        if (num === undefined || num === null) return '0';
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num.toString();
    };

    const formatPrice = (price) => {
        return (price || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
                <h1 className="title">Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Products</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatNumber(filteredStats.totalProducts)} 
                            <span className="text-sm text-gray-500"> {formatNumber(lastMonthStats.totalProducts)}</span>
                        </p>
                        <span
                            className={`flex w-fit items-center gap-x-2 rounded-full border px-2 py-1 font-medium
                                ${totalProductsCompared >= 0
                                    ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                    : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'}`}>
                            {totalProductsCompared >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            {Math.abs(totalProductsCompared)}%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Paid Orders (Revenue)</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatNumber(filteredStats.totalRevenue)} 
                            <span className="text-sm text-gray-500"> {formatNumber(lastMonthStats.totalRevenue)}</span>
                        </p>
                        <span
                            className={`flex w-fit items-center gap-x-2 rounded-full border px-2 py-1 font-medium
                                ${totalPaidOrdersCompared >= 0
                                    ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                    : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'}`}>
                            {totalPaidOrdersCompared >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            {Math.abs(totalPaidOrdersCompared)}%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Total Customers</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatNumber(filteredStats.totalCustomers)} 
                            <span className="text-sm text-gray-500"> {formatNumber(lastMonthStats.totalCustomers)}</span>
                        </p>
                        <span
                            className={`flex w-fit items-center gap-x-2 rounded-full border px-2 py-1 font-medium
                                ${totalCustomersCompared >= 0
                                    ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                    : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'}`}>
                            {totalCustomersCompared >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            {Math.abs(totalCustomersCompared)}%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title">Sales</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {formatNumber(filteredStats.totalSales)} 
                            <span className="text-sm text-gray-500"> {formatNumber(lastMonthStats.totalSales)}</span>
                        </p>
                        <span
                            className={`flex w-fit items-center gap-x-2 rounded-full border px-2 py-1 font-medium
                                ${totalSalesCompared >= 0
                                    ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                    : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'}`}>
                            {totalSalesCompared >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            {Math.abs(totalSalesCompared)}%
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="flex flex-row items-center justify-between gap-x-4 px-4">
                        <div className="card-header">
                            <p className="card-title">Overview</p>
                        </div>
                        <div className="flex items-center w-fit h-[30px] gap-2 px-3 dark:text-white dark:bg-[#3B3B3B] bg-white border border-gray-300 rounded-md">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={e => setFromDate(e.target.value)}
                                className="h-full text-sm"
                                style={{ colorScheme: theme === "light" ? "light" : "dark" }}
                            />
                            <span className="dark:text-white text-gray-500 font-semibold">-</span>
                            <input
                                type="date"
                                value={toDate}
                                onChange={e => setToDate(e.target.value)}
                                className="h-full text-sm"
                                style={{ colorScheme: theme === "light" ? "light" : "dark" }}
                            />
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            {overviewData && overviewData.length > 0 ? (
                                <AreaChart
                                    data={overviewData}
                                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        cursor={false}
                                        formatter={(value) => `${formatPrice(value)}`}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        strokeWidth={0}
                                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                        tickMargin={6}
                                    />
                                    <YAxis
                                        dataKey="total"
                                        strokeWidth={0}
                                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                        tickFormatter={(value) => `${formatPrice(value)}`}
                                        tickMargin={6}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#2563eb"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 dark:text-slate-400">
                                    No data available for the selected period
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Recent Sales</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {orderData.slice(0, 20).map((sale) => {
                            const productInfo = productData.find(p => p.name === sale.products[0]?.name) || {};
                            return (
                                <div
                                    key={sale.orderId}
                                    className="flex items-center justify-between gap-x-4 py-2 pr-2"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <img
                                            src={productInfo.image || productImage}
                                            alt={sale.products[0]?.name || "Product"}
                                            className="size-11 flex-shrink-0 rounded-lg object-cover"
                                            onError={(e) => (e.target.src = "path/to/placeholder-image.jpg")}
                                            loading="lazy"
                                        />
                                        <div className="flex flex-col">
                                            <p className="font-medium text-slate-900 dark:text-slate-50">
                                                {sale.products[0]?.name || "Unknown"}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{sale.customerName}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-slate-900 dark:text-slate-50">{formatPrice(sale.totalPrice)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Top Orders</p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Product</th>
                                    <th className="table-head">Price</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {topProducts.map((product, index) => (
                                    <tr key={product.number || index} className="table-row">
                                        <td className="table-cell">{index + 1}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                />
                                                <div className="flex flex-col w-60 truncate">
                                                    <p className="truncate" title={product.name}>
                                                        {product.name}
                                                    </p>
                                                    <p>Type: {product.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">{formatPrice(product.price)}</td>
                                        <td className="table-cell">{product.status}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-2">
                                                <Star
                                                    size={18}
                                                    className="fill-yellow-600 stroke-yellow-600"
                                                />
                                                {product.rating}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;