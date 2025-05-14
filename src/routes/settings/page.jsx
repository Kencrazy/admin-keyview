import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { handleSignOut,handlePasswordReset } from "../../service/authReader";
export default function SettingsPage() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const { name, email } = userData;
    const [emailVerified, setEmailVerified] = useState(false);
    const [twoStepEnabled, setTwoStepEnabled] = useState(true);

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-fit text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
                {/* Email */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="font-semibold">Email address</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            The email address associated with your account.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">{email}</p>
                        <button className="text-blue-500 text-sm ml-2 hover:underline">{name} ✎</button>
                    </div>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="font-semibold">Password</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Set a unique password to protect your account.
                        </p>
                    </div>
                    <button onClick={()=>handlePasswordReset(email)} className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                        Change Password
                    </button>
                </div>

                {/* 2-Step Verification */}
                {/* <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="font-semibold">2-step verification</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Make your account extra secure. Along with your password, you'll need to enter a code.
                        </p>
                    </div>
                    <Switch
                        checked={twoStepEnabled}
                        onChange={setTwoStepEnabled}
                        className={`${twoStepEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                        <span
                            className={`${
                                twoStepEnabled ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </Switch>
                </div> */}

                {/* Deactivate Account */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="font-semibold">Log out</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            This will shut down your account. Your account will be reactive when you sign in again.
                        </p>
                    </div>
                    <button onClick={()=>handleSignOut(navigate)} className="text-blue-500 text-sm hover:underline">Deactivate</button>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <p className="font-semibold">Delete Account</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            This will delete your account. Your account will be permanently deleted from Prodeel.
                        </p>
                    </div>
                    <button className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
            </div>
        </div>
    );
}
