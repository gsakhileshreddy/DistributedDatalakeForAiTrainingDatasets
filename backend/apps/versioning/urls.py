from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class VersioningView(APIView):
    def get(self, request):
        return Response({"module": "versioning"})
urlpatterns = [path("versioning/", VersioningView.as_view())]
