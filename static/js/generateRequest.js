document.querySelector('.myForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById('sub_btn');
    const errorAlert = document.getElementById('error');
    const typingElement = document.querySelector('.response');
    const originalButtonContent = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = `
        Пишу поздравление
        <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
    `;

    errorAlert.style.display = 'none';

    try {
        const formData = new FormData(this);
        const response = await fetch("http://127.0.0.1:8000/generate-congratulation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                holiday: formData.get('holiday'),
                description: formData.get('description'),
                style: formData.get('style')
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        const congratulationText = data.congratulation;

        typingElement.value = '';
        typingElement.style.overflowY = 'auto';
        let i = 0;

        function typeText() {
            if (i < congratulationText.length) {
                typingElement.value += congratulationText[i];
                i++;
                
                // Прокручиваем текст внутри textarea вниз
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
        errorAlert.style.display = 'block';
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
    }
});