const auth = "563492ad6f917000010000014d46a55d5aad4b289e741bc400b0c43a";
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const moreBtn = document.querySelector('.more-btn');
let searchValue;
let page = 1;
let currentSearch;
let fetchLink;

searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
});
moreBtn.addEventListener('click', loadMore);


function updateInput(e){
    searchValue = e.target.value;
}

async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    });

    const data = await dataFetch.json();
    return data;
}

function createPhotos(data){
    data.photos.forEach(photo => {
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
        <div class="gallery-info">
            <p>${photo.photographer}</p>
            <a href=${photo.src.original} target="_blank">Download</a>
        </div>
        <img src = ${photo.src.large}>
        `;

        gallery.appendChild(galleryImg);
    });
}


async function curatedPhotos() {
    fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
    const data = await fetchApi(fetchLink);

    createPhotos(data);
    
}

async function searchPhotos(query){
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
    const data = await fetchApi(fetchLink);

    createPhotos(data)
}

function clear(){
    gallery.innerHTML = '';
    searchInput.value = '';
}

async function loadMore(){
    page++;
    if(currentSearch){
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
    }else{
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }

    const data = await fetchApi(fetchLink);
    createPhotos(data);
}

curatedPhotos();