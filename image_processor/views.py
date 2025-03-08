# # image_processor/views.py

# from io import BytesIO
# import os
# import numpy as np
# import openslide
# from django.views.decorators.csrf import csrf_exempt
# from django.contrib.auth.decorators import login_required
# from django.http import JsonResponse
# from django.shortcuts import render, redirect
# from django.contrib.auth import login, logout
# from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# from django.contrib import messages
# from django.http import HttpResponse
# from PIL import Image
# from django.conf import settings
# import xml.etree.ElementTree as ET
# import json
# from .openSlide import get_tile, initiate_tile
# from django.http import HttpResponse, HttpResponseNotFound
# from django.http import FileResponse

# IMAGE_DIR = os.path.join("static", "images")

# ================== API Endpoints ==================


# @login_required
# def list_images(request):
#     images = [f for f in os.listdir(IMAGE_DIR) if f.endswith(('.tiff', '.ndpi'))]
#     return JsonResponse({"images": images})


# @login_required
# @csrf_exempt
# def store_image(request):
#     if request.method == "POST":
#         selected_image = request.POST.get("image")
#         if selected_image:
#             request.session["selected_image"] = selected_image
#             request.session.modified = True
#             return JsonResponse({"message": "Image stored in session."})
#         return JsonResponse({"error": "No image provided."}, status=400)


# @login_required
# def get_selected_image(request):
#     selected_image = request.session.get("selected_image")
#     return JsonResponse({"selected_image": selected_image or "None"})


# def session_timer(request):
#     if not request.user.is_authenticated:
#         return JsonResponse(
#             {"expired": True, "message": "Session expired, please log in."}, status=401
#         )

#     time_left = request.session.get_expiry_age()
#     return JsonResponse({"expired": time_left <= 0, "time_left": time_left})


# @login_required(login_url='/api/login/')
# def open_slide(request, level=0, row=0, col=0):
#     """Fetches and returns a tile from an OpenSlide image."""
#     if not request.user.is_authenticated:
#         return redirect('custom_404')

#     image_name = "test.ndpi"
#     return get_tile(image_name, level, row, col)


# @login_required(login_url='/api/404/')
# def view_image(request):
#     """API for OpenSeadragon viewer"""
#     image_name = request.GET.get("image", "test.ndpi")
#     _, width, height = initiate_tile(image_name)
#     return JsonResponse({"image_name": image_name, "width": width, "height": height})


# def get_annotations(request):
#     """Fetch annotation data"""
#     ndpa_file_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'test.ndpa')

#     if not os.path.exists(ndpa_file_path):
#         return JsonResponse({'error': 'Annotations file not found'}, status=404)

#     with open(ndpa_file_path, 'r') as file:
#         try:
#             annotations = json.load(file)
#         except json.JSONDecodeError:
#             return JsonResponse(
#                 {'error': 'Invalid JSON format in annotations file'}, status=400
#             )

#     return JsonResponse({'annotations': annotations})


# def get_annotations_xml(request):
#     """Fetch annotation data from an XML file"""
#     ndpa_file_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'test1.ndpa')

#     if not os.path.exists(ndpa_file_path):
#         return JsonResponse({'error': 'NDPA file not found'}, status=404)

#     try:
#         tree = ET.parse(ndpa_file_path)
#         root = tree.getroot()
#     except Exception as e:
#         return JsonResponse({'error': f'Error parsing NDPA file: {str(e)}'}, status=500)

#     annotations = []

#     for annotation in root.findall('ndpviewstate'):
#         title = (
#             annotation.find('title').text
#             if annotation.find('title') is not None
#             else ''
#         )
#         color = (
#             annotation.find('color').text
#             if annotation.find('color') is not None
#             else "red"
#         )

#         pointlist = annotation.find('pointlist')
#         if pointlist is not None:
#             x_vals, y_vals = [], []
#             for point in pointlist.findall('point'):
#                 try:
#                     x_vals.append(int(point.find('x').text))
#                     y_vals.append(int(point.find('y').text))
#                 except (ValueError, TypeError):
#                     continue

#             if x_vals and y_vals:
#                 annotations.append(
#                     {
#                         'title': title,
#                         'x': min(x_vals),
#                         'y': min(y_vals),
#                         'width': max(x_vals) - min(x_vals),
#                         'height': max(y_vals) - min(y_vals),
#                         'color': color,
#                     }
#                 )

#     return JsonResponse({'annotations': annotations})

# import os
# import json
# import xml.etree.ElementTree as ET
# from django.http import JsonResponse, HttpResponse
# from django.shortcuts import render
# from django.views.decorators.csrf import csrf_exempt
# from .fileoperation import getDoctors, updateCat
# from .openslide_helper import open_slide

# # Define root directory dynamically
# ROOT_DIR = os.path.join(os.path.dirname(__file__), "../../static")

# def frontend_view(request):
#     """
#     Serves the built React frontend from static/frontend/.
#     """
#     frontend_path = os.path.join(ROOT_DIR, "frontend/index.html")
#     try:
#         with open(frontend_path, "r") as file:
#             return HttpResponse(file.read())
#     except FileNotFoundError:
#         return HttpResponse("React build not found. Run `npm run build` in frontend.", status=404)

# def doctors_view(request):
#     """
#     Returns a list of doctors and their associated patients.
#     """
#     return JsonResponse(getDoctors(), safe=False)

# @csrf_exempt
# def update_category(request):
#     """
#     Updates the category of a tile in an .ndpa file.
#     Expects JSON input: {"Doctor": "name", "tileName": "name", "id": "annotation_id", "new_value": "category_value"}
#     """
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             Doctor = data.get("Doctor")
#             tileName = data.get("tileName")
#             annotation_id = data.get("id")
#             new_value = data.get("new_value")

