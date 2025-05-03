import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";
import Shopee from "@/assets/shopee.png"

// Nav bar
export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
            {
                label: "Analytics",
                icon: ChartColumn,
                path: "/analytics",
            },
            {
                label: "Reports",
                icon: NotepadText,
                path: "/reports",
            },
        ],
    },
    {
        title: "Customers",
        links: [
            {
                label: "Customers",
                icon: Users,
                path: "/customers",
            }
        ],
    },
    {
        title: "Products",
        links: [
            {
                label: "Products",
                icon: Package,
                path: "/products",
            }
        ],
    },
    {
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/settings",
            },
        ],
    },
];

// Dashboard
export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];

// Analytics
export const orderTime = [
    {
        time: "08:00 AM - 10:00 AM",
        totalOrders: 15,
    },
    {
        time: "10:00 AM - 12:00 PM",
        totalOrders: 25,
    },
    {
        time: "12:00 PM - 02:00 PM",
        totalOrders: 40,
    },
    {
        time: "02:00 PM - 04:00 PM",
        totalOrders: 30,
    },
    {
        time: "04:00 PM - 06:00 PM",
        totalOrders: 20,
    },
    {
        time: "06:00 PM - 08:00 PM",
        totalOrders: 35,
    },
    {
        time: "08:00 PM - 10:00 PM",
        totalOrders: 50,
    },
    {
        time:"10:00 PM - 12:00 AM",
        totalOrders: 0
    }
];

export const listOfIntegrations = [
    {
        number: 1,
        name: "Shopee",
        image: Shopee,
        description: "Trading offer",
        totalSales: 100000,
        sales: 10000000,
        rating: 4.5,
    }
]

export const feedback = [
    {
        id: 1,
        user: {
            name: "Alice Johnson",
            email: "alice.johnson@email.com",
            image: ProfileImage,
        },
        message: "The dashboard is very user-friendly and intuitive. Great job!",
        rating: 5,
        date: "2023-10-01",
    },
    {
        id: 2,
        user: {
            name: "Michael Brown",
            email: "michael.brown@email.com",
            image: ProfileImage,
        },
        message: "I love the analytics feature, but I think the reports section could use some improvement.",
        rating: 4,
        date: "2023-10-02",
    },
    {
        id: 3,
        user: {
            name: "Sophia Davis",
            email: "sophia.davis@email.com",
            image: ProfileImage,
        },
        message: "The inventory management tool is a lifesaver. Thank you!",
        rating: 5,
        date: "2023-10-03",
    },
    {
        id: 4,
        user: {
            name: "Liam Wilson",
            email: "liam.wilson@email.com",
            image: ProfileImage,
        },
        message: "I encountered a bug while adding a new product. Please look into it.",
        rating: 3,
        date: "2023-10-04",
    },
    {
        id: 5,
        user: {
            name: "Emma Martinez",
            email: "emma.martinez@email.com",
            image: ProfileImage,
        },
        message: "The customer management feature is excellent. Keep up the good work!",
        rating: 5,
        date: "2023-10-05",
    },
    {
        id: 6,
        user: {
            name: "Noah Anderson",
            email: "noah.anderson@email.com",
            image: ProfileImage,
        },
        message: "The UI is clean, but the loading time could be improved.",
        rating: 4,
        date: "2023-10-06",
    },
    {
        id: 7,
        user: {
            name: "Isabella Thomas",
            email: "isabella.thomas@email.com",
            image: ProfileImage,
        },
        message: "I appreciate the quick support response. Great team!",
        rating: 5,
        date: "2023-10-07",
    },
];

