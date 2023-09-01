import axios from 'axios';
import Notiflix from 'notiflix';

const elements = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

elements.form.addEventListener('submit', handlerrOnSubmit);

async function handlerrOnSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget.elements;

  async function fetchInfo() {
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
      key: '39180696-751dca007ad69505d1c72e10e',
      q: searchQuery.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
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
  try {
    const data = await fetchInfo();
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    }
  } catch (error) {
    Notiflix.Notify.failure('An error occurred while fetching data.');
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
      )
      .join('');
  }
}
