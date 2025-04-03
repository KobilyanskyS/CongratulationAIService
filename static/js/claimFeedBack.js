document.querySelector('#feedBackForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById('feedB_sub_btn');
    const originalButtonContent = submitButton.innerHTML;

    function sanitizeInput(input) {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    }

    function validateInput(input) {
        return input && input.trim().length > 0;
    }

    const formData = new FormData(this);
    const feedBack = sanitizeInput(formData.get('feedback'));
    const contact = sanitizeInput(formData.get('contact'));
    
    const feedBackErrorAlert = document.getElementById('feedBackFormError');

    if (!validateInput(feedBack)) {
        feedBackErrorAlert.textContent = 'Ошибка: Поле отзыва должно быть заполнено';
        feedBackErrorAlert.style.display = 'block';
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = `Отправка <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    feedBackErrorAlert.style.display = 'none';

    try {
        const response = await fetch("http://127.0.0.1:8000/claim_feedback", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                feedback: feedBack,
                contact: contact,
            })
        });

        const data = await response.json();

        if (response.ok) {
            submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
                </svg> ${data.message}`;
        }
        else {
            throw new Error(`Ошибка: ${response.status}`);
        }

    } catch (error) {
        console.error('Ошибка:', error);
        feedBackErrorAlert.textContent = 'Ошибка при отправке отзыва!';
        feedBackErrorAlert.style.display = 'block';
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
    }
});