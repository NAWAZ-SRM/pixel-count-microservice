#!/bin/bash

echo $(pwd)
cd reactOpenSeaDrag-master
npm run build
cd ..
# python manage.py makemigrations
# python manage.py migrate
# python manage.py collectstatic
# python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
python manage.py runserver