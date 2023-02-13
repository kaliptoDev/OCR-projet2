import * as utils from './index.js'

const triggers = () => {
    triggerLogin();
}

const triggerLogin = () => {
    const loginSubmit = document.querySelector('#loginSubmit');
    loginSubmit.addEventListener('click', triggeredLoginSubmit);
}

const triggeredLoginSubmit = async () => {

    const email = document.querySelector('#email_input').value;
    document.querySelector('#email_input').value = '';
    const password = document.querySelector('#password_input').value;
    document.querySelector('#password_input').value = '';

    console.log(email + ' ' + password);

    if (email === '' || password === '') {
        alert('Veuillez remplir tous les champs');
    } else {
        const response = await utils.fetchAPI('http://localhost:5678/api/users/login', 'POST', JSON.stringify({ email, password }));
        if (response) {
            console.log('connection validated');
        }
        utils.setStorage(response);
    }

    window.location.href = '../index.html';
}

triggers();