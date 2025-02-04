from django.urls import path
from . import views
from .views import home, search_tv_shows, movie, drama


urlpatterns = [
    path('', home, name='home'),  # 기본 페이지
    path('search/', search_tv_shows, name='search_tv_shows'),
    path('movie/', movie, name='movie'),
    path('drama/', drama, name='drama'),
]