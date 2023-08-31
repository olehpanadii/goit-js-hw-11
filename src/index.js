import axios from 'axios';
import Notiflix from 'notiflix';

const elements = {
  form: document.querySelector('#search-form'),
};

elements.form.addEventListener('submit', handlerrOnSubmit);

function handlerrOnSubmit(evt) {
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
  fetchInfo();
}
