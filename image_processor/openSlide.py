# image_processor/openSlide.py

import os
import json
import math
import xml.etree.ElementTree as ET
import numpy as np
from io import BytesIO
from django.http import HttpResponse
import openslide
from django.conf import settings
from PIL import Image


# Define the root directory dynamically
ROOT_DIR = os.path.join(settings.BASE_DIR, 'static', 'images', 'tiles', 'Doctors')


def initiateTile(Doctor, Patient):
    """
    Initialize OpenSlide with the given Doctor and Patient details.

    Args:
        Doctor (str): The doctor's folder name.
        Patient (str): The patient's folder name.

    Returns:
        OpenSlide object, width, and height of the slide.
    """
    tileName = f"{Patient}.ndpi"
    slide_path = os.path.join(ROOT_DIR, Doctor, Patient, tileName)
    if not os.path.exists(slide_path):
        raise FileNotFoundError(f"Slide file not found: {slide_path}")
    slide = openslide.OpenSlide(slide_path)
    width, height = slide.dimensions
    return slide, width, height


def tileSlide(Doctor, tileSlide):
    """
    Get the predicted cell coordinates.

    Args:
        Doctor (str): Doctor's name.
        tileSlide (str): Tile name.

    Returns:
        Dictionary containing the predictions and tile details.
    """
    slide, width, height = initiateTile(Doctor, tileSlide)
    predict_list = get_box_list(Doctor, tileSlide)
    predictArr = []
    # print(Doctor, tileSlide)

    print(predict_list)
    for title, x1, y1, x2, y2, id, cat in predict_list:
        left = int((x1 + x2) / 2)
        top = int((y1 + y2) / 2)

        # left = min(max(left, 0), width - 1)
        # top = min(max(top, 0), height - 1)

        openSeaXCoord = left / width
        openSeaYCoord = top / height  # No flip, assuming top-left origin

        predictArr.append(
            {
                "id": id,
                "title": title,
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "cat": cat,
                "left": left,
                "top": top,
                "openSeaXCoord": openSeaXCoord,
                "openSeaYCoord": openSeaYCoord,
            }
        )

    tileDetail = {"width": width, "height": height}
    print(f"Predicts: {predictArr}, tileDetail: {tileDetail}")
    return {"Predicts": predictArr, "tileDetail": tileDetail}


def get_image(Doctor, tileSlide, annotNo):
    """
    Creates an image from the annotation coordinates.

    Args:
        Doctor (str): Doctor's name.
        tileSlide (str): Tile name.
        annotNo (int): Annotation number.

    Returns:
        HTTP Response containing the image.
    """
    slide, width, height = initiateTile(Doctor, tileSlide)
    predict_list = get_box_list(Doctor, tileSlide)

    title, x1, y1, x2, y2, id, cat = predict_list[int(annotNo)]
    cx = int((x1 + x2) / 2)
    cy = int((y1 + y2) / 2)

    left = int(cx - 256)
    top = int(cy - 256)

    tile = slide.read_region((left, top), 0, (512, 512))
    tile = tile.convert('RGB')

    output = BytesIO()
    tile.save(output, format='JPEG')
    return HttpResponse(output.getvalue(), content_type="image/jpeg")


def tile(Doctor, tileName, level, row, col):
    """
    Retrieve a tile at a specified zoom level.

    Args:
        Doctor (str): Doctor's name.
        tileName (str): Tile name.
        level (int): Zoom level.
        row (int): Row index.
        col (int): Column index.

    Returns:
        HTTP Response with the tile image.
    """
    try:
        slide, width, height = initiateTile(Doctor, tileName)

        max_dimension = max(width, height)
        levels = math.ceil(math.log2(max_dimension / 512))
        zoomDiffCeil = levels + 9

        zoomDiff = zoomDiffCeil - level
        slideNo = level - levels

        tile_width = slide.level_dimensions[slideNo][0]
        tile_height = slide.level_dimensions[slideNo][1]

        dividingFactor = slide.level_dimensions[0][0] / 512
        tile_width = int(tile_width / dividingFactor)
        tile_height = int(tile_height / dividingFactor)

        tile = slide.read_region(
            (row * 512 * tile_width, col * 512 * tile_height), zoomDiff, (512, 512)
        )
        tile = tile.convert('RGB')

        output = BytesIO()
        tile.save(output, format='JPEG')
        return HttpResponse(output.getvalue(), content_type="image/jpeg")

    except Exception as e:
        return HttpResponse(f"Error: {e}", status=500)


