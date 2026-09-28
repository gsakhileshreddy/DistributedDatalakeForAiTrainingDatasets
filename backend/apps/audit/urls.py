from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class AuditView(APIView):
    def get(self, request):
        return Response({"module": "audit"})
urlpatterns = [path("audit/", AuditView.as_view())]
