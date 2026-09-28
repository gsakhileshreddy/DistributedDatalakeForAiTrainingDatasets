from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class StorageView(APIView):
    def get(self, request):
        return Response({"module": "storage"})
urlpatterns = [path("storage/", StorageView.as_view())]
