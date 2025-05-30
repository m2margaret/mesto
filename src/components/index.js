// Импорт стилей
import '../pages/index.css'
// Импорт функций из api
import { getUser, getCards, editProfile, addCard, updateAvatar } from './api.js';
// Импорт функций из card
import { createCard, showCard } from './card.js';
//Импорт функций из modal
import { openModal, closeModal } from './modal.js';

import { enableValidation, removeValidation, toggleButtonState, isValidUrl as validateUrlFormat, hasInvalidInput } from './validate.js';


// DOM узлы
// Пользователь
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
// Профиль пользователя
const profileEditButton = document.querySelector('.profile__edit-button');
const profilePopup = document.querySelector('.popup_type_edit');

//Кнопки закрытия попапов
const closeButtons = document.querySelectorAll('.popup__close');

// Кнопка добавления карточки
const addCardButton = document.querySelector('.profile__add-button');
// Карточка
const cardPopup = document.querySelector('.popup_type_new-card');

// Аватар
const editProfilePopup = document.querySelector('.popup_type_update-profile');
const editProfileButton = document.querySelector('.profile__avatar-button');
const avatarLinkInput = editProfilePopup.querySelector('.popup__input_type_url');

let userInfo;

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

// Кнопки "Сохранить" для каждой формы
const submitButtonProfile = editProfileForm.querySelector('.popup__button');
const submitButtonCard = newPlaceForm.querySelector('.popup__button');
const submitButtonAvatar = editAvatarForm.querySelector('.popup__button');


// Функция для асинхронной проверки доступности изображения по URL
async function isImageAccessible(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            resolve(true); // Изображение успешно загружено
        };
        img.onerror = () => {
            resolve(false); // Произошла ошибка при загрузке изображения
        };
        img.src = url;
    });
}

// Отрисовка информации о пользователе
function renderUserInfo(userData) {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    userInfo = userData;
}

// Начальная загрузка
Promise.all([getCards(), getUser()])
    .then(([cardsInfo, userInfoData]) => { // Изменил имя переменной userInfo на userInfoData, чтобы избежать конфликта с глобальной userInfo
        renderUserInfo(userInfoData);
        cardsInfo.reverse().forEach(card => {
            showCard(createCard(card, userInfoData));
            preloader.classList.add('preloader_hidden');
        });
    })
    .catch((err) => {
        console.log(`Ошибка: ${err}`);
    });

// Слушатели на попапы
profileEditButton.addEventListener('click', () => {
    openModal(profilePopup);
    fillProfileForm(); // Заполняем форму данными пользователя
});

addCardButton.addEventListener('click', () => {
    openModal(cardPopup);
    newPlaceForm.reset(); // Сбрасываем форму новой карточки при открытии, если хотите чистое поле
});

editProfileButton.addEventListener('click', () => {
    openModal(editProfilePopup);
});

// Закрытие попапов
closeButtons.forEach((button) => {
    const popup = button.closest('.popup');
    button.addEventListener('click', () => {
        closeModal(popup);
    });
});

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
    inputErrorClass: 'popup__input_invalid',
    errorClass: 'popup__error_visible'
};

enableValidation(validationConfig); // Вызываем функцию валидации

// Назначение обработчиков для форм
editProfileForm.addEventListener('submit', handleProfileFormSubmit);
newPlaceForm.addEventListener('submit', handleCardFormSubmit);
editAvatarForm.addEventListener('submit', handleAvatarSubmit);

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    isLoading(submitButtonProfile, 'Сохранение...'); // Передаем конкретную кнопку
    editProfile(nameInput.value, descriptionInput.value)
        .then((res) => {
            renderUserInfo(res);
            closeModal(profilePopup);
        })
        .catch((err) => {
            console.log(`Ошибка при обновлении информации о пользователе: ${err.status}`);
        })
        .finally(() => {
            isLoading(submitButtonProfile, 'Сохранить'); // Передаем конкретную кнопку
        });
}

async function handleAvatarSubmit(evt) {
    evt.preventDefault();
    isLoading(submitButtonAvatar, 'Сохранение...'); // Передаем конкретную кнопку

    const url = avatarLinkInput.value;

    // 1. Предварительная проверка формата URL
    if (!validateUrlFormat(url)) {
        alert('Некорректный формат URL изображения. Пожалуйста, используйте действительную ссылку.');
        isLoading(submitButtonAvatar, 'Сохранить');
        return;
    }

    // 2. Проверка доступности изображения
    const isAccessible = await isImageAccessible(url);
    if (!isAccessible) {
        alert('Изображение по ссылке не найдено или недоступно!');
        isLoading(submitButtonAvatar, 'Сохранить');
        return;
    }

    // Если обе проверки пройдены
    updateAvatar(url)
        .then((res) => {
            renderUserInfo(res);
            closeModal(editProfilePopup);
        })
        .catch(() => console.log('Ошибка при обновлении аватара'))
        .finally(() => {
            isLoading(submitButtonAvatar, 'Сохранить'); // Передаем конкретную кнопку
        });
}

function isLoading(button, text) {
    if (button) {
        button.textContent = text;
    }
}

async function handleCardFormSubmit(evt) {
    evt.preventDefault();
    isLoading(submitButtonCard, 'Сохранение...'); // Передаем конкретную кнопку

    const url = cardLinkInput.value;

    // 1. Предварительная проверка формата URL
    if (!validateUrlFormat(url)) {
        alert('Некорректный формат URL изображения. Пожалуйста, используйте действительную ссылку.');
        isLoading(submitButtonCard, 'Сохранить');
        return;
    }

    // 2. Проверка доступности изображения
    const isAccessible = await isImageAccessible(url);
    if (!isAccessible) {
        alert('Изображение по ссылке не найдено или недоступно!');
        isLoading(submitButtonCard, 'Сохранить');
        return;
    }

    // Если обе проверки пройдены
    addCard(cardNameInput.value, url)
        .then((card) => {
            showCard(createCard(card, userInfo));
            newPlaceForm.reset(); // Сбрасываем форму добавления карточки после успешного сохранения
            closeModal(cardPopup);
        })
        .catch((err) => {
            console.log(`Ошибка при добавлении новой карточки: ${err.status}`);
        })
        .finally(() => {
            isLoading(submitButtonCard, 'Сохранить'); // Передаем конкретную кнопку
        });
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