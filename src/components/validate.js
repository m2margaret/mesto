export const enableValidation = (validationConfig) => {
    const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
    formList.forEach((formElement) => {
        setEventListeners(formElement, validationConfig);
    });
};

export const removeValidation = (popupElement, validationConfig) => {
    const formElement = popupElement.querySelector(validationConfig.formSelector);
    if (!formElement) return;

    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, validationConfig);
        inputElement.setCustomValidity(""); // Очищаем кастомное сообщение об ошибке
    });
};


function setEventListeners(formElement, validationConfig) {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            isValid(formElement, inputElement, validationConfig);
            // При каждом изменении инпута обновляем состояние кнопки
            toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
        });
    });
}

function isValid(formElement, inputElement, validationConfig) {
    // Встроенная валидация браузера
    if (inputElement.validity.patternMismatch) {
        // Устанавливаем кастомное сообщение, если есть data-errorMessage,
        // иначе используем стандартное для typeMismatch или patternMismatch
        inputElement.setCustomValidity(inputElement.dataset.errorMessage || '');
    } else {
        inputElement.setCustomValidity(''); // Сбрасываем кастомное сообщение об ошибке
    }

    if (!inputElement.validity.valid) {
        let errorMessage = inputElement.validationMessage; // Используем встроенное сообщение браузера
        // Дополнительная логика для конкретных сообщений, если нужно
        if (inputElement.validity.valueMissing) {
            errorMessage = 'Вы пропустили это поле.';
        } else if (inputElement.validity.tooShort) {
            const currentLength = inputElement.value.length;
            errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${currentLength} символ${currentLength === 1 ? '' : 'а'}.`;
        } else if (inputElement.type === 'url' && (!inputElement.validity.typeMismatch || inputElement.validity.patternMismatch)) {
            // Это сообщение будет показано, если validateUrlFormat (из index.js) вернет false
            errorMessage = 'Введите корректный URL (должен заканчиваться на .jpg, .jpeg, .png, .gif, .bmp, .webp, .svg)';
        }

        showInputError(formElement, inputElement, errorMessage, validationConfig);
    } else {
        hideInputError(formElement, inputElement, validationConfig);
    }
}

// Стилизация невалидного поля
function showInputError(formElement, inputElement, errorMessage, validationConfig) {
    const errorElement = formElement.querySelector(`[name="${inputElement.name}-error"]`);
    inputElement.classList.add(validationConfig.inputErrorClass);
    if (errorElement) { // Проверка на существование errorElement
        errorElement.textContent = errorMessage;
        errorElement.classList.add(validationConfig.errorClass);
    }
}

// Снятие стилей невалидного поля
function hideInputError(formElement, inputElement, validationConfig) {
    const errorElement = formElement.querySelector(`[name="${inputElement.name}-error"]`);
    inputElement.classList.remove(validationConfig.inputErrorClass);
    if (errorElement) { // Проверка на существование errorElement
        errorElement.textContent = '';
        errorElement.classList.remove(validationConfig.errorClass);
    }
}

// Проверяет, есть ли хотя бы один невалидный инпут
export function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
}

// Блокировка/разблокировка кнопки
export function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(inactiveButtonClass);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(inactiveButtonClass);
    }
}

// Функция для проверки формата URL
export function isValidUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (e) {
        return false;
    }
}