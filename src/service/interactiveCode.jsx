import { parseISO, differenceInDays, differenceInYears, format, addDays, addMonths, addYears, isBefore } from "date-fns";

export const generateOverviewData = (orderDate, fromDate, toDate) => {
    const start = parseISO(fromDate);
    const end = parseISO(toDate);
    const dayDiff = differenceInDays(end, start);
    const yearDiff = differenceInYears(end, start);

    let groupBy = "month";
    if (dayDiff <= 60) groupBy = "day";
    else if (yearDiff >= 1) groupBy = "year";

    const formatKey = (date) => {
        if (groupBy === "day") return format(date, "yyyy-MM-dd");
        if (groupBy === "month") return format(date, "MMM");
        if (groupBy === "year") return format(date, "yyyy");
    };

    const incrementDate = (date) => {
        if (groupBy === "day") return addDays(date, 1);
        if (groupBy === "month") return addMonths(date, 1);
        if (groupBy === "year") return addYears(date, 1);
    };

    const grouped = {};
    let current = start;
    while (!isBefore(end, current)) {
        const key = formatKey(current);
        grouped[key] = 0;
        current = incrementDate(current);
    }

    for (const order of orderDate) {
        if (order.status !== "Delivered") continue;
        const orderDate = parseISO(order.orderedDate);
        const key = formatKey(orderDate);
        if (!grouped[key]) grouped[key] = 0;
        grouped[key] += order.priceEach * order.quantityOrdered;
    }

    const chartData = Object.entries(grouped)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => new Date(a.name) - new Date(b.name));

    return chartData;
};
