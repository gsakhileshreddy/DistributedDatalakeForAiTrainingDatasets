from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
class NotificationsView(APIView):
    def get(self, request):
        return Response({"module": "notifications"})
urlpatterns = [path("notifications/", NotificationsView.as_view())]
