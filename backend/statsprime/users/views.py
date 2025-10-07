from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from .serializers import UserRegisterSerializer, ProfileSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]
    
class PasswordResetEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email requerido."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": "Si existe una cuenta con ese email, recibirá instrucciones."})

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{request.scheme}://{request.get_host()}/reset-password-confirm/?uid={uid}&token={token}"
        subject = "Reset de contraseña - StatsPrime"
        message = f"Usa el siguiente enlace para cambiar tu contraseña: {reset_link}\n\nSi no solicitaste esto, ignora este mensaje."
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
        return Response({"detail": "Si existe una cuenta con ese email, recibirá instrucciones."})
    
class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        if not uidb64 or not token or not new_password:
            return Response({"detail": "uid, token y new_password requeridos."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Token inválido."}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Token inválido o expirado."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Contraseña actualizada."})
    
class PasswordResetBySecretView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier')
        if not identifier:
            return Response({"detail": "identificador requerido (username o email)."}, status=400)
        try:
            user = User.objects.get(username__iexact=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email__iexact=identifier)
            except User.DoesNotExist:
                return Response({"detail": "No existe usuario con ese identificador."}, status=400)
        if not user.secret_question:
            return Response({"detail": "Este usuario no tiene pregunta secreta configurada."}, status=400)
        return Response({"secret_question": user.secret_question})


    def put(self, request):
        identifier = request.data.get('identifier')
        answer = request.data.get('answer')
        new_password = request.data.get('new_password')
        if not identifier or not answer or not new_password:
            return Response({"detail": "identifier, answer y new_password requeridos."}, status=400)
        try:
            user = User.objects.get(username__iexact=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email__iexact=identifier)
            except User.DoesNotExist:
                return Response({"detail": "No existe usuario con ese identificador."}, status=400)
        if user.check_secret_answer(answer):
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Contraseña actualizada."})
        return Response({"detail": "Respuesta secreta incorrecta."}, status=400)