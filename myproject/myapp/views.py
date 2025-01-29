import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

# TMDB API 키 (보안을 위해 실제 프로젝트에서는 .env 파일 사용 추천)
TMDB_API_KEY = "YOUR_TMDB_API_KEY"

def search_tv_shows(request):
    query = request.GET.get('query', '')  # 사용자가 검색한 키워드 가져오기
    if not query:
        return JsonResponse({'error': '검색어를 입력하세요.'}, status=400)

    url = f"https://api.themoviedb.org/3/search/tv?api_key=186af4143351e664bf9c070b58990da1&query={query}&language=ko-KR"
    response = requests.get(url)
    data = response.json()

    return JsonResponse(data)  # JSON 형식으로 반환
'''
def home(request):
    return HttpResponse("Hello, Django!")
'''
def home(request):
    return render(request, 'index.html')