import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};
const lightbox = new SimpleLightbox('.gallery a');
elements.form.addEventListener('submit', handlerrOnSubmit);

let page = 1;

async function handlerrOnSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget.elements;
  const query = searchQuery.value.trim();
  if (!query) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  page = 1;
  elements.gallery.innerHTML = '';
  async function fetchInfo(currentPage = '1') {
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
      key: '39180696-751dca007ad69505d1c72e10e',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: '40',
    });
    try {
      const resp = await axios.get(`${BASE_URL}?${params}`);
      return resp.data;
    } catch (error) {
      throw new Error(
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    }
  }
  const options = {
    rootMargin: '500px',
  };
  const observer = new IntersectionObserver(handlerLoadMore, options);

  function handlerLoadMore(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        page += 1;
        fetchMoreImages(page);
        lightbox.refresh();
      }
    });
  }
  async function fetchMoreImages(currentPage) {
    try {
      const data = await fetchInfo(currentPage);
      if (data.hits.length === 0) {
        observer.unobserve(elements.guard);
      } else {
        elements.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkup(data.hits)
        );
        lightbox.refresh();
      }
    } catch (error) {
      Notiflix.Notify.failure('An error occurred while fetching more data.');
    }
  }

  try {
    const data = await fetchInfo(page);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      observer.observe(elements.guard);
      lightbox.refresh();
    }
  } catch (error) {
    Notiflix.Notify.failure('An error occurred while fetching data.');
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a href="${largeImageURL}" data-lightbox="gallery">
  <img class="fetch-image"src="${webformatURL}" alt="${tags}" loading="lazy"  width="300"
  height="200" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}
