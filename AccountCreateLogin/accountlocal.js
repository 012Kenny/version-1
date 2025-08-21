document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
    const errorBox = document.getElementById('error-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    })

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // whether form is login or sign up
    const action = form.getAttribute('action');

    try {
        const res = await fetch(action, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
    }
})