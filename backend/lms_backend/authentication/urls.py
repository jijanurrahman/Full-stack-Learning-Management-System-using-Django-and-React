from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserLogoutView,
    ProfileView, ForgetPasswordView, ResetPasswordView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('forget-password/', ForgetPasswordView.as_view(), name='forget-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]