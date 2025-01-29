from django.db import models

class TVShow(models.Model):
    tmdb_id = models.IntegerField(unique=True)  # TMDB 고유 ID
    title = models.CharField(max_length=255)  # 드라마 제목
    first_air_date = models.DateField()  # 첫 방영일
    overview = models.TextField()  # 개요
    poster_path = models.URLField(blank=True, null=True)  # 포스터 이미지 URL

    def __str__(self):
        return self.title