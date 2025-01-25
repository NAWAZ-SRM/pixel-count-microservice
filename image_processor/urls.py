from django.urls import path
from .views import (
    list_images,
    store_image,
    get_selected_image,
    session_timer,
    home,
    login_view,
    logout_view,
    register_view,
)

urlpatterns = [
    path("list-images/", list_images, name="list_images"),
    path("store-image/", store_image, name="store_image"),
    path("get-selected-image/", get_selected_image, name="get_selected_image"),
    path("session-timer/", session_timer, name="session_timer"),
    path("", home, name="home"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", register_view, name="register"),
]
