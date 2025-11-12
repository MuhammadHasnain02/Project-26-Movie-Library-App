// ============== States ================
let movieCards = document.getElementById("movieCards")
let searchInp = document.getElementById("searchInp")
let searchBtn = document.getElementById("searchBtn")

// ============== Map Movie Cards ================
function renderCards(movies) {
    
    movieCards.innerHTML = ""
    movies.map(movie => {
        
        movieCards.innerHTML +=
        `
        <div class="prodCardsDiv col-span-4 bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl overflow-hidden hover:scale-[1.009] transition-all duration-300 shadow-lg cursor-pointer">

            <!-- Image -->
            <div class="relative w-full h-[230px] overflow-hidden">
                <img src="${movie.thumbnail || 'favicon.png'}" 
                class="object-cover w-full h-full transition duration-300 hover:scale-105">

                <!-- Fade gradient -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/25"></div>

                <!-- Genre badge -->
                <span class="absolute top-3 left-3 flex items-center gap-1 bg-black/40 text-white text-[12px] px-3 py-1 rounded-full backdrop-blur-sm">
                    <i class="fa-solid fa-film text-[11px]"></i> 
                    ${movie.genres?.join(", ") || ". . ."}
                </span>
            </div>

            <!-- Content -->
            <div class="px-5 py-4 text-white space-y-3">

                <!-- Title -->
                <p class="font-semibold text-[20px] leading-tight">${movie.title}</p>

                <!-- Year + Rating -->
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1 bg-white/20 text-white text-[13px] px-2 py-1 rounded-lg">
                        <i class="fa-solid fa-calendar text-[12px]"></i>
                        ${movie.year}
                    </span>
                    <span class="inline-flex items-center gap-1 bg-yellow-500/30 text-yellow-300 text-[13px] px-2 py-1 rounded-lg">
                        <i class="fa-solid fa-star text-[12px]"></i>
                        ${movie.rating || (Math.random() * (9 - 6) + 6).toFixed(1)}
                    </span>
                </div>

                <!-- Director -->
                <p class="text-[13px] opacity-90 line-clamp-1 pl-1">
                    <i class="fa-solid fa-user-tie text-[11px] opacity-80"></i>
                    Director: ${movie.director || "Unknown"}
                </p>

                <!-- Cast -->
                <p class="text-[13px] opacity-90 line-clamp-2 pl-1">
                    <i class="fa-solid fa-users text-[11px] opacity-80"></i>
                    Cast: ${movie.cast?.slice(0, 5).join(", ") || "N/A"}...
                </p>

                <!-- Description (Only 2 lines now) -->
                <p class="text-[13px] opacity-80 line-clamp-2 pl-1">
                    <i class="fa-solid fa-align-left text-[11px] opacity-70"></i>
                    ${movie.extract || "No description available."}
                </p>

                <!-- Wikipedia Link -->
                <a href="${movie.href || '#'}" target="_blank" 
                class="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-400 transition">
                    <i class="fa-brands fa-wikipedia-w"></i> Read on Wikipedia
                </a>

            </div>
        </div>
        `

    });
    
    // Save last movies
    localStorage.setItem("lastMovies" , JSON.stringify(movies) || [])
}

// ============== Load Last Movies ================
let lastMovies = JSON.parse(localStorage.getItem("lastMovies") || "[]")

if (lastMovies.length > 0) {
    searchInp.value = localStorage.getItem("lastSearch") || "";
    renderCards(lastMovies);
} else {
    // Default 6 movies
    fetch("https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json")
    .then(res => res.json())
    .then(data => renderCards(data.slice(54, 60)))
    .catch(err => console.log(err));
}

// ============== Search Function ================
function handleSearch() {
    
    const userQuery = searchInp.value.trim().toLowerCase();
    if (!userQuery) return;

    fetch("https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json")
    .then(res => res.json())
    .then(data => {

        // Filter movies by title
        let filtered = data.filter(movie => movie.title.toLowerCase().includes(userQuery));

        if (filtered.length === 0) {
            prodCards.innerHTML = `
            <div class="flex justify-center items-center col-span-12 my-10">
                <p class='text-white text-xl'>No movies found!</p>
            </div>
            `;
            return;
        }

        renderCards(filtered);
        localStorage.setItem("lastSearch", userQuery)

    })
    .catch(err => console.log(err));
}

// ============== Event Listeners ================
searchBtn.addEventListener('click', handleSearch);
searchInp.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') handleSearch()
});
