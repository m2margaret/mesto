

export const enableValidation = (validationConfig) => {

    const formList = Array.from(document.querySelectorAll(`${validationConfig.formSelector}`))
    formList.forEach((formElement) => {
      setEventListeners(formElement, validationConfig);
    })
  }

  export const removeValidation = (validationConfig) => {
    const forms = Array.from(document.querySelectorAll(validationConfig.formSelector));
    forms.forEach((formElement) => {
      const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
      const errorElements = formElement.querySelectorAll(`.${validationConfig.errorClass}`)
      const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
      // Убираем класс ошибки у всех инпутов
      inputList.forEach((inputElement) => {
        inputElement.classList.remove(validationConfig.inputErrorClass);
      });
  
      // Очищаем сообщения об ошибках
      errorElements.forEach((errorElement) => {
        errorElement.textContent = '';
        errorElement.classList.remove(validationConfig.errorClass);
      });
      buttonElement.disabled = true;
      buttonElement.classList.add('popup__button_disabled');
    });
  };

  function setEventListeners(formElement, validationConfig) {
    const inputList = Array.from(formElement.querySelectorAll(`${validationConfig.inputSelector}`))
    const buttonElement = formElement.querySelector(`${validationConfig.submitButtonSelector}`);
    toggleButtonState(inputList, buttonElement);
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        isValid(formElement, inputElement, validationConfig);
        toggleButtonState(inputList, buttonElement);
      })
    })
  }

function isValid(formElement, inputElement, validationConfig) {
    if (!inputElement.validity.valid) {
        let errorMessage = '';
        
        if (inputElement.validity.valueMissing) {
          errorMessage = 'Вы пропустили это поле.';
        } 
        else if (inputElement.validity.tooShort) {
          const currentLength = inputElement.value.length;
          errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${currentLength} символ${currentLength === 1 ? '' : 'а'}.`;
        } else if (inputElement.validity.typeMismatch || inputElement.validity.patternMismatch) {
          errorMessage = 'Введите корректный URL (должен заканчиваться на .jpg, .jpeg, .png)';
        }
        showInputError(formElement, inputElement, errorMessage, validationConfig)
      } 
      else {
        hideInputError(formElement, inputElement, validationConfig)
      }
  }
// Стилизация невалидного поля
function showInputError(formElement, inputElement, errorMessage, validationConfig) {
    const errorElement = formElement.querySelector(`[name="${inputElement.name}-error"]`); 
    inputElement.classList.add(`${validationConfig.inputErrorClass}`); 
    errorElement.textContent = errorMessage;
    errorElement.classList.add(`${validationConfig.errorClass}`);
  }
  
  // Снятие стилей невалидного поля
  function hideInputError(formElement, inputElement, validationConfig) {
    const errorElement = formElement.querySelector(`[name="${inputElement.name}-error"]`);
    inputElement.classList.remove(`${validationConfig.inputErrorClass}`);
    errorElement.textContent = '';
    errorElement.classList.remove(`${validationConfig.errorClass}`);
  }
// Блокировка кнопки
export function toggleButtonState(inputList, button) {
    if (invalidInput(inputList)) {
      button.disabled = true;
      button.classList.add('popup__button_disabled');
    } else {
      button.disabled = false;
      button.classList.remove('popup__button_disabled');
    }
  }

function invalidInput(inputList) {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    })
  }

  export function isValidUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

