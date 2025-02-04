const apiKey = 'e5abc725f37f23d195a7177e0f160729'; 

// 인기 영화 목록 불러오기
function fetchPopularMovies() {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error('인기 영화를 불러오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            const movieList = document.getElementById('movie-list');
            movieList.innerHTML = '';
            if (data.results) {
                // 인기 영화 5개만 불러오기
                const movies = data.results.slice(0, 6);
                movies.forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie-item');
                    movieElement.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.release_date}</p>
                    `;
                    movieList.appendChild(movieElement);
                });
                showPoster(movies, 0); // 첫 번째 영화 포스터 표시
            } else {
                movieList.innerHTML = '<p>영화를 불러오는 데 실패했습니다.</p>';
            }
        })
        .catch(error => {
            console.error(error);
            document.getElementById('movie-list').innerHTML = `<p>${error.message}</p>`;
        });
}

async function fetchPopularTVShows() {
    let tvShowList = document.getElementById('tv-show-list');
    tvShowList.innerHTML = ''; // 기존 콘텐츠 비우기

    const totalPages = 5; // 5페이지까지 가져오기
    let tvShows = new Map(); // 중복 제거를 위한 Map (key: id)

    for (let page = 1; page <= totalPages; page++) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ko-KR&page=${page}`);
            if (!response.ok) {
                throw new Error('인기 드라마를 불러오는 데 실패했습니다.');
            }

            const data = await response.json();
            if (data.results) {
                // 'original_language'가 'ko'인 드라마만 필터링
                data.results.forEach(show => {
                    if (show.original_language === 'ko' && !tvShows.has(show.id)) {
                        tvShows.set(show.id, show); // 중복 제거하면서 추가
                    }
                });

                // 6개만 화면에 표시
                if (tvShows.size >= 6) {
                    displayTVShows(Array.from(tvShows.values()).slice(0, 6));
                    return; // 이미 6개를 불러왔으면 종료
                }
            }
        } catch (error) {
            console.error(error);
            tvShowList.innerHTML = `<p>${error.message}</p>`;
            return;
        }
    }

    // 혹시 5페이지를 다 불러와도 6개가 안 찼을 경우
    displayTVShows(Array.from(tvShows.values()).slice(0, 6));
}
// 드라마를 화면에 표시하는 함수
function displayTVShows(shows) {
    let tvShowList = document.getElementById('tv-show-list');
    tvShowList.innerHTML = ''; // 기존 내용 비우기

    shows.forEach(show => {
        const tvShowElement = document.createElement('div');
        tvShowElement.classList.add('movie-item');
        tvShowElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${show.poster_path}" alt="${show.name}">
            <h3>${show.name}</h3>
            <p>${show.first_air_date ? show.first_air_date : "방영일 미정"}</p>
        `;
        tvShowList.appendChild(tvShowElement);
    });
}

// 포스터 표시하기
function showPoster(movies, index) {
    const posterContainer = document.querySelector('.poster-container');
    posterContainer.innerHTML = ''; // 이전 포스터 삭제

    const movie = movies[index];
    const posterElement = document.createElement('img');
    posterElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    posterElement.alt = movie.title;
    posterContainer.appendChild(posterElement);

    // 일정 시간 후 다음 영화 포스터로 변경
    setTimeout(() => {
        const nextIndex = (index + 1) % movies.length;
        showPoster(movies, nextIndex);
    }, 5000); // 5초마다 포스터 변경
}

// 영화 검색하기
let movieData = null;
let tvData = null;

// 영화 및 TV 드라마 검색하기
function searchMoviesAndTVShows() {
   const query = document.getElementById("search-input").value;
   if (!query) {
       alert("검색어를 입력하세요!");
       return;
   }

   const movieSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${encodeURIComponent(query)}`;
   const tvSearchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=ko-KR&query=${encodeURIComponent(query)}`;

   // 두 개의 API 요청을 동시에 실행
   Promise.all([
       fetch(movieSearchUrl).then(response => response.json()),
       fetch(tvSearchUrl).then(response => response.json())
   ])
   .then(([movieDataResponse, tvDataResponse]) => {
       movieData = movieDataResponse.results; // 영화 데이터 저장
       tvData = tvDataResponse.results; // 드라마 데이터 저장

       // 모달 열기
       openModal();

       // 처음 모달이 열릴 때 전체 데이터를 보여줌
       showCategory('all');
   })
   .catch(error => {
       console.error(error);
       document.getElementById("results").innerHTML = `<p>검색 중 오류가 발생했습니다.</p>`;
   });
}

// 전체/영화/드라마 카테고리별로 결과 보여주기
function showCategory(category) {
   const resultsDiv = document.getElementById("results");
   resultsDiv.innerHTML = ""; // 기존 검색 결과 초기화

   let results = [];

   if (category === 'all' || category === 'movie') {
       if (movieData.length > 0) {
           results.push(`<h2>🎬 영화</h2>`);
           movieData.forEach(movie => {
               results.push(`
                   <div>
                       <h3>${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : "미정"})</h3>
                       <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                       <p>${movie.overview || "줄거리가 없습니다."}</p>
                   </div>
               `);
           });
       }
   }

   if (category === 'all' || category === 'tv') {
       if (tvData.length > 0) {
           results.push(`<h2>📺 TV 드라마</h2>`);
           tvData.forEach(show => {
               results.push(`
                   <div>
                       <h3>${show.name} (${show.first_air_date ? show.first_air_date.substring(0, 4) : "미정"})</h3>
                       <img src="https://image.tmdb.org/t/p/w200${show.poster_path}" alt="${show.name}">
                       <p>${show.overview || "줄거리가 없습니다."}</p>
                   </div>
               `);
           });
       }
   }

   if (results.length === 0) {
       resultsDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
   } else {
       resultsDiv.innerHTML = results.join(""); // 결과 출력
   }
}

// 모달 열기
function openModal() {
   document.getElementById("search-modal").style.display = "flex";
}

// 모달 닫기
function closeModal() {
   document.getElementById("search-modal").style.display = "none";
}

// 페이지 로드 시 인기 영화 목록 불러오기
window.onload = function() {
    fetchPopularMovies();
    fetchPopularTVShows();
};


// 모달 창 닫기
function closeModal() {
    document.getElementById("search-modal").style.display = "none";
}

// HOME 버튼 클릭 시 초기화
function resetHome() {
    // 모달 닫기
    closeModal();
    
    // 검색 결과 영역 초기화
    document.getElementById("results").innerHTML = "";

    // 인기 영화 목록 다시 불러오기
    fetchPopularMovies();
}
