// 모달 열기
function openModal() {
    document.getElementById("search-modal").style.display = "block";
}

// 모달 닫기
function closeModal() {
    document.getElementById("search-modal").style.display = "none";
}

// 드라마 검색 (검색 버튼을 누르면 모달이 열리고 검색 결과 표시)
function searchTVShows() {
    openModal();  // ✅ 검색 시 자동으로 모달 열기

    // ✅ 검색어 가져오기 (헤더 검색창 또는 모달 검색창에서 입력된 값)
    let query = document.getElementById("header-search-input").value.trim();
    if (!query) {
        query = document.getElementById("modal-search-input").value.trim();
    }

    if (!query) {
        alert("검색어를 입력하세요!");
        return;
    }

    console.log("검색 실행 중:", query); // ✅ 검색 실행 확인

    fetch(`/search/?query=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API 응답 데이터:", data); // ✅ 응답 데이터 콘솔 출력

            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = ""; // 기존 결과 초기화

            if (data.results && data.results.length > 0) {
                data.results.forEach(show => {
                    const showElement = document.createElement("div");
                    showElement.classList.add("movie-item");
                    showElement.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w200${show.poster_path}" alt="${show.name}">
                        <h3>${show.name} (${show.first_air_date || "정보 없음"})</h3>
                        <p>${show.overview || "설명이 없습니다."}</p>
                    `;
                    resultsDiv.appendChild(showElement);
                });
            } else {
                resultsDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
            }
        })
        .catch(error => {
            console.error("검색 오류:", error);
            alert("영화 데이터를 불러오는 중 오류가 발생했습니다.");
        });
}
