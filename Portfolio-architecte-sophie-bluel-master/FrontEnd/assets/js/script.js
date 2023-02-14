// import { setStorage, getStorage, createUserJson, deleteStorage, STORAGE_KEY, resetFooter } from './index.js'
// import * from './utils.js'
import * as utils from './index.js'

// import { setStorage, getStorage, createUserJson, deleteStorage, STORAGE_KEY, resetFooter } from './index.js'

// fetchAPI /\

/**
 * @param {object} work 
 * @description fetches the works details from the API
 */

const fetchWorks = async (workId) => {
    try {
        const reponse = await utils.fetchAPI('http://localhost:5678/api/works', 'GET');
        if (!reponse.ok) throw new Error(reponse.status);
        const data = await reponse.json();
        console.log(data);
        if (workId > 0) {
            return data.filter(work => work.categoryId === workId);
        }
        else {
            return data;
        }
    }
    catch (error) {
        console.log(error);
        alert('Erreur lors du chargement des oeuvres');
        return null;
    }
}


/**
 * @param {object} work 
 * @description generate a work element in the gallery
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

/**
 * @param {Int} workId 
 * @description generate all the works in the gallery, depending on the filter or not
 */
const generateWorks = async (workId) => {
    const works = await fetchWorks(workId);

    document.querySelector('.gallery').innerHTML = '';

    for (let work of works) {
        generateWork(work);
    }
    console.log('works ==== ' + works);
    return works;
}

/**
 * @param {null} none 
 * @description sets the display of the nav bar
 */
const navUpdate = (parameter1, parameter2, parameter3, worksBoolean) => {
    document.querySelector('.worksGallery').style.fontWeight = parameter1;
    document.querySelector('.login').style.fontWeight = parameter2;
    document.querySelector('.contact').style.fontWeight = parameter3;
    if (worksBoolean) { showWorks(); }
}

/**
 * @param {null} none 
 * @description calls every setter functions
 */
const setters = () => {
    triggers();
    updateAdminBar();
    loggedInDetection();
    updateEditButtons();
    sessionStorageDetection();

}

/**
 * @param {null} none 
 * @description calls every trigger functions
 */
const triggers = () => {
    triggerFilter();
    triggerNavContact();
    triggerNavLogin();
    triggerNavWork();
    triggerModal();
    triggerModalClose();
}
/**
 * @param {null} none 
 * @description sets up the event listener for the filter buttons, and applied the filter
 */
const triggerFilter = () => {
    const filtersInput = document.querySelectorAll('.filter input');
    for (let filter of filtersInput) {
        filter.addEventListener('change', (event) => {
            generateWorks(parseInt(event.target.id.slice(5)))
        });
    }

}

/**
 * @param {null} none 
 * @description sets up the event listener for the contact button in nav
 */
const triggerNavContact = () => {
    const contactTrigger = document.querySelector('.contact');
    contactTrigger.addEventListener('click', function () {
        console.log('contact');
        navUpdate('400', '400', '600', 'none', true)
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }, true);
        utils.resetFooter();
    });

}
/**
 * @param {null} none 
 * @description sets up the event listener for the works button in nav
 */
const triggerNavWork = () => {
    const backToWorks = document.querySelector('.worksGallery');
    backToWorks.addEventListener('click', () => {
        console.log('works');
        navUpdate('600', '400', '400', 'none', true)
        utils.resetFooter();
    });
}

/**
 * @param {null} none 
 * @description sets up the event listener for the login button in nav
 */
const triggerNavLogin = () => {
    const loginTrigger = document.querySelector('.login');
    loginTrigger.addEventListener('click', triggerLogInorOut);

}
/**
 * @param {null} none 
 * @description gets you to the login page if you are not logged in, or logs you out if you are logged in
 */
const triggerLogInorOut = () => {
    if (utils.getStorage(utils.STORAGE_KEY)) {
        document.querySelector('.login').innerText = 'login';
        utils.deleteStorage();
        utils.deleteSessionStorage();
        navUpdate('600', '400', '400', 'none', true);
        showFilters();
    }
    else {
        window.location.href = 'login/index.html'
    }
    updateAdminBar();
    updateEditButtons();
}

/**
 * @param {null} none 
 * @description updates the nav items
 */
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

/**
 * @param {null} none 
 * @description shows the filters
 */
const showFilters = () => {
    document.querySelector('.filters').classList.remove('hidden');
    document.querySelector('#portfolioTitle').classList.remove('margin50_0');
    document.querySelector('#portfolioTitle').classList.add('margin60_0_40_0');
}

/**
 * @param {null} none 
 * @description hides the filters
 */
const hideFilters = () => {
    document.querySelector('.filters').classList.add('hidden');
    document.querySelector('#portfolioTitle').classList.add('margin50_0');
    document.querySelector('#portfolioTitle').classList.remove('margin60_0_40_0');
}

/**
 * @param {null} none 
 * @description shows the works and the introduction
 */
const showWorks = () => {
    document.querySelector('#portfolio').style.display = 'flex';
    document.querySelector('#introduction').style.display = 'flex';
    document.querySelector('#contact').style.display = 'block';
}

/**
 * @param {DOM} DOM 
 * @description hides the DOM passed in parameter
 */
const hidden = (DOM) => {
    document.querySelector(DOM).classList.add('hidden');
}
/**
 * @param {DOM} zone 
 * @description hides the zone passed in parameter
 */
const hideZone = (zone) => {
    document.querySelector(zone).style.display = 'none';
}
/**
 * @param {null} none 
 * @description shows the zone passed in parameter
 */
const showZone = (zone) => {
    document.querySelector(zone).style.display = 'block';
}

/**
 * @param {null} none 
 * @description updates the admin bar depending on the user being logged in or not
 */
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
/**
 * @param {null} none 
 * @description updates the edit buttons depending on the user being logged in or not
 */
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

// setSessionStorage()

/**
 * @param {null} none 
 * @description sets up the event listener for the modal to be displayed
 */
const triggerModal = () => {
    const modal = document.querySelector('#portfolioEditButton');
    modal.addEventListener('click', () => displayModal());
}

/**
* @param {null} none 
* @description display the modal
*/
const displayModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'flex';

    generateWorksModal();
}

/**
 * @param {null} none 
 * @description generate the modal with all the works
 */
const generateWorksModal = async () => {
    document.querySelector('.modalGallery').innerHTML = '';
    const worksModal = await fetchWorks();

    for (let work of worksModal) {
        generateWorkModal(work);
    }

    console.log('worksModal ' + worksModal);

}
/**
 * @param {object} work 
 * @description generate a work element in the modal
 */
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

/**
 * @param {null} none 
 * @description Sets up the event listeners for the modal close
 */
const triggerModalClose = () => {
    const modal = document.querySelector('.modalCloseButton');
    modal.addEventListener('click', () => closeModal());
    const modalBg = document.querySelector('.modalBg');
    modalBg.addEventListener('click', () => closeModal());
}

/**
 * @param {null} none 
 * @description Closes the ongoing modal
 */
const closeModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'none';
}

const sessionStorageDetection = () => {
    if (!utils.getSessionStorage()) {
        createSessionStorage();
    }
}

const createSessionStorage = async () => {
    try {
        const reponse = await utils.fetchAPI('http://localhost:5678/api/works', 'GET');
        if (!reponse.ok) throw new Error(reponse.status);
        const data = await reponse.json();
        utils.setSessionStorage(data);
    }
    catch (error) {
        console.log(error);
        alert('Erreur lors du chargement des oeuvres dans le sessionStorage');
        return null;
    }
}






//MAIN CALLS
const works = generateWorks();
setters();