// Reports
//Nếu ở trong firebase thì products sẽ là một mảng, và khi gọi vào thì sẽ phải dùng map để lấy ra từng sản phẩm trong mảng đó, để dễ hơn cho phần report
export const recentOrders = [
    {
        orderId: "ORD1001",
        customerName: "Alice Johnson",
        products: "Wireless Mouse",
        quantityOrdered: 2,
        priceEach: 25.99,
        status: "Delivered",
        orderedDate: "2025-04-28T14:23",
        address: "123 Maple St, Springfield",
        phoneNumber: "555-123-4567",
    },
    {
        orderId: "ORD1001",
        customerName: "Alice Johnson",
        products: "Laptop Stand",
        quantityOrdered: 1,
        priceEach: 39.99,
        status: "Delivered",
        orderedDate: "2025-04-28T14:23",
        address: "123 Maple St, Springfield",
        phoneNumber: "555-123-4567",
    },
    {
        orderId: "ORD1002",
        customerName: "Bob Smith",
        products: "Bluetooth Headphones",
        quantityOrdered: 1,
        priceEach: 59.99,
        status: "On delivery",
        orderedDate: "2025-04-28T15:45",
        address: "456 Oak Ave, Rivertown",
        phoneNumber: "555-234-5678",
    },
    {
        orderId: "ORD1003",
        customerName: "Carol White",
        products: "USB-C Charger",
        quantityOrdered: 3,
        priceEach: 19.99,
        status: "Cancelled",
        orderedDate: "2025-04-27T10:12",
        address: "789 Pine Rd, Lakeview",
        phoneNumber: "555-345-6789",
    },
    {
        orderId: "ORD1004",
        customerName: "David Lee",
        products: "Mechanical Keyboard",
        quantityOrdered: 1,
        priceEach: 89.99,
        status: "On delivery",
        orderedDate: "2025-04-28T16:30",
        address: "321 Birch Ln, Hilltown",
        phoneNumber: "555-456-7890",
    },
    {
        orderId: "ORD1005",
        customerName: "Eva Green",
        products: "Smartphone Case",
        quantityOrdered: 2,
        priceEach: 15.99,
        status: "Delivered",
        orderedDate: "2025-04-27T09:50",
        address: "654 Cedar St, Brookfield",
        phoneNumber: "555-567-8901",
    },
    {
        orderId: "ORD1006",
        customerName: "Frank Moore",
        products: "Gaming Mousepad",
        quantityOrdered: 1,
        priceEach: 12.99,
        status: "Cancelled",
        orderedDate: "2025-04-26T13:15",
        address: "987 Elm St, Greenfield",
        phoneNumber: "555-678-9012",
    },
    {
        orderId: "ORD1007",
        customerName: "Grace Kim",
        products: "External Hard Drive",
        quantityOrdered: 1,
        priceEach: 79.99,
        status: "Delivered",
        orderedDate: "2025-04-25T11:40",
        address: "159 Spruce Rd, Fairview",
        phoneNumber: "555-789-0123",
    },
    {
        orderId: "ORD1008",
        customerName: "Henry Adams",
        products: "Wireless Keyboard",
        quantityOrdered: 1,
        priceEach: 49.99,
        status: "On delivery",
        orderedDate: "2025-04-28T17:05",
        address: "753 Willow St, Lakeside",
        phoneNumber: "555-890-1234",
    },
    {
        orderId: "ORD1009",
        customerName: "Ivy Turner",
        products: "USB Hub",
        quantityOrdered: 2,
        priceEach: 22.99,
        status: "Delivered",
        orderedDate: "2025-04-27T14:55",
        address: "852 Aspen Ave, Riverview",
        phoneNumber: "555-901-2345",
    },
    {
        orderId: "ORD1010",
        customerName: "Jack Wilson",
        products: "Smartwatch",
        quantityOrdered: 1,
        priceEach: 199.99,
        status: "On delivery",
        orderedDate: "2025-04-28T18:20",
        address: "951 Chestnut Blvd, Midtown",
        phoneNumber: "555-012-3456",
    },
    {
        orderId: "ORD1011",
        customerName: "Karen Young",
        products: "Portable Speaker",
        quantityOrdered: 1,
        priceEach: 45.99,
        status: "Delivered",
        orderedDate: "2025-04-26T12:10",
        address: "357 Poplar St, Eastwood",
        phoneNumber: "555-123-9876",
    },
    {
        orderId: "ORD1012",
        customerName: "Leo Martinez",
        products: "Fitness Tracker",
        quantityOrdered: 1,
        priceEach: 69.99,
        status: "Cancelled",
        orderedDate: "2025-04-25T15:30",
        address: "468 Fir Ln, Westfield",
        phoneNumber: "555-234-8765",
    },
    {
        orderId: "ORD1013",
        customerName: "Mia Clark",
        products: "Noise Cancelling Headphones",
        quantityOrdered: 1,
        priceEach: 129.99,
        status: "Delivered",
        orderedDate: "2025-04-27T16:45",
        address: "579 Maple Dr, Southtown",
        phoneNumber: "555-345-7654",
    },
    {
        orderId: "ORD1014",
        customerName: "Nathan Scott",
        products: "Laptop Backpack",
        quantityOrdered: 1,
        priceEach: 59.99,
        status: "On delivery",
        orderedDate: "2025-04-28T13:50",
        address: "680 Oak St, Northville",
        phoneNumber: "555-456-6543",
    },
    {
        orderId: "ORD1015",
        customerName: "Olivia Harris",
        products: "Wireless Charger",
        quantityOrdered: 2,
        priceEach: 29.99,
        status: "Delivered",
        orderedDate: "2025-04-26T10:05",
        address: "791 Pine Ln, Eastside",
        phoneNumber: "555-567-5432",
    },
    {
        orderId: "ORD1016",
        customerName: "Paul Walker",
        products: "Action Camera",
        quantityOrdered: 1,
        priceEach: 149.99,
        status: "Cancelled",
        orderedDate: "2025-04-25T09:20",
        address: "892 Birch Rd, Westside",
        phoneNumber: "555-678-4321",
    },
    {
        orderId: "ORD1017",
        customerName: "Quinn Baker",
        products: "Tablet",
        quantityOrdered: 1,
        priceEach: 299.99,
        status: "Delivered",
        orderedDate: "2025-04-27T11:35",
        address: "993 Cedar St, Uptown",
        phoneNumber: "555-789-3210",
    },
    {
        orderId: "ORD1018",
        customerName: "Rachel Evans",
        products: "E-reader",
        quantityOrdered: 1,
        priceEach: 89.99,
        status: "On delivery",
        orderedDate: "2025-04-28T12:40",
        address: "104 Spruce Ave, Downtown",
        phoneNumber: "555-890-2109",
    },
    {
        orderId: "ORD1019",
        customerName: "Sam Foster",
        products: "Wireless Earbuds",
        quantityOrdered: 2,
        priceEach: 49.99,
        status: "Delivered",
        orderedDate: "2025-04-26T14:25",
        address: "205 Willow Rd, Midtown",
        phoneNumber: "555-901-1098",
    },
    {
        orderId: "ORD1020",
        customerName: "Tina Gray",
        products: "Smart Home Hub",
        quantityOrdered: 1,
        priceEach: 129.99,
        status: "On delivery",
        orderedDate: "2025-04-28T19:10",
        address: "306 Chestnut Blvd, Lakeshore",
        phoneNumber: "555-012-9987",
    },
    {
        orderId: "ORD1020",
        customerName: "Tina Gray",
        products: "Wireless Earbuds",
        quantityOrdered: 1,
        priceEach: 49.99,
        status: "On delivery",
        orderedDate: "2025-04-28T19:10",
        address: "306 Chestnut Blvd, Lakeshore",
        phoneNumber: "555-012-9987",
    }
];

