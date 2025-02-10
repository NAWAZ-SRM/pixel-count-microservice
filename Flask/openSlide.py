import os, json, math
import xml.etree.ElementTree as ET
import numpy as np
from io import BytesIO
from flask import Response
# import openslide


def initiateTile(Doctor, Patient, openslide):

    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    tileName = Patient + '.ndpi'

    dir = os.path.join(current_dir ,'static', 'tiles', 'Doctors', Doctor, Patient, tileName)
    slide = openslide.open_slide(dir)

    width, height = slide.dimensions

    return slide, width, height


#Returns the predicted cell coordinates
def tileSlide(Doctor, tileSlide, openslide):
    
    slide, width, height = initiateTile(Doctor, tileSlide, openslide)
#     # Get the specified tile
    predict_list = get_box_list(Doctor, tileSlide, openslide)
    predictArr = []
    
    for i in range(len(predict_list)):
        title,x1,y1,x2,y2,id,cat = predict_list[i]
        left = int(int((x1+x2)/2))
        top = int(int((y1+y2)/2))
     
        openSeaXCoord = (1/width)*left
        openSeaYCoord = (1/height) * top    
        
        predictArr.append({
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
            "openSeaYCoord": openSeaYCoord
        })
        
        tileDeatil = {
            "width": width,
            "height": height            
        }
        
    
        
    returnObj = {"Predicts": predictArr, "tileDeatil": tileDeatil}

    return returnObj

#Creates the predicted images based on the annotation coordinates
def get_image(Doctor, tileSlide, annotNo, openslide):

    slide, width, height = initiateTile(Doctor, tileSlide, openslide)
    
    predict_list = get_box_list(Doctor, tileSlide, openslide)    
    title,x1,y1,x2,y2,id,cat = predict_list[int(annotNo)]
    
    tile_anote = []                
    # centre of annotation in pixels
    cx = int((x1+x2)/2)  # int(gt[1])
    cy = int((y1+y2)/2)  # int(gt[2])        
    # centering the Groundtruth
    xc, yc = 512/2, 512/2
    left = int(cx - xc)
    top = int(cy - yc)     
    
    tile = slide.read_region((left ,top), 0, (512, 512))
    
    tile = tile.convert('RGB')
    
    output = BytesIO()
    
    # adjusted_tile.save(output, format='JPEG')
    tile.save(output, format='JPEG')
    
    tile_bytes = output.getvalue()
  
    # tile.convert("RGB").save(output, format='JPEG')
    tile_bytes = output.getvalue()
    
    # plot_rgb_histogram(tile_bytes)
    
    return Response(tile_bytes, mimetype='image/jpeg')

def tile(Doctor, tileName, level, row, col, openslide):
    
    try:
        
        # if(level > 16):
        #     level = 15
        
        # if level > 17:
        #     print('level more than 16')
    
        slide, width, height = initiateTile(Doctor, tileName, openslide)    
        
        
        
        max_dimension = max(width, height)
        levels = math.ceil(math.log2(max_dimension / 512))
        
        zoomDiffCeil = levels + 9
        
        print(levels)
        
        # zoomDiff = 17 - level   
        # slideNo = level - 8 
        zoomDiff = zoomDiffCeil - level   
        slideNo = level - levels
            
        tile_width = slide.level_dimensions[slideNo][0]
        tile_height = slide.level_dimensions[slideNo][1]       
        
        dividingFactor = slide.level_dimensions[0][0]/512
        
    
        tile_width = int(tile_width / dividingFactor)
        tile_height = int(tile_height / dividingFactor)
        
        
        tile = slide.read_region((row*512*tile_width ,col*512*tile_height), zoomDiff, (512, 512)) 
        
        tile = tile.convert('RGB')

        output = BytesIO()
    
        tile.convert("RGB").save(output, format='JPEG')
        tile_bytes = output.getvalue()
        
        return Response(tile_bytes, mimetype='image/jpeg')
    
    except Exception as e:
        print(f"Error: {e}")
        
    finally:
        print('done')
        




def get_box_list(Doctor, tileSlide, openslide):
    
        nm_p=221
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        tileName = tileSlide + '.ndpa'
        dir = os.path.join(current_dir ,'static', 'tiles', 'Doctors', Doctor, tileSlide, tileName)
        
        tree = ET.parse(dir)
        root = tree.getroot()
        x1, y1, x2, y2 = 0, 0, 0, 0
        box_list = []
        X_Reference, Y_Reference = get_referance(Doctor, tileSlide, openslide)
        for elem in root.iter():
            
            if elem.tag == 'ndpviewstate':
                title = elem.find('title').text
                cat = ""
                if elem.find('cat') != None:
                    cat = elem.find('cat').text
                
      
                id = elem.get("id")   # MOD

            x = []
            y = []
            if elem.tag == 'pointlist':
                for sub in elem.iter(tag='point'):
                    x.append(int(sub.find('x').text))
                    y.append(int(sub.find('y').text))
                x1 = int((min(x) + X_Reference)/nm_p)
                x2 = int((max(x) + X_Reference)/nm_p)
                y1 = int((min(y) + Y_Reference)/nm_p)
                y2 = int((max(y) + Y_Reference)/nm_p)
                row = [title,x1, y1, x2, y2,id,cat]
                if title.lower() != 'bg':
                    box_list.append(row)
        return box_list

def get_referance( Doctor, tileName, openslide):
        # slide = self.slideRead()
        nm_p = 221
        slide, width, height = initiateTile(Doctor, tileName, openslide)

        w = int(slide.properties.get('openslide.level[0].width'))
        h = int(slide.properties.get('openslide.level[0].height'))

        ImageCenter_X = (w/2)*nm_p
        ImageCenter_Y = (h/2)*nm_p

        OffSet_From_Image_Center_X = slide.properties.get(
            'hamamatsu.XOffsetFromSlideCentre')
        OffSet_From_Image_Center_Y = slide.properties.get(
            'hamamatsu.YOffsetFromSlideCentre')

        # print("offset from Img center units?", OffSet_From_Image_Center_X,OffSet_From_Image_Center_Y)

        X_Ref = float(ImageCenter_X) - float(OffSet_From_Image_Center_X)
        Y_Ref = float(ImageCenter_Y) - float(OffSet_From_Image_Center_Y)
        return X_Ref, Y_Ref
    
def get_bnc_adjusted(img,clip=12):
        hista,histb = np.histogram(img,255)        
        total =0
        n_rem= int((510*510*3*clip)/100)
        for i in reversed(range(255)):
            total +=hista[i]
            if total > n_rem :
                cut_off = int(histb[i])
                break

        alpha = 255/(cut_off)    
        gamma = 0.8
        img_stretched = np.clip(alpha*img, 0, 255)
        img_gama =255 *pow((img_stretched/255),gamma)    
        return img_gama.astype('uint8')
    
