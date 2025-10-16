from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User


class PasswordResetFlowTestCase(TestCase):
    """Prueba de integración para el flujo completo de restablecimiento de contraseña."""

    def setUp(self):
        # Se ejecuta antes de cada test
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="TestUser",
            email="prueba@correo.com",
            password="Password123!",
        )

    def test_password_reset_flow(self):
        """Prueba completa: solicitud + confirmación de reset de contraseña"""

        # 1️⃣ Solicitar reset (forgot password)
        reset_email_url = reverse('users:password_reset_email')
        response = self.client.post(reset_email_url, {"email": self.user.email}, format='json')

        self.assertEqual(response.status_code, 200, "El endpoint de solicitud de reset debe responder 200")

        # 2️⃣ Generar token real de restablecimiento (simulando correo)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        # 3️⃣ Enviar confirmación de cambio de contraseña
        reset_confirm_url = reverse('users:password_reset_confirm')
        response = self.client.post(reset_confirm_url, {
            "uid": uid,
            "token": token,
            "new_password": "NewPass123!"
        }, format='json')

        self.assertIn(
            response.status_code,
            [200, 202, 204],
            "El endpoint de confirmación debe responder con un estado válido (200, 202 o 204), obtuvo {response.status_code}: {response.data}"
        )

