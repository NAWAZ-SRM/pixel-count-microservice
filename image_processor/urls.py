# # image_processor/urls.py

# from django.urls import path, re_path
# from django.views.generic import TemplateView
# from django.conf import settings
# from django.conf.urls.static import static
# from django.conf import settings
# import os

# from .views import (
#     list_images,
#     store_image,
#     get_selected_image,
#     session_timer,
#     login_view,
#     logout_view,
#     register_view,
#     open_slide,
#     view_image,
#     get_annotations,
#     get_annotations_xml,
#     frontend_view,  # Keep only valid imports
# )

# BASE_DIR = settings.BASE_DIR

# urlpatterns = [
#     path("api/list-images/", list_images, name="list_images"),
#     path("api/store-image/", store_image, name="store_image"),
#     path("api/get-selected-image/", get_selected_image, name="get_selected_image"),
#     path("api/session-timer/", session_timer, name="session_timer"),
#     path("api/login/", login_view, name="login"),
#     path("api/logout/", logout_view, name="logout"),
#     path("api/register/", register_view, name="register"),
#     path(
#         "api/open-slide/<int:level>/<int:row>/<int:col>/", open_slide, name="open_slide"
#     ),
#     path("api/view_image/", view_image, name="view_image"),
#     path("api/annotations/", get_annotations, name="get_annotations"),
#     path("api/annotations-xml/", get_annotations_xml, name="annotations_xml"),
#     # Serve React Frontend
#     re_path(r"^.*$", TemplateView.as_view(template_name="index.html"), name="frontend"),
# ]

# if settings.DEBUG:
#     urlpatterns += static(
#         settings.STATIC_URL, document_root=os.path.join(BASE_DIR, "static")
#     )

from django.urls import path
from .views import (
    get_doctors, update_category, delete_annotation, update_annotation,
    tile_slide, get_image, tile
)

urlpatterns = [
    # OpenSeadragon API routes
    path('tileSlide/<str:doctor>/<str:tile_slide>/', tile_slide, name='tile_slide'),
    path('get_image/<str:doctor>/<str:tile_slide>/<str:annot_no>/', get_image, name='get_image'),
    path('tile/<str:doctor>/<str:tile_name>/<int:level>/<int:row>_<int:col>.jpeg/', tile, name='tile'),

    # Folder function routes
    path('getDoctors/', get_doctors, name='get_doctors'),

    # Annotation routes
    path('updateCategory/<str:doctor>/<str:tile_name>/<str:annotation_id>/', update_category, name='update_category'),
    path('deleteAnnotation/', delete_annotation, name='delete_annotation'),
    path('updateAnnotation/', update_annotation, name='update_annotation'),
]
