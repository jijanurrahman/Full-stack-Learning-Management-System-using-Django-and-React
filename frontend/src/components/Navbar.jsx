import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
                        🎓 LMS Platform
                    </Link>

                    <div className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/courses" className="hover:text-blue-200 transition">
                                    Courses
                                </Link>

                                <>
                                    <Link to="/dashboard" className="hover:text-blue-200 transition">
                                        Dashboard
                                    </Link>
                                </>

                                <>
                                    <Link to="/create-course" className="hover:text-blue-200 transition">
                                        Create Course
                                    </Link>
                                </>



                                <Link to="/profile" className="hover:text-blue-200 transition">
                                    Profile
                                </Link>

                                <div className="flex items-center space-x-3">
                                    <div className="text-sm">
                                        <div className="font-semibold">{user?.full_name || user?.first_name}</div>
                                        <span className="text-xs bg-blue-700 px-2 py-0.5 rounded capitalize">
                                            {user?.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-blue-200 transition">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition duration-200"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;