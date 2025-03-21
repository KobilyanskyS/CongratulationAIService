document.querySelector('.myForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Получаем элементы
    const submitButton = document.getElementById('sub_btn');
    const errorAlert = document.getElementById('error');
    const typingElement = document.querySelector('.response');

    // Исходное содержимое кнопки
    const originalButtonContent = submitButton.innerHTML;

    // Меняем состояние кнопки
    submitButton.disabled = true;
    submitButton.innerHTML = `
        Пишу поздравление
        <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
    `;

    // Скрываем уведомление об ошибке
    errorAlert.style.display = 'none';

    try {
        // Отправляем данные на сервер
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

        // Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        // Получаем данные
        const data = await response.json();
        const congratulationText = data.congratulation;

        // Очищаем textarea перед печатью
        typingElement.value = '';

        // Печатаем текст постепенно
        let i = 0;
        const speed = 20;

        function typeText() {
            if (i < congratulationText.length) {
                // Сохраняем текущую позицию прокрутки страницы
                const scrollTop = window.scrollY || document.documentElement.scrollTop;

                // Добавляем текст
                typingElement.value += congratulationText[i];
                i++;

                // Обновляем высоту textarea
                updateTextareaHeight();

                // Восстанавливаем позицию прокрутки
                window.scrollTo(0, scrollTop);

                // Продолжаем печать
                setTimeout(typeText, speed);
            } else {
                // Возвращаем кнопку в исходное состояние после завершения печати
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            }
        }

        // Запускаем печать
        typeText();
    } catch (error) {
        // Обработка ошибок
        console.error('Ошибка:', error);

        // Показываем уведомление об ошибке
        errorAlert.style.display = 'block';

        // Возвращаем кнопку в исходное состояние
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
    }
});

// Функция для автоматического изменения высоты textarea
function updateTextareaHeight() {
    const typingElement = document.querySelector('.response');
    typingElement.style.height = 'auto';
    typingElement.style.height = (typingElement.scrollHeight + 5) + 'px';
}

// Обработчик изменения текста в textarea
document.querySelector('.response').addEventListener('input', updateTextareaHeight);