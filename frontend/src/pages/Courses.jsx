import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import lmsService from '../services/lmsService';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await lmsService.getCourses();
            setCourses(data);
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600">Loading courses...</p>
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">📚 All Courses</h1>
                {user?.role === 'instructor' && (
                    <Link
                        to="/create-course"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                    >
                        ➕ Create Course
                    </Link>
                )}
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-xl text-gray-600">No courses available yet.</p>
                    {user?.role === 'instructor' && (
                        <Link
                            to="/create-course"
                            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Create Your First Course
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                        >
                            <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white text-6xl">📖</span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                                    {course.title}
                                </h3>

                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                                    {course.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="mr-1">👨‍🏫</span>
                                        <span className="line-clamp-1">{course.instructor_name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getDifficultyColor(course.difficulty)}`}>
                                        {course.difficulty}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="mr-1">👥</span>
                                        <span>{course.enrollment_count || 0} enrolled</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">⏱️</span>
                                        <span>{course.duration || 0}h</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${course.price}
                                    </span>
                                    <Link
                                        to={`/courses/${course.id}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;