#!/bin/bash

echo $(pwd)
cd reactOpenSeaDrag-master
npm run build
cd ..
# uv run manage.py makemigrations
# uv run manage.py migrate
# uv run manage.py collectstatic
# uv run manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
python manage.py runserver