import * as utils from './index.js'

const triggers = () => {
    triggerLogin();
    triggerNavContact();
    triggerNavWork();
}

const triggerLogin = () => {
    const loginSubmit = document.querySelector('#loginSubmit');
    loginSubmit.addEventListener('click', triggeredLoginSubmit);
    const input = document.getElementById("loginBody");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("loginSubmit").click();
        }
    });
}

const triggerNavContact = () => {
    const contactTrigger = document.querySelector('.contact');
    contactTrigger.addEventListener('click', function () {
        window.location.href = '../index.html#contact';
    });
}

const triggerNavWork = () => {
    const backToWorks = document.querySelector('.worksGallery');
    backToWorks.addEventListener('click', () => {
        window.location.href = '../index.html#gallery';
    });
}

const triggeredLoginSubmit = async () => {

    const email = document.querySelector('#email_input').value;
    document.querySelector('#email_input').value = '';
    const password = document.querySelector('#password_input').value;
    document.querySelector('#password_input').value = '';

    console.log(email + ' ' + password);
    try{ await login(email, password); }
    catch (error) {
        console.warn("Erreur relevee : " + error);
        document.querySelector('.error_login').display = 'block';
        document.querySelector('.error_login').innerText = error;
    }
}

const login = async (email, password) => {
    try {
        if (email === '' || password === '') {
            throw new Error('Veuillez remplir tous les champs');
        } else {
            try {
                const response = await utils.fetchAPI('http://localhost:5678/api/users/login', 'POST', JSON.stringify({ email, password }));
                if (response.status === 404) {
                    throw new Error('Identifiants incorrects');

                } else if (response.status === 401) {
                    throw new Error('Non autorisé');

                } else if (response.status === 200) {
                    const data = await response.json();
                    utils.setStorage(data);
                    document.querySelector('.error_login').style.display = 'none';
                    window.location.href = '../index.html';
                }

            } catch (error) {
                console.log(error);
                let error_raw = error.toString();
                error_raw = error_raw.slice(7);
                document.querySelector('.error_login').style.display = 'block';
                document.querySelector('.error_login').innerText = `Erreur: ${error_raw}`;
                setTimeout(() => {
                    document.querySelector('.error_login').style.display = 'none';
                }, 3000);
            }

        }
    }
    catch (error) {
        console.log(error);
        document.querySelector('.error_login').style.display = 'block';
        let error_raw = error.toString();
        error_raw = error_raw.slice(7);
        document.querySelector('.error_login').innerText = `Erreur: ${error_raw}`;
        setTimeout(() => {
            document.querySelector('.error_login').style.display = 'none';
        }, 3000);
    }
}



triggers();
document.querySelector('footer').style.bottom = '0';
document.querySelector('footer').style.marginBottom = '0';