document.querySelector('#pLinkEmail').addEventListener('click', function () {
    document.querySelector('#functionsForm').innerHTML = `
        <div id="emailForm">
            <div class="d-grid gap-2 mt-3">
                <label for="email" class="form-label">Оставьте ваш адрес электронной почты, мы отправим уведомление, когда функции будут готовы</label>
                <input type="text" id="email" placeholder="example@email.com" class="form-control">
                <div id="emailError" class="text-danger" style="display:none;"></div>
                <button class="btn btn-warning notification" type="button">Сообщите мне, когда будет готово</button>
            </div>
        </div>`;

    const emailInput = document.querySelector('#email');
    const emailError = document.querySelector('#functionsFormError');
    const sendButton = document.querySelector('.notification');

    sendButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const email = sanitizeInput(emailInput.value);

        if (!validateEmail(email)) {
            emailError.textContent = "Введите корректный email!";
            emailError.style.display = "block";
            return;
        }

        emailError.style.display = "none";

        try {
            const response = await fetch("http://127.0.0.1:8000/claim_email", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (response.ok) {
                sendButton.disabled = true;
                sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
                </svg> ${data.message}`;
                emailInput.value = "";
            } else if (response.status === 400) {
                emailError.textContent = data.detail.message;
                emailError.style.display = "block";
            } else {
                emailError.textContent = "Ошибка сервера";
                emailError.style.display = "block";
            }
        } catch (error) {
            emailError.textContent = "Ошибка сети";
            emailError.style.display = "block";
        }
    });
});

document.querySelector('#pLinkPhone').addEventListener('click', function () {
    document.querySelector('#functionsForm').innerHTML = `
        <div id="phoneForm">
            <div class="d-grid gap-2 mt-3">
                <label for="phone" class="form-label">Оставьте ваш номер телефона, мы отправим уведомление, когда функции будут готовы</label>
                <input id="phone" type="tel" class="form-control" placeholder="+71234567891">
                <div id="phoneError" class="text-danger" style="display:none;"></div>
                <button class="btn btn-warning notification" type="button">Сообщите мне, когда будет готово</button>
            </div>
        </div>`;

    const phoneInput = document.querySelector('#phone');
    const phoneError = document.querySelector('#functionsFormError');
    const sendButton = document.querySelector('.notification');

    sendButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const phone = sanitizeInput(phoneInput.value);

        if (!validatePhone(phone)) {
            phoneError.textContent = "Введите корректный номер телефона!";
            phoneError.style.display = "block";
            return;
        }

        phoneError.style.display = "none";

        try {
            const response = await fetch("http://127.0.0.1:8000/claim_phone", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone })
            });

            const data = await response.json();

            if (response.ok) {
                sendButton.disabled = true;
                sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
                </svg> ${data.message}`;
                phoneInput.value = "";
            } else if (response.status === 400) {
                phoneError.textContent = data.detail.message;
                phoneError.style.display = "block";
            } else {
                phoneError.textContent = "Ошибка сервера";
                phoneError.style.display = "block";
            }
        } catch (error) {
            phoneError.textContent = "Ошибка сети";
            phoneError.style.display = "block";
        }
    });
});

function sanitizeInput(input) {
    return input ? input.replace(/[<>]/g, '') : '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone);
}