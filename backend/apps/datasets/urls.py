from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class DatasetsView(APIView):
    def get(self, request):
        return Response({"module": "datasets"})
urlpatterns = [path("datasets/", DatasetsView.as_view())]
