# image_processor/views.py

from io import BytesIO
import os
import numpy as np
import openslide
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.http import HttpResponse
from PIL import Image
from django.conf import settings
import xml.etree.ElementTree as ET
import json
from .openslide_helper import get_tile, initiate_tile
from django.http import HttpResponse, HttpResponseNotFound
from django.http import FileResponse

IMAGE_DIR = os.path.join("static", "images")

# ================== API Endpoints ==================


@login_required
def list_images(request):
    images = [f for f in os.listdir(IMAGE_DIR) if f.endswith(('.tiff', '.ndpi'))]
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
    return JsonResponse({"selected_image": selected_image or "None"})


def session_timer(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"expired": True, "message": "Session expired, please log in."}, status=401
        )

    time_left = request.session.get_expiry_age()
    return JsonResponse({"expired": time_left <= 0, "time_left": time_left})


@login_required(login_url='/api/login/')
def open_slide(request, level=0, row=0, col=0):
    """Fetches and returns a tile from an OpenSlide image."""
    if not request.user.is_authenticated:
        return redirect('custom_404')

    image_name = "test.ndpi"
    return get_tile(image_name, level, row, col)


@login_required(login_url='/api/404/')
def view_image(request):
    """API for OpenSeadragon viewer"""
    image_name = request.GET.get("image", "test.ndpi")
    _, width, height = initiate_tile(image_name)
    return JsonResponse({"image_name": image_name, "width": width, "height": height})


def get_annotations(request):
    """Fetch annotation data"""
    ndpa_file_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'test.ndpa')

    if not os.path.exists(ndpa_file_path):
        return JsonResponse({'error': 'Annotations file not found'}, status=404)

    with open(ndpa_file_path, 'r') as file:
        try:
            annotations = json.load(file)
        except json.JSONDecodeError:
            return JsonResponse(
                {'error': 'Invalid JSON format in annotations file'}, status=400
            )

    return JsonResponse({'annotations': annotations})


def get_annotations_xml(request):
    """Fetch annotation data from an XML file"""
    ndpa_file_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'test1.ndpa')

    if not os.path.exists(ndpa_file_path):
        return JsonResponse({'error': 'NDPA file not found'}, status=404)

    try:
        tree = ET.parse(ndpa_file_path)
        root = tree.getroot()
    except Exception as e:
        return JsonResponse({'error': f'Error parsing NDPA file: {str(e)}'}, status=500)

    annotations = []

    for annotation in root.findall('ndpviewstate'):
        title = (
            annotation.find('title').text
            if annotation.find('title') is not None
            else ''
        )
        color = (
            annotation.find('color').text
            if annotation.find('color') is not None
            else "red"
        )

        pointlist = annotation.find('pointlist')
        if pointlist is not None:
            x_vals, y_vals = [], []
            for point in pointlist.findall('point'):
                try:
                    x_vals.append(int(point.find('x').text))
                    y_vals.append(int(point.find('y').text))
                except (ValueError, TypeError):
                    continue

            if x_vals and y_vals:
                annotations.append(
                    {
                        'title': title,
                        'x': min(x_vals),
                        'y': min(y_vals),
                        'width': max(x_vals) - min(x_vals),
                        'height': max(y_vals) - min(y_vals),
                        'color': color,
                    }
                )

    return JsonResponse({'annotations': annotations})


# ================== Authentication Views ==================


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("/")  # Let React handle login
        messages.error(request, "Invalid credentials")

    return JsonResponse({"error": "Invalid credentials"}, status=400)


def logout_view(request):
    logout(request)
    return redirect("/")  # Redirect to React frontend


def register_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("/")
        messages.error(request, "Registration failed")

    return JsonResponse({"error": "Registration failed"}, status=400)


# ================== React Frontend Integration ==================


def frontend_view(request):
    index_path = os.path.join(settings.BASE_DIR, "static", "frontend", "index.html")

    if os.path.exists(index_path):
        with open(index_path, "r") as file:
            return HttpResponse(file.read())
    else:
        return HttpResponseNotFound(
            "React frontend not found. Build it using 'npm run build'"
        )
