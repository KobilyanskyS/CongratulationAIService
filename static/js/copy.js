document.querySelector('.response-container button').addEventListener('click', async function() {
    const textarea = document.querySelector('.response');
    try {
        await navigator.clipboard.writeText(textarea.value);
        console.log('Текст скопирован в буфер обмена');
    } catch (err) {
        console.error('Ошибка при копировании:', err);
    }
});