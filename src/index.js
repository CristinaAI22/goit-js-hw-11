import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
const axios = require('axios').default;
const lightbox = new SimpleLightbox('.gallery a');
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const apiKey = '37150177-120515d24bc5803fc768400f4';
const baseUrl = 'https://pixabay.com/api/';

let itemsPerPage = 40;
let currentPage = 1;
let initialQuery = '';

searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  initialQuery = searchForm.elements.searchQuery.value;
  currentPage = 1;
  clearGallery();
  await searchImages(initialQuery, currentPage, itemsPerPage);
});

loadMoreButton.addEventListener('click', async function (e) {
  e.preventDefault();
  currentPage++;
  const totalItems = itemsPerPage * currentPage;
  await searchImages(initialQuery, currentPage, totalItems);
});

async function searchImages(query, page, perPage) {
  showLoader();
  try {
    const response = await axios.get(baseUrl, {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });
    const { hits, totalHits } = response.data;

    if (hits.length === 0 || query === '') {
      showNotification(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      addImagesToGallery(hits);

      if (hits.length < totalHits) {
        showLoadMoreButton();
        showNotification(`Hooray! We found ${totalHits} images.`);
      } else {
        hideLoadMoreButton();
        showNotification(`Hooray! We found ${totalHits} images.`);
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'An error occurred while fetching the images. Please try again later.'
    );
  } finally {
    hideLoader();
  }
}

function addImagesToGallery(images) {
  const cards = images.map(image => createImageCard(image));
  gallery.innerHTML = '';
  cards.forEach(card => {
    gallery.appendChild(card);
  });
  lightbox.refresh();
  smoothScroll();
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const imageLink = document.createElement('a');
  imageLink.href = image.largeImageURL;
  imageLink.setAttribute('data-lightbox', 'gallery');
  imageLink.setAttribute('data-title', image.tags);

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes: ', image.likes);
  const views = createInfoItem('Views: ', image.views);
  const comments = createInfoItem('Comments: ', image.comments);
  const downloads = createInfoItem('Downloads: ', image.downloads);

  info.append(likes, views, comments, downloads);
  imageLink.appendChild(img);
  card.append(imageLink, info);

  return card;
}

function createInfoItem(label, value) {
  const p = document.createElement('p');
  p.classList.add('info-item');
  p.innerHTML = `<b>${label}</b>${value}`;
  return p;
}
function clearGallery() {
  gallery.innerHTML = '';
}
function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}
function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}
function showNotification(message) {
  Notiflix.Notify.info(message);
}
function showLoader() {
  Notiflix.Loading.standard('Loading...');
}
function hideLoader() {
  Notiflix.Loading.remove();
}
function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * (currentPage - 1),
    behavior: 'smooth',
    block: 'start',
  });
}
