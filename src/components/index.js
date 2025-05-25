// Импорт стилей
import '../pages/index.css'
// Импорт функций из api
import { getUser, getCards, editProfile, addCard, updateAvatar } from './api.js';
// Импорт функций из card
import { createCard, showCard } from './card.js';
//Импорт функций из modal
import { openModal, closeModal } from './modal.js';

import { enableValidation, removeValidation, toggleButtonState, isValidUrl } from './validate.js';

// DOM узлы
// Пользователь
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
// Профиль пользователя
const profileEditButton = document.querySelector('.profile__edit-button');
const profilePopup = document.querySelector('.popup_type_edit');

//Кнопки закрытия попатов
const closeButtons = document.querySelectorAll('.popup__close');

// Кнопка добавления карточки
const addCardButton = document.querySelector('.profile__add-button');
// Карточка
const cardPopup = document.querySelector('.popup_type_new-card');

// Аватар
const editProfilePopup = document.querySelector('.popup_type_update-profile');
const editProfileButton = document.querySelector('.profile__avatar-button');
const avatarLinkInput = editProfilePopup.querySelector('.popup__input_type_url');

let userInfo

const preloader = document.querySelector('.preloader');

const nameInput = profilePopup.querySelector('.popup__input_type_name');
const descriptionInput = profilePopup.querySelector('.popup__input_type_description');
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const editProfileForm = document.forms['edit-profile'];
const newPlaceForm = document.forms['new-place'];
const editAvatarForm = document.forms['update-profile'];
const cardNameInput = newPlaceForm.elements['place-name'];
const cardLinkInput = newPlaceForm.elements.link;
const submitButton = profilePopup.querySelector('.popup__button');


// Отрисовка информации о пользователе
function renderUserInfo(userData) {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    userInfo = userData;
}
// Начальная загрузка 
Promise.all([getCards(), getUser()])
    .then(([cardsInfo, userInfo]) => {

        renderUserInfo(userInfo)
        cardsInfo.reverse().forEach(card => {
            showCard(createCard(card, userInfo))
            preloader.classList.add('preloader_hidden');
        });
    })
    .catch((err) => {
        console.log(`Ошибка ${err}`);
    })

//Слушатели на попапы
profileEditButton.addEventListener('click', () => {
    openModal(profilePopup);
    const inputList = Array.from(editProfileForm.querySelectorAll(validationConfig.inputSelector));
    toggleButtonState(inputList, submitButton);
});

addCardButton.addEventListener('click', () => {
    openModal(cardPopup);
});

editProfileButton.addEventListener('click', () => {
    openModal(editProfilePopup);
})

// Закрытие попатов
closeButtons.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
        closeModal(popup);
        removeValidation(validationConfig);
    })
})
// Заполнение профиля информацией
export function fillProfileForm() {
    nameInput.value = profileTitle.textContent.trim();
    descriptionInput.value = profileDescription.textContent.trim();
}

export const validationConfig = {
    formSelector: ".popup__form",
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: '.popup__input_invalid',
    errorClass: 'popup__error_visible'
}

enableValidation(validationConfig)

// Назначение обработчиков
profilePopup.addEventListener('submit', handleProfileFormSubmit);
cardPopup.addEventListener('submit', handleCardFormSubmit);
editProfilePopup.addEventListener('submit', handleAvatarSubmit);

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    isLoading(evt, 'Сохранение...');
    editProfile(`${nameInput.value}`, `${descriptionInput.value}`, evt)
        .then((res) => {
            renderUserInfo(res);
            closeModal(profilePopup);
        })
        .catch((res) => {
            console.log(`Ошибка при обновлении информации о пользователе: ${res.status}`)
        })
        .finally(() => {
            isLoading(evt, 'Сохранить')
        })
}

function handleAvatarSubmit(evt) {
    evt.preventDefault();
    isLoading(evt, 'Сохранение...');
    updateAvatar(avatarLinkInput.value, evt)
        .then((res) => {
            renderUserInfo(res);
            editAvatarForm.reset();
            closeModal(editProfilePopup);
        })
        .catch(() => console.log('Ошибка при обновлении аватара'))
        .finally(() => {
            isLoading(evt, 'Сохранить')
        })
}
function isLoading(evt, text) {
    const button = evt.target.querySelector('.popup__button');
    button.textContent = text;
}
function handleCardFormSubmit(evt) {
    evt.preventDefault();
    isLoading(evt, 'Сохранение...');

    const isAccessible = await isImageAccessible(url);
    if (!isAccessible) {
        alert('Изображение по ссылке не найдено или недоступно!');
        return;
    }

    addCard(cardNameInput.value, cardLinkInput.value)
        .then((card) => {
            showCard(createCard(card, userInfo));
            newPlaceForm.reset();
            closeModal(cardPopup);
        })
        .catch((res) => {
            console.log(`Ошибка при добавлении новой карточки: ${res.status}`)
        })
        .finally(() => {
            isLoading(evt, 'Сохранить')
        })
}

export function clickImage(cardLink, cardName) {
    openModal(imagePopup);
    popupImage.src = cardLink;
    popupImage.alt = cardName;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.add('popup_is-animated');
    });
});