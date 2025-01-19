from django.http import JsonResponse
from PIL import Image
import requests
from io import BytesIO


def get_pixel_count(request):
    # Path to the specific image
    img_url = request.GET.get('url')

    if not img_url:
        return JsonResponse({"status": "error", "message": "No image URL provided."})

    try:
        response = requests.get(img_url)
        response.raise_for_status()
        with Image.open(BytesIO(response.content)) as img:
            width, height = img.size
            pixel_count = width * height

        return JsonResponse(
            {
                "status": "success",
                "image_url": img_url,
                "width": width,
                "height": height,
                "pixel_count": pixel_count,
            }
        )

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})
