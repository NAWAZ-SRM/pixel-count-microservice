# pixel-count-microservice

### Recommended that you use [UV project manager](https://docs.astral.sh/uv/)

1. clone it
2. cd pixel-count-microservice
3. `python manage.py migrate`
4. `python manage.py runserver`
5. url to open the result is "http://127.0.0.1:8000/api"
6. register to create an account and proceed
7. to view image just click on the highlighted images

### Dev Notes

1. Openseadragon viewer implemented
2. need to figure out a way to calculate max level properly (current one seems to be a bit much)
3. routing: view image has the viewer. calls the open-slide api which uses the get image helper function to render image using tiles
4. done dynamically for all parts except image selection. test.ndpi is hardcoded
5. only implemented rendering image as tiles. other features not used
6. doctor functionality ignored
