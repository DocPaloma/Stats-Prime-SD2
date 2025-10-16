import pytest
from django.urls import reverse
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestAuthFlow:

    def setup_method(self):
        self.client = APIClient()

    def test_register_and_login(self):
        # Registro
        register_url = reverse('users:register')
        payload = {
            "email": "nuevo@correo.com",
            "password": "StrongPass123!",
            "name": "Usuario Test"
        }
        res = self.client.post(register_url, payload, format='json')
        assert res.status_code == 201, res.data
        assert "email" in res.data

        # Login
        login_url = reverse('users:token_obtain_pair')
        login_payload = {
            "email": "nuevo@correo.com",
            "password": "StrongPass123!"
        }
        res = self.client.post(login_url, login_payload, format='json')
        assert res.status_code == 200, res.data
        assert "access" in res.data
        assert "refresh" in res.data
