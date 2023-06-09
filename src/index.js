import Notiflix from 'notiflix';
const axios = require('axios').default;
const form = document.querySelector('.search-form');
const search = document.getElementsByName('searchQuery')[0];
const imageGallery = document.querySelector('.gallery');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchInput = search.value;
  searchImages(searchInput);
});
async function searchImages(searchInput) {
  const apiKey = '37150177-120515d24bc5803fc768400f4';
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchInput,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      displayImages(images);
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}
function displayImages(images) {
  imageGallery.innerHTML = '';

  images.forEach(function (image) {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const imageElement = document.createElement('img');
    imageElement.src = image.webformatURL;
    imageElement.alt = image.tags;
    imageElement.loading = 'lazy';
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info');
    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;
    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;
    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;
    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    infoContainer.appendChild(likes);
    infoContainer.appendChild(views);
    infoContainer.appendChild(comments);
    infoContainer.appendChild(downloads);
    photoCard.appendChild(image);
    photoCard.appendChild(infoContainer);
    imageGallery.appendChild(card);
  });
}
