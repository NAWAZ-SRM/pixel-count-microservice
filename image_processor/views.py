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
from django.views.decorators.csrf import csrf_exempt
from .openslide_helper import get_tile, initiate_tile
import json
from django.http import JsonResponse
from django.conf import settings
import xml.etree.ElementTree as ET

IMAGE_DIR = os.path.join("static", "images")


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


@login_required(login_url='/api/login/')
def home(request):
    if not request.user.is_authenticated:
        # If the user is not logged in, render the custom 404 page
        return redirect('login')
    return render(request, 'index.html', {'user': request.user})


def custom_404(request):
    return render(request, '404.html')


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


# @login_required(login_url='/api/404/')
# def open_slide(request):
#     if not request.user.is_authenticated:
#         # If the user is not logged in, render the custom 404 page
#         return redirect('custom_404')
#     image_name = "test.ndpi"
#     image_path = os.path.join(IMAGE_DIR, image_name)
#     print(image_path)
#     if not os.path.exists(image_path):
#         return HttpResponse("Image not found.", status=404)

#     slide = openslide.OpenSlide(image_path)

#     width, height = slide.dimensions
#     print(f"Image dimensions: {width} x {height}")

#     #  a x*x pixel region from the top-left corner
#     region_width = 6000
#     region_height = 6000

#     # Adjust region size to avoid reading beyond the image boundaries
#     region_width = min(region_width, width)
#     region_height = min(region_height, height)

#     # Read a small region
#     region = slide.read_region((0, 0), 0, (region_width, region_height))

#     # conversion to image object
#     image_io = BytesIO()
#     region.save(image_io, format='PNG')
#     image_io.seek(0)

#     response = HttpResponse(image_io, content_type='image/png')
#     return response


@login_required(login_url='/api/404/')
def open_slide(request, level=0, row=0, col=0):
    """Fetches and returns a tile from an OpenSlide image."""
    if not request.user.is_authenticated:
        return redirect('custom_404')

    image_name = "test.ndpi"  # Change this dynamically if needed
    return get_tile(image_name, level, row, col)


@login_required(login_url='/api/404/')
def view_image(request):
    """Render the OpenSeadragon viewer page."""
    image_name = request.GET.get("image", "test.ndpi")  # Default to test.ndpi
    _, width, height = initiate_tile(image_name)
    return render(
        request,
        "view_image.html",
        {"image_name": image_name, "width": width, "height": height},
    )


def get_annotations(request):
    
    ndpa_file_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'test.ndpa')

    if not os.path.exists(ndpa_file_path):
        return JsonResponse({'error': 'Annotations file not found'}, status=404)

    # Read the annotations from the NDPA file
    with open(ndpa_file_path, 'r') as file:
        try:
            annotations = json.load(file)  # Assuming the .ndpa file is in JSON format
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in annotations file'}, status=400)

    # Return the annotations as JSON
    return JsonResponse({'annotations': annotations})






# def view_bnc_adjusted_image(request, image_name):
    
#     image_path = os.path.join(settings.BASE_DIR, 'static', 'images', f'{image_name}.ndpi')
    
#     if not os.path.exists(image_path):
#         return HttpResponse("Image not found", status=404)

    
#     slide = openslide.OpenSlide(image_path)

    
#     width, height = slide.dimensions

#     # Optionally, you can extract a region of the image to handle memory issues
#     # For example, extract the whole image at level 0 (original resolution)
#     #GPT idea da 
#     img = np.array(slide.read_region((0, 0), 0, (width, height)))

#     # Convert the image to grayscale if it's RGBA or RGB
#     if img.shape[2] > 1:
#         img = np.mean(img, axis=2).astype(np.uint8)

#     # Apply the BNC adjustment
#     adjusted_img = get_bnc_adjusted(img)

#     # Save the adjusted image temporarily to serve it
#     temp_image_path = os.path.join(settings.BASE_DIR, 'static', 'images', f'{image_name}_bnc_adjusted.png')
#     Image.fromarray(adjusted_img).save(temp_image_path)

#     # Pass the adjusted image path to the template
#     return render(request, 'view_bnc_adjusted_image.html', {
#         'image_name': f'{image_name}_bnc_adjusted',
#         'width': adjusted_img.shape[1],
#         'height': adjusted_img.shape[0],
#     })


def get_annotations_xml(request):
    """
    New API endpoint that reads annotations uding xml logic
    """
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
        title_elem = annotation.find('title')
        title = title_elem.text if title_elem is not None else ''
        
        # Get the color from the XML, or default to red if not provided.
        color_elem = annotation.find('color')
        color = color_elem.text if color_elem is not None else "red"
        
        pointlist = annotation.find('pointlist')
        if pointlist is not None:
            x_vals = []
            y_vals = []
            for point in pointlist.findall('point'):
                x_elem = point.find('x')
                y_elem = point.find('y')
                if x_elem is not None and y_elem is not None:
                    try:
                        x_vals.append(int(x_elem.text))
                        y_vals.append(int(y_elem.text))
                    except (ValueError, TypeError):
                        continue
            if x_vals and y_vals:
                x1 = min(x_vals)
                x2 = max(x_vals)
                y1 = min(y_vals)
                y2 = max(y_vals)
                
                annotations.append({
                    'title': title,
                    'x': x1,
                    'y': y1,
                    'width': x2 - x1,
                    'height': y2 - y1,
                    'color': color,
                })
    
    return JsonResponse({'annotations': annotations})