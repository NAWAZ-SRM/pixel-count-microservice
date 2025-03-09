# image_processor/views.py

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
    return response


def tile(request, doctor, tile_name, level, row, col):
    """Returns a specific tile for OpenSeadragon."""
    response = openSlide.tile(doctor, tile_name, level, row, col)
    return response


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
