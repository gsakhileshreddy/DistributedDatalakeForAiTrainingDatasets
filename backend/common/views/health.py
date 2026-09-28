"""Health & Readiness Views"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "healthy", "service": "Distributed Data Lake API"}, status=status.HTTP_200_OK)

class ReadinessCheckView(APIView):
    def get(self, request):
        return Response({"status": "ready"}, status=status.HTTP_200_OK)
