import React, { useState, useEffect } from 'react';
import lmsService from '../services/lmsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const data = await lmsService.getDashboardStats();
            setStats(data);
        } catch (err) {
            setError('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    const barChartData = [
        { name: 'Total Users', count: stats?.total_users || 0 },
        { name: 'Students', count: stats?.total_students || 0 },
        { name: 'Instructors', count: stats?.total_instructors || 0 },
        { name: 'Courses', count: stats?.total_courses || 0 },
    ];

    const pieChartData = [
        { name: 'Students', value: stats?.total_students || 0 },
        { name: 'Instructors', value: stats?.total_instructors || 0 },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">📊 Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                            <p className="text-4xl font-bold">{stats?.total_users || 0}</p>
                        </div>
                        <div className="text-6xl opacity-30">👥</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
                            <p className="text-4xl font-bold">{stats?.total_courses || 0}</p>
                        </div>
                        <div className="text-6xl opacity-30">📚</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Enrollments</h3>
                            <p className="text-4xl font-bold">{stats?.total_enrollments || 0}</p>
                        </div>
                        <div className="text-6xl opacity-30">✅</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Active</h3>
                            <p className="text-4xl font-bold">{stats?.active_enrollments || 0}</p>
                        </div>
                        <div className="text-6xl opacity-30">🔥</div>
                    </div>
                </div>
            </div>

            {/* Details Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">User Statistics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                            <span className="text-gray-700 font-medium">Students:</span>
                            <span className="font-bold text-blue-600 text-xl">{stats?.total_students || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <span className="text-gray-700 font-medium">Instructors:</span>
                            <span className="font-bold text-green-600 text-xl">{stats?.total_instructors || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Course Statistics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                            <span className="text-gray-700 font-medium">Total Courses:</span>
                            <span className="font-bold text-purple-600 text-xl">{stats?.total_courses || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                            <span className="text-gray-700 font-medium">Published:</span>
                            <span className="font-bold text-orange-600 text-xl">{stats?.published_courses || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Overview Bar Chart</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">User Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;