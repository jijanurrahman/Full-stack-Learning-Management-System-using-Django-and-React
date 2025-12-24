import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import lmsService from '../services/lmsService';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [error, setError] = useState('');
    const [enrollStatus, setEnrollStatus] = useState('');

    useEffect(() => {
        fetchCourseDataset();
    }, [id]);

    const fetchCourseDataset = async () => {
        try {
            const data = await lmsService.getCourse(id);
            setCourse(data);
            if (data.is_enrolled) {
                setEnrollStatus('success');
            }
        } catch (err) {
            setError('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setEnrollLoading(true);
        try {
            await lmsService.enrollInCourse(id);
            setEnrollStatus('success');
            // Refresh course data to update enrollment count (if API returns it)
            fetchCourseDataset();
        } catch (err) {
            setEnrollStatus('error');
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await lmsService.deleteCourse(id);
                navigate('/courses');
            } catch (err) {
                alert('Failed to delete course');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !course) return (
        <div className="container mx-auto px-4 py-8 text-center text-red-600">
            {error || 'Course not found'}
        </div>
    );

    const isInstructor = user?.role === 'instructor' && user?.id === course.instructor;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-blue-600 text-white p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-700 rounded-full text-sm font-semibold mb-4">
                                {course.category_name || 'General'}
                            </span>
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-blue-100 text-lg">{course.description}</p>
                        </div>
                        <div className="bg-white text-blue-900 px-6 py-4 rounded-lg font-bold text-2xl shadow-lg">
                            ${course.price}
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {course.description}
                                {/* In a real app, this might be a longer rich text field */}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <p className="text-gray-500 italic text-center">
                                    Lesson content listing would appear here.
                                    <br />
                                    (Currently placeholder for demo)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Course Features</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center">
                                    <span className="mr-3">⏱️</span>
                                    {course.duration} Hours Duration
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-3">📊</span>
                                    {course.difficulty} Level
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-3">👨‍🏫</span>
                                    Instructor: {course.instructor_name}
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-3">👥</span>
                                    {course.enrollment_count} Enrolled
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        {isInstructor ? (
                            <div className="space-y-3">
                                <Link
                                    to={`/edit-course/${course.id}`}
                                    className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                                >
                                    Edit Course
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                                >
                                    Delete Course
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {enrollStatus === 'success' ? (
                                    <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-bold">
                                        ✅ You are enrolled in this course
                                    </div>
                                ) : enrollStatus === 'error' ? (
                                    <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                                        Failed to enroll. You might already be enrolled.
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrollLoading}
                                        className={`block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-md transition transform hover:-translate-y-1 ${enrollLoading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {enrollLoading ? 'Processing...' : 'Enroll Now'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
