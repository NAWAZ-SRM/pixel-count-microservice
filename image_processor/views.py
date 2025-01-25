from django.http import JsonResponse
from PIL import Image

# import requests
# from io import BytesIO
import os
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.utils import timezone

IMAGE_DIR = os.path.join("static", "images")


@login_required
def list_images(request):
    images = [f for f in os.listdir(IMAGE_DIR) if f.endswith(('.tiff', '.png'))]
    return JsonResponse({"images": images})


@login_required
@csrf_exempt
def store_image(request):
    if request.method == "POST":
        selected_image = request.POST.get("image")
        if selected_image:
            request.session["selected_image"] = selected_image
            request.session.modified = True
            return JsonResponse({"message": "Image stored in session."})
        return JsonResponse({"error": "No image provided."}, status=400)


@login_required
def get_selected_image(request):
    selected_image = request.session.get("selected_image")
    if selected_image:
        return JsonResponse({"selected_image": selected_image})
    else:
        # If no selected image, either because session expired or nothing was selected
        request.session["selected_image"] = None  # Clear the session data if expired
        return JsonResponse(
            {"selected_image": "None"}, status=200
        )  # Return "None" if no image selected


def session_timer(request):
    # Check if the session has expired
    if not request.user.is_authenticated:
        return JsonResponse(
            {"expired": True, "message": "Session expired, please log in."}, status=401
        )

    # Calculate the time left for the session to expire
    time_left = request.session.get_expiry_age()

    # If session has expired, return the expired status
    if time_left <= 0:
        return JsonResponse(
            {"expired": True, "message": "Session expired, please log in."}
        )

    return JsonResponse({"expired": False, "time_left": time_left})


def home(request):
    return render(request, 'index.html', {'user': request.user})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("home")  # Redirect to the home page after login
        else:
            messages.error(request, "Invalid credentials")
    else:
        form = AuthenticationForm()

    return render(request, "login.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("home")  # Redirect to home page after logging out


def register_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Automatically log in after registration
            return redirect("home")
        else:
            messages.error(request, "Registration failed. Please try again.")
    else:
        form = UserCreationForm()

    return render(request, "register.html", {"form": form})
