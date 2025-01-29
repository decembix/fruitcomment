from django.urls import path
from . import views
from .views import home, search_tv_shows


urlpatterns = [
    path('', home, name='home'),  # 기본 페이지
    path('search/', search_tv_shows, name='search_tv_shows'),
]