from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class ProcessingView(APIView):
    def get(self, request):
        return Response({"module": "processing"})
urlpatterns = [path("processing/", ProcessingView.as_view())]
