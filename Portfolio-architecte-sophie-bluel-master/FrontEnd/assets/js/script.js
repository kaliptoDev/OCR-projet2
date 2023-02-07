import { setStorage, getStorage, createUserJson, fetchAPI, deleteStorage, STORAGE_KEY } from './utils.js'

// fetchAPI /\

const fetchWorks = async (workId) => {
    const worksList = await fetchAPI('http://localhost:5678/api/works', 'GET');
    if (!worksList) alert('Erreur lors du chargement des oeuvres');

    if (workId > 0) {
        return worksList.filter(work => work.categoryId === workId);
    }
    else {
        return worksList;
    }
}


const generateWork = (work) => {
    const workElement = document.createElement('figure');
    const workElementFigureImg = document.createElement("img");
    const captionWork = document.createElement("figcaption");

    workElement.setAttribute('id', `work_${work.id}`);
    workElementFigureImg.src = work.imageUrl;
    workElementFigureImg.crossOrigin = "anonymous";
    workElementFigureImg.setAttribute('alt', work.title);
    captionWork.innerText = work.title;

    document.querySelector('.gallery').appendChild(workElement);
    document.getElementById('work_' + work.id).appendChild(workElementFigureImg);
    document.getElementById('work_' + work.id).appendChild(captionWork);

}

const generateWorks = async (workId) => {
    const works = await fetchWorks(workId);

    document.querySelector('.gallery').innerHTML = '';

    for (let work of works) {
        generateWork(work);
    }

    return works;
}

const navUpdate = (parameter1, parameter2, parameter3, parameter4, worksBoolean) => {
    document.querySelector('.worksGallery').style.fontWeight = parameter1;
    document.querySelector('.login').style.fontWeight = parameter2;
    document.querySelector('.contact').style.fontWeight = parameter3;
    if (worksBoolean) { showWorks(); }
    document.querySelector('#login').style.display = parameter4;
}

const triggers = () => {
    triggerNavContact();
    triggerFilter();
    triggerNavLogin();
    triggerNavWork();
    triggerLogin();
}

const triggerFilter = () => {
    const filtersInput = document.querySelectorAll('.filter input');
    for (let filter of filtersInput) {
        filter.addEventListener('change', (event) => {
            generateWorks(parseInt(event.target.id.slice(5)))
        });
    }

}

const triggerNavContact = () => {
    const contactTrigger = document.querySelector('.contact');
    contactTrigger.addEventListener('click', function () {
        console.log('contact');
        navUpdate('400', '400', '600', 'none', true)
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }, true);
    });


}

const triggerNavWork = () => {
    const backToWorks = document.querySelector('.worksGallery');
    backToWorks.addEventListener('click', () => {
        console.log('works');
        navUpdate('600', '400', '400', 'none', true)
    });

}

const triggerNavLogin = () => {
    const loginTrigger = document.querySelector('.login');
    loginTrigger.addEventListener('click', triggerLogInorOut);

}

const triggerLogInorOut = () => {
    if (getStorage(STORAGE_KEY)) {
        document.querySelector('.login').innerText = 'login';
        deleteStorage();
        navUpdate('600', '400', '400', 'none', true);
    }
    else {
        console.log('login');
        hideZone('#introduction');
        hideZone('#portfolio');
        hideZone('#contact');
        navUpdate('400', '600', '400', 'flex', false)
    }
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
    console.log('works');

    if (email === '' || password === '') {
        alert('Veuillez remplir tous les champs');
    } else {
        const response = await fetchAPI('http://localhost:5678/api/users/login', 'POST', JSON.stringify({ email, password }));
        if (response) {

            document.querySelector('.login').innerText = 'logout';
            navUpdate('600', '400', '400', 'none', true)
            console.log('connection validated');

        }
        setStorage(response);
        loggedInDetection();
        return response;
    }
}

const loggedInDetection = () => {
    if(getStorage(STORAGE_KEY)) {
        document.querySelector('.login').innerText = 'logout';
        navUpdate('600', '400', '400', 'none', true)
        const userId = getStorage(STORAGE_KEY).userId;
        console.log(`user Id = ${userId}`);
        const token = getStorage(STORAGE_KEY).token;
        console.log(`token = ${token}`);
    }
}

const showWorks = () => {
    document.querySelector('#portfolio').style.display = 'flex';
    document.querySelector('#introduction').style.display = 'flex';
    document.querySelector('#contact').style.display = 'block';
}

const hideZone = (zone) => {
    document.querySelector(zone).style.display = 'none';
}


//MAIN CALLS
const works = generateWorks();
triggers();
loggedInDetection();