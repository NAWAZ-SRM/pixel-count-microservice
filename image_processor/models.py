from django.contrib.auth.models import AbstractUser
from django.db import models
import os
from django.conf import settings


class Doctor(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    folder_path = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        if not self.folder_path:
            # Create a folder for the doctor in static/images/tiles/Doctors
            base_dir = os.path.join(
                settings.BASE_DIR, 'static', 'images', 'tiles', 'Doctors'
            )
            if not os.path.exists(base_dir):
                os.makedirs(base_dir)
            self.folder_path = os.path.join(base_dir, self.username)
            os.makedirs(self.folder_path, exist_ok=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
