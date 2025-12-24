from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from django.db.models import Count, Q

from .models import Category, Course, Enrollment
from authentication.models import User
from .serializers import (
    CategorySerializer, CourseSerializer, CourseCreateUpdateSerializer,
    EnrollmentSerializer, DashboardStatsSerializer
)
from .permissions import IsAdminOrInstructor, IsAdmin, IsStudent, IsOwnerOrAdmin


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminOrInstructor]
        return [permission() for permission in permission_classes]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseCreateUpdateSerializer
        return CourseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated, IsAdminOrInstructor]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Course.objects.select_related('instructor', 'category').annotate(
            annotated_enrollment_count=Count('enrollments')
        )

        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return queryset

        q_filter = Q(is_published=True)

        if self.request.user.is_authenticated and self.request.user.role == 'instructor':
            q_filter |= Q(instructor=self.request.user)
            
        return queryset.filter(q_filter)
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        if request.user.role == 'instructor':
            courses = Course.objects.filter(instructor=request.user).annotate(
                annotated_enrollment_count=Count('enrollments')
            )
        elif request.user.role == 'student':
            enrollments = Enrollment.objects.filter(student=request.user)
            courses = Course.objects.filter(enrollments__in=enrollments).annotate(
                annotated_enrollment_count=Count('enrollments')
            )
        else:
            courses = Course.objects.none()
        
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Enrollment.objects.select_related('student', 'course', 'course__instructor')
        
        if self.request.user.role == 'student':
            queryset = queryset.filter(student=self.request.user)
        elif self.request.user.role == 'instructor':
            queryset = queryset.filter(course__instructor=self.request.user)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'total_students': User.objects.filter(role='student').count(),
            'total_instructors': User.objects.filter(role='instructor').count(),
            'total_courses': Course.objects.count(),
            'total_enrollments': Enrollment.objects.count(),
            'published_courses': Course.objects.filter(is_published=True).count(),
            'active_enrollments': Enrollment.objects.filter(status='active').count(),
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EnrollmentReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        enrollments = Enrollment.objects.select_related(
            'student', 'course', 'course__instructor'
        ).order_by('-enrolled_at')
        
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrInstructor]
    
    def get(self, request):
        courses = Course.objects.select_related('instructor', 'category').annotate(
            annotated_enrollment_count=Count('enrollments')
        ).order_by('-created_at')
        
        if request.user.role == 'instructor':
            courses = courses.filter(instructor=request.user)
        
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)