# image_processor/fileoperation.py

import os
import json
from django.conf import settings

ROOT_DIR = os.path.join(settings.BASE_DIR, 'static', 'images', 'tiles', 'Doctors')


def getDoctors():
    try:
        data = {"Doctor": []}
        for doctor in os.listdir(ROOT_DIR):
            doctor_path = os.path.join(ROOT_DIR, doctor)
            if os.path.isdir(doctor_path):
                patients = [
                    p
                    for p in os.listdir(doctor_path)
                    if os.path.isdir(os.path.join(doctor_path, p))
                ]
                data["Doctor"].append({"name": doctor, "patients": patients})
        return data['Doctor']
    except Exception as e:
        return {"error": str(e)}


def updateCat(doctor, tileName, annotation_id, new_value):
    """Updates the category of an annotation in annotation.json."""
    annotation_path = os.path.join(ROOT_DIR, doctor, tileName, "annotation.json")
    if not os.path.exists(annotation_path):
        return {"error": "Annotation file not found."}
    try:
        with open(annotation_path, 'r') as f:
            data_list = json.load(f)
        for annotation in data_list:
            if annotation['id'] == annotation_id:
                annotation['category'] = new_value
                break
        with open(annotation_path, 'w') as f:
            json.dump(data_list, f)
        return {"message": "Category updated successfully"}
    except Exception as e:
        return {"error": str(e)}


def deleteAnnotation(annotation_id):
    """Deletes an annotation from annotation.json."""
    annotation_path = os.path.join(ROOT_DIR, "annotation.json")

    if not os.path.exists(annotation_path):
        return {"error": "Annotation file not found."}

    try:
        with open(annotation_path, 'r') as f:
            data_list = json.load(f)

        updated_list = [ann for ann in data_list if ann['id'] != annotation_id]

        with open(annotation_path, 'w') as f:
            json.dump(updated_list, f)

        return {"message": "Annotation deleted successfully"}
    except Exception as e:
        return {"error": str(e)}


def updateAnnotation(annotation_id, new_data):
    """Updates an annotation in annotation.json."""
    annotation_path = os.path.join(ROOT_DIR, "annotation.json")

    if not os.path.exists(annotation_path):
        return {"error": "Annotation file not found."}

    try:
        with open(annotation_path, 'r') as f:
            data_list = json.load(f)

        for annotation in data_list:
            if annotation['id'] == annotation_id:
                annotation.update(new_data)
                break

        with open(annotation_path, 'w') as f:
            json.dump(data_list, f)

        return {"message": "Annotation updated successfully"}
    except Exception as e:
        return {"error": str(e)}






