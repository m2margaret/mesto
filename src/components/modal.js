import { validationConfig } from "./index.js";
import { removeValidation } from "./validate.js";

function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
        const popup = evt.currentTarget;
        closeModal(popup);
    }
}

function handleEscapeKey(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}

export function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscapeKey);
    popup.addEventListener('mousedown', handleOverlayClick);

    const formElement = popup.querySelector(validationConfig.formSelector);
    if (formElement) {
        const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
        const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

        removeValidation(popup, validationConfig);

        buttonElement.classList.add(validationConfig.inactiveButtonClass);
        buttonElement.setAttribute('disabled', true);
    }
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscapeKey);
    popup.removeEventListener('mousedown', handleOverlayClick);
}