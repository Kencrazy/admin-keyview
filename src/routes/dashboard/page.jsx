import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { recentSalesData,recentOrders } from "@/constants";

import { Footer } from "@/layouts/footer";

import { CreditCard, DollarSign, Package, Star, TrendingUp, Users,TrendingDown } from "lucide-react";

import React,{useState,useMemo,useEffect} from "react";

import { generateOverviewData } from "../../service/interactiveCode";

import cleanQuillHtml from "../../utils/cleanQuillHtml";

const DashboardPage = ({productData,orderData}) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [topProducts,setTopProducts] = useState([]);

    // State variables for the dashboard
    const [totalProductsCompared,setTotalProductsCompared] = useState(0);
    const [totalPaidOrdersCompared,setTotalPaidOrdersCompared] = useState(0);
    const [totalCustomersCompared,setTotalCustomersCompared] = useState(0);
    const [totalSalesCompared,setTotalSalesCompared] = useState(0);

    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth(); 
        const currentYear = now.getFullYear();

        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const thisMonthOrders = orderData.filter(order => {
            const date = new Date(order.orderedDate);
            return (
                date.getFullYear() === currentYear &&
                date.getMonth() === currentMonth &&
                order.status === "Delivered"
            );
        });

        const lastMonthOrders = orderData.filter(order => {
            const date = new Date(order.orderedDate);
            return (
                date.getFullYear() === lastMonthYear &&
                date.getMonth() === lastMonth &&
                order.status === "Delivered"
            );
        });

        const getStats = (orders) => {
            const totalRevenue = orders.reduce((sum, o) => sum + o.priceEach * o.quantityOrdered, 0);
            const totalSales = orders.reduce((sum, o) => sum + o.quantityOrdered, 0);
            const totalCustomers = new Set(orders.map(o => o.customerName)).size;
            return { totalRevenue, totalSales, totalCustomers };
        };

        const thisMonthStats = getStats(thisMonthOrders);
        const lastMonthStats = getStats(lastMonthOrders);

        const percent = (current, prev) => {
            if (prev === 0 && current > 0) return 100;
            if (prev === 0 && current === 0) return 0;
            return Math.round(((current - prev) / prev) * 100);
        };

        setTotalPaidOrdersCompared(percent(thisMonthStats.totalRevenue, lastMonthStats.totalRevenue));
        setTotalSalesCompared(percent(thisMonthStats.totalSales, lastMonthStats.totalSales));
        setTotalCustomersCompared(percent(thisMonthStats.totalCustomers, lastMonthStats.totalCustomers));

        const thisMonthProducts = productData.filter(p => {
            const created = new Date(p.createdAt); 
            return created.getFullYear() === currentYear && created.getMonth() === currentMonth;
        });
        const lastMonthProducts = productData.filter(p => {
            const created = new Date(p.createdAt);
            return created.getFullYear() === lastMonthYear && created.getMonth() === lastMonth;
        });

        setTotalProductsCompared(percent(thisMonthProducts.length, lastMonthProducts.length));
    }, [orderData, productData]);

    useState(() => {
        const currentYear = new Date().getFullYear();
        setFromDate(`${currentYear}-01-01`);
        setToDate(`${currentYear}-12-31`);
    });
    const [overviewData, setOverviewData] = useState();

    useEffect(() => {
        if (!productData || productData.length === 0) setTopProducts([]);

        const sorted = [...productData]
            .sort((a, b) => {
            if (b.amount !== a.amount) {
                return b.amount - a.amount;
            }
            return b.rating - a.rating;
            });

        setTopProducts(sorted.slice(0,20))
    }, [productData]);

    useEffect(() => {
        if (orderData.length > 0) {
            const dates = orderData.map(order => new Date(order.orderedDate));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));

            const formatDate = (date) => date.toISOString().slice(0, 10); 

            setFromDate(formatDate(minDate));
            setToDate(formatDate(maxDate));
        }
    }, [orderData]);

    useEffect(() => {
        if (fromDate && toDate) {
            const data = generateOverviewData(orderData, fromDate, toDate);
            setOverviewData(data);
        }
    }, [orderData, fromDate, toDate]);

    const filteredStats = useMemo(() => {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        to.setHours(23, 59, 59, 999);

        const filtered = orderData.filter(order => {
            const orderDate = new Date(order.orderedDate);
            return (
                order.status === "Delivered" &&
                orderDate >= from &&
                orderDate <= to
            );
        });

        const totalRevenue = filtered.reduce((sum, order) => {
            return sum + order.priceEach * order.quantityOrdered;
        }, 0);

        const totalSales = filtered.reduce((sum, order) => {
            return sum + order.quantityOrdered;
        }, 0);

        const uniqueCustomers = new Set(filtered.map(order => order.customerName));

        return {
            totalRevenue,
            totalSales,
            totalCustomers: uniqueCustomers.size
        };
    }, [fromDate, toDate]);

    const formatNumber = (num) => {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num.toString();
    };

    const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{formatNumber(productData.length)}</p>
                        <span
                            className={`flex w-fit items-center gap-x-2 rounded-full border px-2 py-1 font-medium
                                ${totalProductsCompared >= 0
                                    ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400'
                                    : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400'}`}>
                            {totalProductsCompared >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            {Math.abs(totalPaidOrdersCompared)}%
                        </span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Paid Orders</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{formatNumber(filteredStats.totalRevenue.toFixed(2))}</p>
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
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{formatNumber(filteredStats.totalCustomers)}</p>
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
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{formatNumber(filteredStats.totalSales)}</p>
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
                        <div className={`flex items-center w-fit h-[30px] gap-2 px-3 dark:text-white dark:bg-[#3B3B3B] bg-white border border-gray-300 rounded-md`}>
                            <input
                            type="date"
                            value={fromDate}
                            onChange={e=>setFromDate(e.target.value)}
                            className="h-full text-sm"
                            style={{colorScheme: theme === "light" ? "light" : "dark"}}
                            />
                            <span className="dark:text-white text-gray-500 font-semibold">-</span>
                            <input
                            type="date"
                            value={toDate}
                            onChange={e=>setToDate(e.target.value)}
                            className="h-full text-sm"
                            style={{colorScheme: theme === "light" ? "light" : "dark"}}
                            />
                        </div>
                    </div>
                
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={overviewData}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `$${value}`}
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
                                    tickFormatter={(value) => `$${value}`}
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
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Recent Sales</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {orderData.slice(0,20).map((sale) => (
                            <div
                                key={sale.id}
                                className="flex items-center justify-between gap-x-4 py-2 pr-2"
                            >
                                <div className="flex items-center gap-x-4">
                                    <img
                                        src={sale.image}
                                        alt={sale.name}
                                        className="size-10 flex-shrink-0 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col gap-y-2">
                                        <p className="font-medium text-slate-900 dark:text-slate-50">{sale.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{sale.email}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">${sale.total}</p>
                            </div>
                        ))}
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
                                {topProducts.map((product) => (
                                    <tr
                                        key={product.number}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{product.number}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                />
                                                <div className="flex flex-col w-60 truncate">
                                                    <p
                                                        className="truncate"
                                                        title={product.name}
                                                    >
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
