#!/bin/bash

echo $(pwd)
cd reactOpenSeaDrag-master
npm run build
cd ..
uv run manage.py collectstatic
uv run manage.py runserver