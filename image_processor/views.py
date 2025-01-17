from django.http import JsonResponse
from PIL import Image
import os

def get_pixel_count(request):
    # Path to the specific image
    image_path = r"D:\PROFILE.jpg"  
    
    # Check if the file exists
    if not os.path.exists(image_path):
        return JsonResponse({
            "status": "error",
            "message": f"Image not found at {image_path}"
        })

    try:
        
        with Image.open(image_path) as img:
            width, height = img.size
            pixel_count = width * height

        return JsonResponse({
            "status": "success",
            "image": "PROFILE.jpg",
            "width": width,
            "height": height,
            "pixel_count": pixel_count
        })

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        })
