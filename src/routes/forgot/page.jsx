import React,{useState} from "react";
import { useNavigate,Link } from "react-router-dom";
import { handlePasswordReset } from "../../service/authReader";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await handlePasswordReset(email);
        setSuccess("Password reset email sent successfully.");
        setError(null);
        } catch (err) {
        setError(err.message);
        setSuccess(null);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="max-w-lg w-full">
                <div
                    style={{
                        boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <h2 className="text-center text-3xl font-extrabold text-white">
                            Forgot Password
                        </h2>
                        <p className="mt-4 text-center text-gray-400">
                            Enter your email to reset your password
                        </p>
                        {error && (
                            <div className="mt-4 text-red-500 text-center">{error}</div>
                        )}
                        {success && (
                            <div className="mt-4 text-green-500 text-center">{success}</div>
                        )}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="rounded-md shadow-sm">
                                <input
                                    placeholder="Email address"
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    required
                                    autoComplete="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-400">
                                    Remembered your password?{" "}
                                    <Link
                                        to="/login"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}