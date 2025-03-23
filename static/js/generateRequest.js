document.querySelector('.myForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById('sub_btn');
    const errorAlert = document.getElementById('error');
    const typingElement = document.querySelector('.response');
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
    const name = sanitizeInput(formData.get('name'));
    const holiday = sanitizeInput(formData.get('holiday'));
    const description = sanitizeInput(formData.get('description'));
    const style = sanitizeInput(formData.get('style'));

    if (!validateInput(name) || !validateInput(holiday) || !validateInput(style)) {
        errorAlert.textContent = 'Ошибка: все поля, должны быть заполнены!';
        errorAlert.style.display = 'block';
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = `
        Пишу поздравление
        <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
    `;

    errorAlert.style.display = 'none';

    try {
        const response = await fetch("http://127.0.0.1:8000/generate-congratulation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                holiday: holiday,
                description: description,
                style: style
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        const congratulationText = sanitizeInput(data.congratulation);

        typingElement.value = '';
        typingElement.style.overflowY = 'auto';
        let i = 0;

        function typeText() {
            if (i < congratulationText.length) {
                typingElement.value += congratulationText[i];
                i++;
                
                typingElement.scrollTop = typingElement.scrollHeight;
                
                requestAnimationFrame(typeText);
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            }
        }

        typeText();
    } catch (error) {
        console.error('Ошибка:', error);
        errorAlert.textContent = 'Ошибка при генерации поздравления!';
        errorAlert.style.display = 'block';
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
    }
});