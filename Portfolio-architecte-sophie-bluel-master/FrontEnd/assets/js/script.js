// import { setStorage, getStorage, createUserJson, fetchAPI, deleteStorage, STORAGE_KEY, resetFooter } from './index.js'
// import * from './utils.js'
import * as utils from './index.js'

// fetchAPI /\

const fetchWorks = async (workId) => {
    const worksList = await utils.fetchAPI('http://localhost:5678/api/works', 'GET');
    if (!worksList) alert('Erreur lors du chargement des oeuvres');

    if (workId > 0) {
        return worksList.filter(work => work.categoryId === workId);
    }
    else {
        return worksList;
    }
}

/**
 * @param {object} work 
 * @description generate a work element
 */

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
    document.getElementById('work_' + work.id).classList.add('work');

}

const generateWorks = async (workId) => {
    const works = await fetchWorks(workId);

    document.querySelector('.gallery').innerHTML = '';

    for (let work of works) {
        generateWork(work);
    }
    console.log('works ==== ' + works);
    return works;
}

const navUpdate = (parameter1, parameter2, parameter3, worksBoolean) => {
    document.querySelector('.worksGallery').style.fontWeight = parameter1;
    document.querySelector('.login').style.fontWeight = parameter2;
    document.querySelector('.contact').style.fontWeight = parameter3;
    if (worksBoolean) { showWorks(); }
}

const setters = () => {
    triggers();
    updateAdminBar();
    loggedInDetection();
    updateEditButtons();


}

const triggers = () => {
    triggerFilter();
    triggerNavContact();
    triggerNavLogin();
    triggerNavWork();
    triggerModal();
    triggerModalClose();
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
        utils.resetFooter();
    });

}

const triggerNavWork = () => {
    const backToWorks = document.querySelector('.worksGallery');
    backToWorks.addEventListener('click', () => {
        console.log('works');
        navUpdate('600', '400', '400', 'none', true)
        utils.resetFooter();
    });
}

const triggerNavLogin = () => {
    const loginTrigger = document.querySelector('.login');
    loginTrigger.addEventListener('click', triggerLogInorOut);

}

const triggerLogInorOut = () => {
    if (utils.getStorage(utils.STORAGE_KEY)) {
        document.querySelector('.login').innerText = 'login';
        utils.deleteStorage();
        navUpdate('600', '400', '400', 'none', true);
        showFilters();
    }
    else {
        window.location.href = 'login/index.html'
    }
    updateAdminBar();
    updateEditButtons();
}

const loggedInDetection = () => {
    if (utils.getStorage()) {
        document.querySelector('.login').innerText = 'logout';
        navUpdate('600', '400', '400', 'none', true)
        const userId = utils.getStorage(utils.STORAGE_KEY).userId;
        console.log(`user Id = ${userId}`);
        const token = utils.getStorage(utils.STORAGE_KEY).token;
        console.log(`token = ${token}`);
        hideFilters();
    } else {
        showFilters();
    }
}

const showFilters = () => {
    document.querySelector('.filters').classList.remove('hidden');
    document.querySelector('#portfolioTitle').classList.remove('margin50_0');
    document.querySelector('#portfolioTitle').classList.add('margin60_0_40_0');
}

const hideFilters = () => {
    document.querySelector('.filters').classList.add('hidden');
    document.querySelector('#portfolioTitle').classList.add('margin50_0');
    document.querySelector('#portfolioTitle').classList.remove('margin60_0_40_0');
}

const showWorks = () => {
    document.querySelector('#portfolio').style.display = 'flex';
    document.querySelector('#introduction').style.display = 'flex';
    document.querySelector('#contact').style.display = 'block';
}

const hidden = (DOM) => {
    document.querySelector(DOM).classList.add('hidden');
}

const hideZone = (zone) => {
    document.querySelector(zone).style.display = 'none';
}

const showZone = (zone) => {
    document.querySelector(zone).style.display = 'block';
}

const updateAdminBar = () => {

    if (utils.getStorage()) {
        document.querySelector('.adminBar').style.display = 'flex';
        document.querySelector('.headerCorpse').classList.add('margin100_0_50_0')
        document.querySelector('.headerCorpse').classList.remove('margin50_0')
    }
    else {
        document.querySelector('.adminBar').style.display = 'none';
        document.querySelector('.headerCorpse').classList.add('margin50_0')
        document.querySelector('.headerCorpse').classList.remove('margin100_0_50_0')
    }
}

const updateEditButtons = () => {
    if (!utils.getStorage()) {
        hideZone('#introductionEditButton');
        hideZone('#articleEditButton');
        hideZone('#portfolioEditButton');
    }
    else {
        showZone('#introductionEditButton');
        showZone('#articleEditButton');
        showZone('#portfolioEditButton');
    }



}

const triggerModal = () => {
    const modal = document.querySelector('#portfolioEditButton');
    modal.addEventListener('click', () => displayModal());
 }

const displayModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'flex';

    generateWorksModal();
}

const generateWorksModal = async () => {
    document.querySelector('.modalGallery').innerHTML = '';
    const worksModal = await fetchWorks();

    for (let work of worksModal) {
        generateWorkModal(work);
    }

    console.log('worksModal ' + worksModal);

}

const generateWorkModal = (work) => {

    const workElementFigure = document.createElement('figure');
    const workElementFigurediv = document.createElement("div");
    const workElementFigureImg = document.createElement("img");
    const workCloseIcon = document.createElement("i");
    const captionWork = document.createElement("figcaption");

    workElementFigure.setAttribute('id', `work_${work.id}`);
    workElementFigure.classList.add('modalFigure');
    workElementFigurediv.classList.add('modalImgContainer');
    workCloseIcon.classList.add('fa-regular', 'fa-trash-can', 'modalImgTrash');
    captionWork.classList.add('modalFigcaption');
    workElementFigureImg.src = work.imageUrl;
    workElementFigureImg.crossOrigin = "anonymous";
    workElementFigureImg.setAttribute('alt', work.title);
    captionWork.innerText = 'éditer';

    document.querySelector('.modalGallery').appendChild(workElementFigure);
    workElementFigure.appendChild(workElementFigurediv);
    workElementFigurediv.appendChild(workCloseIcon);
    workElementFigurediv.appendChild(workElementFigureImg);
    workElementFigure.appendChild(captionWork);

    // workCloseIcon.addEventListener('click', () => deleteWork(work.id));
}





const triggerModalClose = () => {
    const modal = document.querySelector('.modalCloseButton');
    modal.addEventListener('click', () => closeModal());
    const modalBg = document.querySelector('.modalBg');
    modalBg.addEventListener('click', () => closeModal());
}

const closeModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'none';

    
}








//MAIN CALLS
const works = generateWorks();
setters();

