import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User

@pytest.mark.django_db
class TestPasswordResetFlow:

    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="prueba@correo.com",
            password="Password123!",
            name="TestUser"
        )

    def test_password_reset_flow(self):
        # Solicitar reset (forgot password)
        reset_email_url = reverse('users:password_reset_email')
        res = self.client.post(reset_email_url, {"email": self.user.email}, format='json')
        assert res.status_code == 200

        # (Simulamos obtención del token que normalmente se enviaría por correo)
        # Supongamos que el endpoint de confirmación recibe token + new_password
        reset_confirm_url = reverse('users:password_reset_confirm')
        res = self.client.post(reset_confirm_url, {
            "email": self.user.email,
            "token": "mock-token",
            "new_password": "NewPass123!"
        }, format='json')

        # Esperamos que responda OK o 202 dependiendo de tu lógica
        assert res.status_code in [200, 202, 204]
