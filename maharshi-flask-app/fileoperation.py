import os
import xml.etree.ElementTree as ET


root_dir = r'C:\Users\mahar\OneDrive\Documents\Custom Applciation\openseadragon\server2\static'

def getDoctors():
 
    # root_dir = r'C:\Users\mahar\OneDrive\Documents\Custom Applciation\openseadragon\server2\static'  # Change this to the actual path where your root directory is located
    # Initialize the final data structure
    data = {"Doctor": []}
    # Traverse the directory structure
    for doctor in os.listdir(os.path.join(root_dir, 'tiles', 'Doctors')):
        doctor_path = os.path.join(root_dir, 'tiles', 'Doctors', doctor)
        if os.path.isdir(doctor_path):
            patients = []
            for patient in os.listdir(doctor_path):
                patient_path = os.path.join(doctor_path, patient)
                if os.path.isdir(patient_path):
                    patients.append(patient)
            data["Doctor"].append({"name": doctor, "patients": patients})

    # Output the JSON
    # json_output = jsonify(data)
    return data['Doctor']


def updateCat(Doctor, tileName, id, new_value):
    
    # print(Doctor, tileName)
    # root_dir = r'C:\Users\mahar\OneDrive\Documents\Custom Applciation\openseadragon\server2\static'
    tileFile = tileName + '.ndpa'
    
    filename = os.path.join(root_dir, 'tiles', 'Doctors', Doctor, tileName, tileFile)
    
    
    # filename = r'C:\Users\mahar\OneDrive\Documents\Custom Applciation\openseadragon\server\static\tiles\C23 - 4007 - 2049765 - LSIL.ndpi.ndpa'    
    tree = ET.parse(filename)
    root = tree.getroot()

    # Find the <ndpviewstate> element with the specified id
    ndpviewstate_element = root.find(f".//ndpviewstate[@id='{id}']")

    if ndpviewstate_element is not None:
        # Find the <cat> element within the <ndpviewstate> element
        cat_element = ndpviewstate_element.find('.//cat')

        # Update the value
        if cat_element is not None:
            cat_element.text = new_value
        else:
            # If there is no <cat> element, create one
            cat_element = ET.SubElement(ndpviewstate_element, 'cat')
            cat_element.text = new_value

        # Save the updated XML back to the file
        tree.write(filename, encoding='unicode')

        return 'Category updated successfully'
    else:
        return f'No annotation found with id {id}'