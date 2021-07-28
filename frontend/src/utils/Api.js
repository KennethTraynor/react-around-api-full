class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
      .then(res => {
        return this._handleResponse(res)
      })
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify({
        name,
        link
      })
    })
      .then(res => {
        return this._handleResponse(res)
      })
  }

  deleteCard({ cardID }) {
    return fetch(`${this._baseUrl}/cards/${cardID}`, {
      headers: this._headers,
      method: 'DELETE'
    })
      .then(res => {
        return this._handleResponse(res)
      })
  }

  updateCardLike({ cardID, like }) {

    return fetch(`${this._baseUrl}/cards/likes/${cardID}`, {
      headers: this._headers,
      method: like ? 'PUT' : 'DELETE'
    })
      .then(res => {
        return this._handleResponse(res)
      })
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({
        name,
        about
      })
    })
      .then(res => {
        return this._handleResponse(res)
      })
  }

  setUserAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({
        avatar
      })
    })
      .then(res => {
        return this._handleResponse(res)
      })
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

}

const api = new Api({
  baseUrl: "https://api.kennytraynor.students.nomoreparties.site",
  headers:
  {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  }
});

export default api;