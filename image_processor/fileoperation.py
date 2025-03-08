# import os
# import xml.etree.ElementTree as ET
# from django.conf import settings
# from django.http import JsonResponse

# ROOT_DIR = os.path.join(settings.BASE_DIR, 'static')

# def get_doctors():
#     """Fetches doctors and their associated patients from the directory structure."""
#     data = {"Doctor": []}
#     doctors_dir = os.path.join(ROOT_DIR, 'tiles', 'Doctors')

#     if not os.path.exists(doctors_dir):
#         return JsonResponse({"error": "Doctors directory not found"}, status=404)

#     for doctor in os.listdir(doctors_dir):
#         doctor_path = os.path.join(doctors_dir, doctor)
#         if os.path.isdir(doctor_path):
#             patients = [p for p in os.listdir(doctor_path) if os.path.isdir(os.path.join(doctor_path, p))]
#             data["Doctor"].append({"name": doctor, "patients": patients})

#     return JsonResponse(data)

# def update_category(doctor, tile_name, annotation_id, new_value):
#     """Updates the category in the XML annotation file."""
#     tile_file = f"{tile_name}.ndpa"
#     filename = os.path.join(ROOT_DIR, 'tiles', 'Doctors', doctor, tile_name, tile_file)

#     if not os.path.exists(filename):
#         return JsonResponse({"error": "File not found"}, status=404)

#     tree = ET.parse(filename)
#     root = tree.getroot()
#     ndpviewstate_element = root.find(f".//ndpviewstate[@id='{annotation_id}']")

#     if ndpviewstate_element is not None:
#         cat_element = ndpviewstate_element.find('.//cat')

#         if cat_element is not None:
#             cat_element.text = new_value
#         else:
#             cat_element = ET.SubElement(ndpviewstate_element, 'cat')
#             cat_element.text = new_value

#         tree.write(filename, encoding='unicode')
#         return JsonResponse({"message": "Category updated successfully"})
    
#     return JsonResponse({"error": f"No annotation found with id {annotation_id}"}, status=404)


import os
import json
from django.conf import settings

ROOT_DIR = os.path.join(settings.BASE_DIR, 'static', 'images')


def getDoctors():
    """Returns a list of available doctors (folder names in the tiles directory)."""
    try:
        doctors = [d for d in os.listdir(ROOT_DIR) if os.path.isdir(os.path.join(ROOT_DIR, d))]
        return {"doctors": doctors}
    except Exception as e:
        return {"error": str(e)}

def getPatients(doctor):
    """Returns a list of patient folders for a given doctor."""
    doctor_path = os.path.join(ROOT_DIR, doctor)
    if not os.path.exists(doctor_path):
        return {"error": f"Doctor {doctor} not found."}

    try:
        patients = [p for p in os.listdir(doctor_path) if os.path.isdir(os.path.join(doctor_path, p))]
        return {"patients": patients}
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
