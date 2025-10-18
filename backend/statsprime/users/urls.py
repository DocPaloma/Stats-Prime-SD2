from django.urls import path
from .views import (
    RegisterView, PasswordResetEmailView, PasswordResetConfirmView,
    PasswordResetBySecretView, ProfileView, ChangePasswordView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

app_name = 'users'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),  # <- NUEVA
    path('password-reset-email/', PasswordResetEmailView.as_view(), name='password_reset_email'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset-secret/', PasswordResetBySecretView.as_view(), name='password_reset_secret'),
]
