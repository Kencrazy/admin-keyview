import { Outlet } from "react-router-dom";

import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";

import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { auth } from "../service/firebaseConfig";
import { readUserMetadata } from "../service/readFirebase";
// Pop up service


const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.uid !== localStorage.getItem("userId")) {
                    localStorage.setItem("userId", user.uid);
                }
            } else {
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const userId = localStorage.getItem("userId");

    useEffect(()=>{
        const fetchUserMetadata = async () => {
            try {
                const userMetadata = await readUserMetadata(userId);
                if (userMetadata) {
                    const userData = {
                        storeName: userMetadata.storeName,
                        email: userMetadata.email,
                        shopIcon: userMetadata.shopIcon,
                        due: userMetadata.due,
                        plan: userMetadata.plan,
                    };
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
            } catch (error) {
                console.error("Error fetching user metadata: ", error);
            }
        };
        fetchUserMetadata();
    },[])
    
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
            />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