#             if not all([Doctor, tileName, annotation_id, new_value]):
#                 return JsonResponse({"error": "Missing required fields"}, status=400)

#             result = updateCat(Doctor, tileName, annotation_id, new_value)
#             return JsonResponse({"message": result})
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON input"}, status=400)
#     return JsonResponse({"error": "Invalid request method"}, status=405)

# def get_tile_annotations(request, Doctor, tileName):
#     """
#     Retrieves annotations from an .ndpa file for a given tile.
#     """
#     tileFile = f"{tileName}.ndpa"
#     filename = os.path.join(ROOT_DIR, "tiles", "Doctors", Doctor, tileName, tileFile)

#     if not os.path.exists(filename):
#         return JsonResponse({"error": "File not found"}, status=404)

#     try:
#         tree = ET.parse(filename)
#         root = tree.getroot()
#         annotations = []

#         for ndpviewstate in root.findall(".//ndpviewstate"):
#             annotation_data = {"id": ndpviewstate.get("id"), "category": None}
#             cat_element = ndpviewstate.find(".//cat")
#             if cat_element is not None:
#                 annotation_data["category"] = cat_element.text
#             annotations.append(annotation_data)

#         return JsonResponse({"annotations": annotations})
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

# def slide_thumbnail_view(request, Doctor, patient, filename):
#     """
#     Returns the thumbnail of a slide using OpenSlide.
#     """
#     try:
#         slide = open_slide(Doctor, patient, filename)
#         thumbnail = slide.get_thumbnail((300, 300))
#         response = HttpResponse(content_type="image/png")
#         thumbnail.save(response, "PNG")
#         return response
#     except FileNotFoundError:
#         return JsonResponse({"error": "Slide not found"}, status=404)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


# # ================== Authentication Views ==================


# def login_view(request):
#     if request.method == "POST":
#         form = AuthenticationForm(request, data=request.POST)
#         if form.is_valid():
#             user = form.get_user()
#             login(request, user)
#             return redirect("/")  # Let React handle login
#         messages.error(request, "Invalid credentials")

#     return JsonResponse({"error": "Invalid credentials"}, status=400)


# def logout_view(request):
#     logout(request)
#     return redirect("/")  # Redirect to React frontend


# def register_view(request):
#     if request.method == "POST":
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             login(request, user)
#             return redirect("/")
#         messages.error(request, "Registration failed")

#     return JsonResponse({"error": "Registration failed"}, status=400)


# # ================== React Frontend Integration ==================


# def frontend_view(request):
#     index_path = os.path.join(settings.BASE_DIR, "static", "frontend", "index.html")

#     if os.path.exists(index_path):
#         with open(index_path, "r") as file:
#             return HttpResponse(file.read())
#     else:
#         return HttpResponseNotFound(
#             "React frontend not found. Build it using 'npm run build'"
#         )


import os
import json
import xml.etree.ElementTree as ET
from django.http import JsonResponse, FileResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from . import fileoperation, openSlide
from django.http import HttpResponse, HttpResponseNotFound

ROOT_DIR = os.path.join(settings.BASE_DIR, 'static')

# OpenSeadragon Routes

def tile_slide(request, doctor, tile_slide):
    """Returns tile slide data for OpenSeadragon."""
    response = openSlide.tileSlide(doctor, tile_slide)
    return JsonResponse(response)

def get_image(request, doctor, tile_slide, annot_no):
    """Returns images based on annotations for OpenSeadragon."""
    response = openSlide.get_image(doctor, tile_slide, annot_no)
    return JsonResponse(response)

def tile(request, doctor, tile_name, level, row, col):
    """Returns a specific tile for OpenSeadragon."""
    response = openSlide.tile(doctor, tile_name, level, row, col)
    return FileResponse(response, content_type="image/jpeg")

# Folder Functions
@csrf_exempt
def get_doctors(request):
    """Fetches all doctors and their patient folders."""
    doctor_list = fileoperation.getDoctors()
    return JsonResponse({"doctors": doctor_list})

# Annotation Routes

@csrf_exempt
def update_category(request, doctor, tile_name, annotation_id):
    """Updates category of an annotation."""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

    new_value = request.POST.get("new_value")
    if not new_value:
        return JsonResponse({"error": "Missing new_value in request"}, status=400)

    response = fileoperation.updateCat(doctor, tile_name, annotation_id, new_value)
    return JsonResponse({"message": response})

@csrf_exempt
def delete_annotation(request):
    """Deletes an annotation from annotation.json."""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

    try:
        data = json.loads(request.body)
        annotation_id = data.get('id')

        with open('annotation.json', 'r') as f:
            data_list = json.load(f)

        updated_list = [ann for ann in data_list if ann['id'] != annotation_id]

        with open('annotation.json', 'w') as f:
            json.dump(updated_list, f)

        return JsonResponse({"message": "Annotation deleted successfully"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_annotation(request):
    """Updates an annotation in annotation.json."""
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

    try:
        data = json.loads(request.body)
        annotation_id = data['id']

        with open('annotation.json', 'r') as f:
            data_list = json.load(f)

        for annotation in data_list:
            if annotation['id'] == annotation_id:
                annotation.update(data)
                break

        with open('annotation.json', 'w') as f:
            json.dump(data_list, f)

        return JsonResponse({"message": "Annotation updated successfully"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def frontend_view(request):
    index_path = os.path.join(settings.BASE_DIR, "static", "frontend", "index.html")

    if os.path.exists(index_path):
        with open(index_path, "r") as file:
            return HttpResponse(file.read())
    else:
        return HttpResponseNotFound(
            "React frontend not found. Build it using 'npm run build'"
        )
