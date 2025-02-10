from flask import Flask, jsonify, request
from flask_cors import CORS
import openslide
from openslide.deepzoom import DeepZoomGenerator

import os, sys, json

import fileoperation
import openSlide

app = Flask(__name__)
CORS(app, supports_credentials=True)

# annotations = ''

# OPENSLIDE_PATH = r'C:\Users\mahar\OneDrive\Documents\Custom Applciation\openseadragon\server2\openslide-bin-4.0.0.2-windows-x64\bin'

os.environ['PYDEVD_WARN_SLOW_RESOLVE_TIMEOUT'] = '100.0'

if getattr(sys, 'frozen', False):
    # The application is running as a bundled executable
    current_dir = os.path.dirname(sys.executable)
else:
    # The application is running as a script
    current_dir = os.path.dirname(os.path.abspath(__file__))

# if hasattr(os, 'add_dll_directory'):
#     # Python >= 3.8 on Windows
#     with os.add_dll_directory(OPENSLIDE_PATH):
#         import openslide
#         from openslide.deepzoom import DeepZoomGenerator
# else:
#     import openslide
#     from openslide.deepzoom import DeepZoomGenerator


######################################################## Routes related to openSeaDragon- start #############################################


# send the predict annotations as a josn with the coordinates
@app.route('/tileSlide/<Doctor>/<tileSlide>', methods=['GET'])
def tileSlide(Doctor, tileSlide):

    returnTile = openSlide.tileSlide(Doctor, tileSlide, openslide)
    return returnTile


# create the images as per the predicts and send them to UI
@app.route('/get_image/<Doctor>/<tileSlide>/<annotNo>', methods=['GET'])
def get_image(Doctor, tileSlide, annotNo):

    imagesToSend = openSlide.get_image(Doctor, tileSlide, annotNo, openslide)
    return imagesToSend


@app.route('/tile/<Doctor>/<tileName>/<int:level>/<int:row>_<int:col>.jpeg')
def tile(Doctor, tileName, level, row, col):

    responseTile = openSlide.tile(Doctor, tileName, level, row, col, openslide)
    return responseTile


######################################################## Routes related to openSeaDragon- end #############################################


######################################################### Routes for folder functions- start ##############################################


@app.route('/getDoctors', methods=['GET'])
def getDoctors():

    doctorList = fileoperation.getDoctors()
    return doctorList


######################################################### Routes for folder functions- end ##############################################


######################################################### Routes for annotations - start ###############################################


# annotation functions
@app.route('/updateCategory/<Doctor>/<tileName>/<id>/<new_value>')
def updateCat(Doctor, tileName, id, new_value):

    returnValue = fileoperation.updateCat(Doctor, tileName, id, new_value)
    return returnValue


@app.route('/deleteAnnotation', methods=['POST'])
def deleteAnnotation():
    data = request.get_json()
    id = data['id']
    with open('annotation.json', 'r') as f:
        data_list = json.load(f)

    for i in range(len(data_list)):
        if data_list[i]['id'] == id:
            data_list.pop(i)
            break

    with open('annotation.json', 'w') as f:
        json.dump(data_list, f)

    return jsonify({"message": "Annotation deleted"}), 200


@app.route('/updateAnnotation', methods=['POST'])
def updateAnnotation():
    data = request.get_json()
    id = data['id']
    comment = data['comment']
    tags = data['tags']
    coordinates = data['coordinates']
    x = coordinates['x']
    y = coordinates['y']
    width = coordinates['width']
    height = coordinates['height']

    with open('annotation.json', 'r') as f:
        data_list = json.load(f)

    for i in range(len(data_list)):
        if data_list[i]['id'] == id:
            data_list[i]['comment'] = comment
            data_list[i]['tags'] = tags
            data_list[i]['coordinates']['x'] = x
            data_list[i]['coordinates']['y'] = y
            data_list[i]['coordinates']['width'] = width
            data_list[i]['coordinates']['height'] = height
            break

    with open('annotation.json', 'w') as f:
        json.dump(data_list, f)

    return jsonify({"message": "Annotation updated"}), 200


######################################################### Routes for annotations - end ###############################################

if __name__ == '__main__':

    # app.run(threaded=False)
    app.run(host='0.0.0.0', port=5000)
    # app.run()