// Footer
export const privacyPolicy = [
    {
      title: "Introduction",
      content: `Welcome to KeyView! This Privacy Policy explains how we collect, use, and protect your personal information when you use our shop dashboard platform. By accessing or using KeyView, you agree to the terms outlined in this policy.`
    },
    {
      title: "Information We Collect",
      content: `We collect information to provide better services to all users. This includes:
      - Personal Information: name, email, contact details
      - Account Data: username, password (hashed), role
      - Activity Logs: login times, dashboard usage
      - Device Info: browser type, IP address, cookies`
    },
    {
      title: "How We Use Your Information",
      content: `KeyView uses your data to:
      - Operate and maintain the dashboard
      - Provide support and improve functionality
      - Send important updates or notifications
      - Monitor performance and detect security threats`
    },
    {
      title: "Sharing of Information",
      content: `We do not sell or rent your data. We may share your information only with:
      - Service providers who assist in operations
      - Legal authorities when required by law
      - Analytics tools (non-personal data only)`
    },
    {
      title: "Data Security",
      content: `We take reasonable precautions to protect your data using encryption, secure storage, and restricted access. However, no method is 100% secure — use the service responsibly.`
    },
    {
      title: "Your Rights",
      content: `You have the right to:
      - Access and review your personal data
      - Correct or delete inaccurate information
      - Withdraw consent for data processing (where applicable)`
    },
    {
      title: "Cookies",
      content: `KeyView uses cookies to enhance your experience, remember preferences, and collect analytics. You can manage cookie settings in your browser.`
    },
    {
      title: "Policy Changes",
      content: `We may update this Privacy Policy occasionally. Any major changes will be notified on the dashboard. Continued use of KeyView means you accept the changes.`
    },
    {
      title: "Contact Us",
      content: `For questions, feedback, or privacy concerns, please contact us at lienquanaren@gmail.com or through the feedback form on the Settings.`
    }
];

export const termsOfService = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using KeyView, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not use the platform.`
    },
    {
      title: "User Accounts",
      content: `To use certain features of KeyView, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and all activities under your account.`
    },
    {
      title: "Use of the Service",
      content: `You agree to use KeyView only for lawful purposes and in accordance with these Terms. You must not:
      - Access or use data not intended for you
      - Interfere with the platform’s security
      - Upload or transmit malicious code or spam
      - Violate any applicable laws`
    },
    {
      title: "Modifications to the Service",
      content: `We reserve the right to modify, suspend, or discontinue any part of KeyView at any time without notice. We are not liable for any inconvenience or loss this may cause.`
    },
    {
      title: "Termination",
      content: `We may suspend or terminate your access to KeyView at our sole discretion, with or without notice, if we believe you've violated these Terms.`
    },
    {
      title: "Intellectual Property",
      content: `All content, features, and functionality of KeyView are the property of KeyView and its licensors. You may not copy, modify, distribute, or reverse-engineer any part of the service.`
    },
    {
      title: "Disclaimers",
      content: `KeyView is provided "as is" and "as available". We do not guarantee that the service will be uninterrupted, secure, or error-free. Use at your own risk.`
    },
    {
      title: "Limitation of Liability",
      content: `To the maximum extent permitted by law, KeyView shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the service.`
    },
    {
      title: "Governing Law",
      content: `These Terms are governed by and construed in accordance with the laws of your local jurisdiction, without regard to conflict of law principles.`
    },
    {
      title: "Contact",
      content: `If you have questions about these Terms, contact us at support@keyview.app or through the contact form in your dashboard.`
    }
];  