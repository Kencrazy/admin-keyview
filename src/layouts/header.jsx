import { useTheme } from "@/hooks/use-theme";

import { Bell, ChevronsLeft, Moon,Sun,ShoppingCart } from "lucide-react";

import profileImg from "@/assets/avatar.png";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Plan from "../components/payup";
import { readImageFirebase } from "../service/readFirebase";

export const Header = ({ collapsed, setCollapsed }) => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const [profile, setProfileImg] = useState(profileImg);
    const { avatar,due,plan } = userData;
    useEffect(() => {
        const fetchImage = async () => {
            if (avatar) {
                const imageUrl = await readImageFirebase(avatar);
                setProfileImg(imageUrl );
            }
        };
        fetchImage();
    }
    , [avatar]);
    const { theme, setTheme } = useTheme();
    const [display,setDisplay]=useState(false)

    const remainingDays = due && plan ? Math.max(0, Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24))) : null;

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <ShoppingCart
                        size={20}
                        className="text-slate-300"
                    />
                    <button onClick={() => setDisplay(!display)} className="cursor-pointer">
                        Plan your next update in {remainingDays !== null ? remainingDays : "N/A"} days
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="size-10 overflow-hidden rounded-full">
                    <img
                        src={profile && profile}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                </button>
            </div>

            {/* Pop up pay up */}
            {display && (
                <Plan />
            )}
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
