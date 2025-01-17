from django.urls import path
from . import views

urlpatterns = [
    path('pixel-count/', views.get_pixel_count, name='get_pixel_count'),
]
