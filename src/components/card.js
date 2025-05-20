import { getCards, deleteCard, likeCard, deleteLike } from './api.js'

import { clickImage } from './index.js'

// DOM узлы
const cardsList = document.querySelector('.places__list');

// Создание новых карточек
export function createCard(cardData, userInfo){
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const imagePopup = document.querySelector('.popup__image');
  const counterLikes = cardElement.querySelector('.card__like-counter')
  cardElement.querySelector('.card__like-counter').textContent = cardData.likes.length;



  if (userInfo._id === cardData.owner._id) {
    cardElement.querySelector('.card__delete-button').addEventListener('click', (event) => clickDeleteCard(event, cardData._id))
  } else {
    const deleteButton = cardElement.querySelector('.card__delete-button')
    deleteButton.remove();
  }

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  cardImage.addEventListener('click', function () { clickImage(cardData.link, cardData.name) }) 

  likeButton.addEventListener('click', (event) => {
      clickLikeCard(event, cardData._id, counterLikes);
  });
  cardData.likes.forEach(element => {
    if (element._id === userInfo._id) {
      likeButton.classList.add('card__like-button_is-active')
    }
  })
  deleteButton.addEventListener('click', (evt) => {
      evt.target.closest('.card').remove();
  });
  
  return cardElement;

}
// Отображение новых карточек
export function showCard(card) {
  cardsList.prepend(card);
}

function updateLikeCounter(res, counterLikes) {
  counterLikes.textContent = res.likes.length
}

function clickDeleteCard(event, cardId) {
  deleteCard(cardId)
    .then(() => { event.target.closest('.card').remove() })
    .catch((res) => console.log(res))
}

function clickLikeCard(event, cardId, counterLikes) {
  if (event.target.classList.contains('card__like-button_is-active')) {
    deleteLike(cardId)
      .then((res) => {
        updateLikeCounter(res, counterLikes)
        event.target.classList.remove('card__like-button_is-active')
      })
      .catch((res) => console.log(res))
  } else {
    likeCard(cardId)
      .then((res) => {
        updateLikeCounter(res, counterLikes)
        event.target.classList.add('card__like-button_is-active')
      })
      .catch((res) => console.log(res))
  }
}


