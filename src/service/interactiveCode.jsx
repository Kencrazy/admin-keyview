import { parseISO, differenceInDays, differenceInYears, format, addDays, addMonths, addYears, isAfter, isEqual } from "date-fns";

export const generateOverviewData = (orderData, fromDate, toDate) => {
    // Parse and normalize dates
    let start, end;
    try {
        start = parseISO(fromDate);
        end = parseISO(toDate);
        // Ensure end date includes the full day
        end.setHours(23, 59, 59, 999);
    } catch (error) {
        console.error("Invalid date format:", fromDate, toDate, error);
        return [];
    }

    const dayDiff = differenceInDays(end, start);
    const yearDiff = differenceInYears(end, start);

    // Determine grouping based on date range
    let groupBy = "month";
    if (dayDiff <= 60) groupBy = "day";
    else if (yearDiff >= 1) groupBy = "year";

    const formatKey = (date) => {
        if (groupBy === "day") return format(date, "yyyy-MM-dd");
        if (groupBy === "month") return format(date, "MMM yyyy");
        if (groupBy === "year") return format(date, "yyyy");
    };

    const incrementDate = (date) => {
        if (groupBy === "day") return addDays(date, 1);
        if (groupBy === "month") return addMonths(date, 1);
        if (groupBy === "year") return addYears(date, 1);
    };

    // Initialize grouped data with zeros for all periods
    const grouped = {};
    let current = start;
    while (!isAfter(current, end)) {
        const key = formatKey(current);
        grouped[key] = 0;
        current = incrementDate(current);
    }

    // Sum revenue from orders within the date range
    for (const order of orderData) {
        if (order.status !== "Delivered") continue;
        let orderDate;
        try {
            orderDate = parseISO(order.orderedDate);
        } catch (error) {
            console.error("Invalid order date:", order.orderedDate, error);
            continue;
        }
        // Include orders on or before end date
        if (isAfter(orderDate, end) || isAfter(start, orderDate)) continue;

        const key = formatKey(orderDate);
        const orderRevenue = order.products.reduce(
            (sum, product) => sum + (Number(product.priceEach) || 0) * (Number(product.quantityOrdered) || 0),
            0
        );
        grouped[key] = (grouped[key] || 0) + orderRevenue;
    }

    // Convert to chart data and sort
    const chartData = Object.entries(grouped)
        .map(([name, total]) => ({ name, total: Number(total) || 0 }))
        .sort((a, b) => {
            // Sort by date, handling different formats
            const dateA = parseISO(groupBy === "month" ? `${a.name} 01` : a.name);
            const dateB = parseISO(groupBy === "month" ? `${b.name} 01` : b.name);
            return dateA - dateB;
        });

    return chartData;
};