# image_processor/openslide_helper.py

import os
import openslide
import math
from io import BytesIO
from django.http import HttpResponse

IMAGE_DIR = os.path.join("static", "images")


def initiate_tile(image_name):
    """Initialize the OpenSlide object and return slide info."""
    image_path = os.path.join(IMAGE_DIR, image_name)

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image {image_name} not found at {image_path}")

    slide = openslide.OpenSlide(image_path)
    width, height = slide.dimensions
    return slide, width, height


def get_tile(image_name, level, row, col, tile_size=512):
    """Retrieve a tile from the OpenSlide image."""
    try:
        slide, width, height = initiate_tile(image_name)

        max_dimension = max(width, height)
        levels = math.ceil(math.log2(max_dimension / tile_size))
        zoom_diff = levels - level
        slide_no = level - levels

        tile_width, tile_height = slide.level_dimensions[slide_no]

        x_offset = row * tile_size
        y_offset = col * tile_size

        # Read the tile region
        tile = slide.read_region(
            (x_offset, y_offset), zoom_diff, (tile_size, tile_size)
        )
        tile = tile.convert("RGB")

        # Convert tile to JPEG for efficiency
        image_io = BytesIO()
        tile.save(image_io, format="JPEG")
        image_io.seek(0)

        return HttpResponse(image_io.getvalue(), content_type="image/jpeg")

    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)
