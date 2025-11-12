// ============== States ================
let prodCards = document.getElementById("prodCards")
let searchInp = document.getElementById("searchInp")
let searchBtn = document.getElementById("searchBtn")

// ============== Map Movie Cards ================
function renderCards(movies) {
    console.log(movies);
    
    prodCards.innerHTML = ""
    movies.map(movie => {
        
        prodCards.innerHTML +=
        `
        <div class="prodCardsDiv col-span-4 bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300 shadow-lg cursor-pointer">

            <!-- Image -->
            <div class="relative w-full h-[230px] overflow-hidden">
                <img src="${movie.thumbnail || "logo.png"}" 
                class="object-cover w-full h-full transition duration-300 hover:scale-105">

                <!-- Fade gradient -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

                <!-- Genre badge -->
                <span class="absolute top-3 left-3 flex items-center gap-1 bg-black/40 text-white text-[12px] px-3 py-1 rounded-full backdrop-blur-sm">
                    <i class="fa-solid fa-film text-[11px]"></i> 
                    ${movie.genres.join(", ")}
                </span>
            </div>

            <!-- Content -->
            <div class="px-5 py-4 text-white space-y-3">

                <!-- Title -->
                <p class="font-semibold text-[20px] leading-tight">${movie.title}</p>

                <!-- Year badge -->
                <span class="inline-flex items-center gap-1 bg-white/20 text-white text-[13px] px-2 py-1 rounded-lg">
                    <i class="fa-solid fa-calendar text-[12px]"></i>
                    ${movie.year}
                </span>

                <!-- Short description -->
                <p class="text-[13px] opacity-90 line-clamp-3 pl-1">
                    <i class="fa-solid fa-align-left text-[11px] opacity-80"></i>
                    Cast: ${movie.cast.slice(0, 5).join(", ") || ""}...
                </p>

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
    .then(data => renderCards(data.slice(20, 26)))
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
