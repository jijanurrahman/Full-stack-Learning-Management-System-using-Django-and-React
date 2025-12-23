from django.contrib import admin
from .models import Category, Course, Enrollment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']
    ordering = ['name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'category', 'difficulty', 'price', 'is_published', 'created_at']
    list_filter = ['difficulty', 'is_published', 'category', 'created_at']
    search_fields = ['title', 'instructor__email', 'category__name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Course Information', {
            'fields': ('title', 'description', 'category', 'instructor')
        }),
        ('Details', {
            'fields': ('thumbnail', 'difficulty', 'duration', 'price')
        }),
        ('Publishing', {
            'fields': ('is_published',)
        }),
    )

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'status', 'progress', 'enrolled_at']
    list_filter = ['status', 'enrolled_at']
    search_fields = ['student__email', 'course__title']
    ordering = ['-enrolled_at']