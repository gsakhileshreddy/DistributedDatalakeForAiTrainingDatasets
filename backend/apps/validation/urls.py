from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class ValidationView(APIView):
    def get(self, request):
        return Response({"module": "validation"})
urlpatterns = [path("validation/", ValidationView.as_view())]
