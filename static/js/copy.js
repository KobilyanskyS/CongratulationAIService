document.querySelector('.response-container button').addEventListener('click', function() {
    const textarea = document.querySelector('.response');
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand('copy');
});