def get_box_list(Doctor, tileSlide):
    """
    Extract annotation bounding boxes from an NDPA file.

    Args:
        Doctor (str): Doctor's name.
        tileSlide (str): Tile name.

    Returns:
        List of bounding box information.
    """
    nm_p = 221
    tileName = f"{tileSlide}.ndpa"
    ndpa_path = os.path.join(ROOT_DIR, Doctor, tileSlide, tileName)

    if not os.path.exists(ndpa_path):
        raise FileNotFoundError(f"NDPA file not found: {ndpa_path}")

    tree = ET.parse(ndpa_path)
    root = tree.getroot()

    # Temporarily remove reference adjustment
    X_Reference, Y_Reference = get_reference(Doctor, tileSlide)
    # X_Reference, Y_Reference = 0, 0  # Test without offset
    box_list = []

    for elem in root.iter():
        if elem.tag == 'ndpviewstate':
            title = elem.find('title').text
            cat = elem.find('cat').text if elem.find('cat') is not None else ""
            id = elem.get("id")

        x, y = [], []
        if elem.tag == 'pointlist':
            for sub in elem.iter(tag='point'):
                x.append(int(sub.find('x').text))
                y.append(int(sub.find('y').text))

            print(f"Raw NDPA coordinates for id={id}: x={x}, y={y}")
            print(f"X_Reference={X_Reference}, Y_Reference={Y_Reference}")

            x1 = int((min(x) + X_Reference) / nm_p)
            x2 = int((max(x) + X_Reference) / nm_p)
            y1 = int((min(y) + Y_Reference) / nm_p)
            y2 = int((max(y) + Y_Reference) / nm_p)

            if title.lower() != 'bg':
                box_list.append([title, x1, y1, x2, y2, id, cat])

    return box_list


def get_reference(Doctor, tileName):
    """
    Get reference points for annotation alignment.

    Args:
        Doctor (str): Doctor's name.
        tileName (str): Tile name.

    Returns:
        X and Y reference points.
    """
    nm_p = 221
    slide, width, height = initiateTile(Doctor, tileName)

    w = int(slide.properties.get('openslide.level[0].width'))
    h = int(slide.properties.get('openslide.level[0].height'))

    ImageCenter_X = (w / 2) * nm_p
    ImageCenter_Y = (h / 2) * nm_p

    OffSet_From_Image_Center_X = slide.properties.get(
        'hamamatsu.XOffsetFromSlideCentre'
    )
    OffSet_From_Image_Center_Y = slide.properties.get(
        'hamamatsu.YOffsetFromSlideCentre'
    )

    print(f"Slide properties: {slide.properties}")
    print(
        f"Width={w}, Height={h}, ImageCenter_X={ImageCenter_X}, ImageCenter_Y={ImageCenter_Y}"
    )
    print(f"Offsets: X={OffSet_From_Image_Center_X}, Y={OffSet_From_Image_Center_Y}")

    X_Ref = float(ImageCenter_X) - float(OffSet_From_Image_Center_X)
    Y_Ref = float(ImageCenter_Y) - float(OffSet_From_Image_Center_Y)
    return X_Ref, Y_Ref


def get_bnc_adjusted(img, clip=12):
    """
    Adjust brightness and contrast of an image.

    Args:
        img (numpy array): Image array.
        clip (int): Clipping percentage.

    Returns:
        Adjusted image.
    """
    hista, histb = np.histogram(img, 255)
    total, n_rem = 0, int((510 * 510 * 3 * clip) / 100)

    for i in reversed(range(255)):
        total += hista[i]
        if total > n_rem:
            cut_off = int(histb[i])
            break

    alpha = 255 / cut_off
    gamma = 0.8
    img_stretched = np.clip(alpha * img, 0, 255)
    return (255 * np.power(img_stretched / 255, gamma)).astype('uint8')
