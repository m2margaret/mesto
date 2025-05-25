import { fillProfileForm, validationConfig } from "./index.js";
import { removeValidation, toggleButtonState } from "./validate.js";

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
    fillProfileForm();
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscapeKey);
    popup.addEventListener('mousedown', handleOverlayClick);

    const form = popup.querySelector('.popup__form');
    if (form) {
        form.reset();

        const submitButton = form.querySelector('.popup__button');
        if (submitButton) {
            const inputList = Array.from(form.querySelectorAll('.popup__input'));
            toggleButtonState(inputList, submitButton, {
                inactiveButtonClass: 'popup__button_disabled',
                inputErrorClass: 'popup__input_invalid'
            });
        }
    }
}

export function closeModal(popup){
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscapeKey);
    popup.removeEventListener('mousedown', handleOverlayClick);
    removeValidation(validationConfig);
}