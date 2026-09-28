from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class TrainingView(APIView):
    def get(self, request):
        return Response({"module": "training"})
urlpatterns = [path("training/", TrainingView.as_view())]
