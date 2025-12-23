from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, CourseViewSet, EnrollmentViewSet,
    DashboardStatsView, EnrollmentReportView, CourseReportView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('reports/enrollments/', EnrollmentReportView.as_view(), name='enrollment-report'),
    path('reports/courses/', CourseReportView.as_view(), name='course-report'),
]