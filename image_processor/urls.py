# image_processor/urls.py

from django.urls import path
from .views import (
    get_doctors,
    update_category,
    delete_annotation,
    update_annotation,
    tile_slide,
    get_image,
    tile,
)

urlpatterns = [
    # OpenSeadragon API routes
    path('tileSlide/<str:doctor>/<str:tile_slide>/', tile_slide, name='tile_slide'),
    path(
        'get_image/<str:doctor>/<str:tile_slide>/<str:annot_no>/',
        get_image,
        name='get_image',
    ),
    path(
        'tile/<str:doctor>/<str:tile_name>/<int:level>/<int:row>_<int:col>.jpeg/',
        tile,
        name='tile',
    ),
    # Folder function routes
    path('getDoctors/', get_doctors, name='get_doctors'),
    # Annotation routes
    path(
        'updateCategory/<str:doctor>/<str:tile_name>/<str:annotation_id>/',
        update_category,
        name='update_category',
    ),
    path('deleteAnnotation/', delete_annotation, name='delete_annotation'),
    path('updateAnnotation/', update_annotation, name='update_annotation'),
]
