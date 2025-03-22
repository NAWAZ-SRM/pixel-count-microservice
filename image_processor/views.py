# image_processor/views.py

import os
import json
import xml.etree.ElementTree as ET
from django.http import JsonResponse, FileResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from . import fileoperation, openSlide
from django.http import HttpResponse, HttpResponseNotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import DoctorSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import TokenAuthentication

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
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_doctors(request):
    print(
        f"get_doctors: Request user: {request.user}, is_authenticated: {request.user.is_authenticated}"
    )
    if not request.user.is_authenticated:
        print("get_doctors: User not authenticated, returning 401")
        return JsonResponse({'error': 'Authentication required'}, status=401)
    doctor_list = fileoperation.getDoctors()
    print(f"get_doctors: Doctor list before filter: {doctor_list}")
    doctor_list = [d for d in doctor_list if d['name'] == request.user.username]
    print(f"get_doctors: Doctor list after filter: {doctor_list}")
    return JsonResponse({'doctors': doctor_list})


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


# New signup and login views
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# image_processor/views.py
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            print(
                f"LoginView: User {user.username} logged in, token: {token.key}, created: {created}"
            )
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        print(f"LoginView: Validation failed, errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def frontend_view(request):
    index_path = os.path.join(settings.BASE_DIR, 'static', 'frontend', 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r') as file:
            return HttpResponse(file.read())
    else:
        return HttpResponseNotFound(
            "React frontend not found. Build it using 'npm run build'"
        )
