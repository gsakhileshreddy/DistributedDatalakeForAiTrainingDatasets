from django.urls import path
from rest_framework.response import Response
from rest_framework.views import APIView

class StubView(APIView):
    def get(self, request):
        return Response({"status": "active", "module": "accounts"})

urlpatterns = [
    path('auth/login/', StubView.as_view(), name='auth-login'),
]
