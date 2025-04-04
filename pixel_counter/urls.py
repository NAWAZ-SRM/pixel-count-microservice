# pixel_counter/urls.py


"""URL configuration for pixel_counter project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path, re_path
from django.shortcuts import redirect
from django.contrib import admin
from django.views.generic import TemplateView
from image_processor.views import frontend_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/', include('image_processor.urls')),  # API routes
    path('', frontend_view, name='frontend'),
    re_path(r'^(?!api/(?!login|signup)).*', frontend_view, name='frontend-catchall'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
