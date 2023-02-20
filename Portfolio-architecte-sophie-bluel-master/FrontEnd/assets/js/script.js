// import { setStorage, getStorage, createUserJson, deleteStorage, STORAGE_KEY, resetFooter } from './index.js'
// import * from './utils.js'
import * as utils from './index.js'
import { deleteSessionStorage } from './index.js';
// import { setSessionStorage } from './index.js';

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
 * @description sets the display of the nav bar
 */
const navUpdate = (parameter1, parameter2, parameter3, worksBoolean) => {
    document.querySelector('.worksGallery').style.fontWeight = parameter1;
    document.querySelector('.login').style.fontWeight = parameter2;
    document.querySelector('.contact').style.fontWeight = parameter3;
    if (worksBoolean) { showWorks(); }
}

/**
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
 * @description calls every trigger functions
 */
const triggers = () => {
    triggerFilter();
    triggerNavContact();
    triggerNavLogin();
    triggerNavWork();
    triggerModal();
    triggerModalClose();
    triggerGalleryDeletion();
    applyChangesAdminBarTrigger();
}
/**
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
 * @description sets up the event listener for the login button in nav
 */
const triggerNavLogin = () => {
    const loginTrigger = document.querySelector('.login');
    loginTrigger.addEventListener('click', triggerLogInorOut);

}
/**
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

const triggerGalleryDeletion = () => {
    const galleryDelete = document.querySelector('.modalDeleteGallery');
    galleryDelete.addEventListener('click', async () => {
        // utils.deleteAllWorksFromDB();
        utils.deleteSessionStorage();
        utils.setSessionStorage(null);
        // const works = await fetchWorks();
        // utils.setSessionStorage(works);
        generateWorksModal();

    });
}

/**
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
 * @description shows the filters
 */
const showFilters = () => {
    document.querySelector('.filters').classList.remove('hidden');
    document.querySelector('#portfolioTitle').classList.remove('margin50_0');
    document.querySelector('#portfolioTitle').classList.add('margin60_0_40_0');
}

/**
 * @description hides the filters
 */
const hideFilters = () => {
    document.querySelector('.filters').classList.add('hidden');
    document.querySelector('#portfolioTitle').classList.add('margin50_0');
    document.querySelector('#portfolioTitle').classList.remove('margin60_0_40_0');
}

/**
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
 * @description shows the zone passed in parameter
 */
const showZone = (zone) => {
    document.querySelector(zone).style.display = 'block';
}

/**
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
 * @description sets up the event listener for the modal to be displayed
 */
const triggerModal = () => {
    const modal = document.querySelector('#portfolioEditButton');
    modal.addEventListener('click', () => displayModal());
}

const triggerModalGalleryDeletion = () => {
    const trash = document.querySelectorAll('.modalImgTrash');
    console.warn(trash);
    trash.forEach(trashEl => {
        console.log(trashEl)
        trashEl.addEventListener('click', () => {
            var id = trashEl.getAttribute('id');
            console.warn(id);
            id = id.slice(10);
            console.warn(id);
            deleteModalGalleryItem(id);
            console.warn('trash clicked');

        })
    })
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

    triggerModalGalleryDeletion();
    generateWorksModal();
    triggerAddWorkToModal();
    triggerModalBack();
}

/**
 * @description generate the modal with all the works
 */
const generateWorksModal = async () => {
    document.querySelector('.modalGallery').innerHTML = '';
    // const worksModal = await fetchWorks();
    const worksModal = utils.getSessionStorage();
    if (worksModal !== null) {
        for (let work of worksModal) {
            generateWorkModal(work);
        }
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
    const workDeleteIcon = document.createElement("i");
    const captionWork = document.createElement("figcaption");

    workElementFigure.setAttribute('id', `work_${work.id}`);
    workElementFigure.classList.add('modalFigure');
    workElementFigurediv.classList.add('modalImgContainer');
    workDeleteIcon.classList.add('fa-regular', 'fa-trash-can', 'modalImgTrash');
    workDeleteIcon.setAttribute('id', `workTrash_${work.id}`);
    workDeleteIcon.onclick = () => {
        deleteElement(work.id)
        updateModalGallery();
    } // évite les eventListener()
    captionWork.classList.add('modalFigcaption');
    workElementFigureImg.src = work.imageUrl;
    workElementFigureImg.crossOrigin = "anonymous";
    workElementFigureImg.setAttribute('alt', work.title);
    captionWork.innerText = 'éditer';
    document.querySelector('.modalGallery').setAttribute('isGallery', 'true');
    document.querySelector('.modalGallery').appendChild(workElementFigure);
    workElementFigure.appendChild(workElementFigurediv);
    workElementFigurediv.appendChild(workDeleteIcon);
    workElementFigurediv.appendChild(workElementFigureImg);
    workElementFigure.appendChild(captionWork);

    // workCloseIcon.addEventListener('click', () => deleteWork(work.id));
}

/**
 * @description Sets up the event listeners for the modal close
 */
const triggerModalClose = () => {
    const modal = document.querySelector('.modalCloseButton');
    modal.addEventListener('click', () => closeModal());
    const modalBg = document.querySelector('.modalBg');
    modalBg.addEventListener('click', () => closeModal());
}

/**
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

const deleteModalGalleryItem = (workId) => {
    const workElement = document.querySelector(`#work_${workId}`);
    workElement.remove();
    updateAndRemoveSessionStorage(workId);
    generateWorksModal();
}

const updateAndRemoveSessionStorage = (workId) => {
    var works = utils.getSessionStorage();

    // on veut retirer l'object dans le tableau works qui a l'id workId
    // const newContent = works.reduce((acc, cur) => {
    //     if(cur.id !== workId) {
    //         acc.push(cur)
    //     }
    //     return acc
    // }, [])

    // on récupère tous les element qui ont un Id != de workId
    const newContent = works.filter(el => el.id !== workId)

    console.log(newContent)

    // const workIndex = works.findIndex(work => work.id === workId);
    // console.warn("workindex: " + workIndex);
    // works.splice(workIndex, 1);
    // var workstemp = [];
    // workstemp = works.filter(work => work.id !== workId);
    // console.warn(works.filter(work => work.id !== workId));
    deleteSessionStorage();
    utils.setSessionStorage(newContent2);
    // console.warn(workstemp);
}

const applyChangesAdminBarTrigger = () => {
    const adminBar = document.querySelector('.publishChanges');
    adminBar.addEventListener('click', () => {
        const works = utils.getSessionStorage();
        if (works === null) deleteAllWorksFromDB();
        else {
            utils.updateAllWorksToDB(works);
        }
    })
}

const changeModalButtons = () => {
    const modalAddAPhotoButton = document.querySelector('.addModalPhotoButton');
    modalAddAPhotoButton.style.display = 'none';
    const modalDeleteGallery = document.querySelector('.modalDeleteGallery');
    modalDeleteGallery.style.display = 'none';
    const modalConfirmNewWork = document.querySelector('.modalConfirmNewPhotoButton');
    modalConfirmNewWork.style.display = 'block';
    console.warn("modalConfirmNewWork");

}

const triggerAddWorkToModal = () => {
    const modalAddPhotoButton = document.querySelector('.addModalPhotoButton');
    modalAddPhotoButton.addEventListener('click', () => {
        displayNewWorkModal();
        triggerSelectCategory();
    });
}

const triggerModalBack = () => {
    const modalBackButton = document.querySelector('.modalBackButton');
    modalBackButton.addEventListener('click', () => {
        displayModal();
        const modalH2 = document.querySelector('.modalH2');
        modalH2.innerText = 'Galerie photo';
        const modalAddAPhotoButton = document.querySelector('.addModalPhotoButton');
        modalAddAPhotoButton.style.display = 'block';
        const modalDeleteGallery = document.querySelector('.modalDeleteGallery');
        modalDeleteGallery.style.display = 'block';
        const modalConfirmNewWork = document.querySelector('.modalConfirmNewPhotoButton');
        modalConfirmNewWork.style.display = 'none';
        document.querySelector('.modalBackButton').style.display = 'none';
    });
}

const displayNewWorkModal = () => {
    document.querySelector('.modalGallery').innerHTML = '';
    const modalH2 = document.querySelector('.modalH2');
    modalH2.innerText = 'Ajout photo';
    document.querySelector('.modalBackButton').style.display = 'block';
    changeModalButtons();
    generateNewWorkModal();
}

const generateNewWorkModal = () => {
    const addPhotoSection = document.createElement('section');
    // const addPhotoIconContainer = document.createElement('div');
    const addPhotoIcon = document.createElement('i');
    const addPhotoInput = document.createElement('input');
    const addPhotoInputLabel = document.createElement('label');
    const addPhotoText = document.createElement('span');
    const form = document.createElement('form');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const input2 = document.createElement('div');
    // const label2 = document.createElement('label');
    input2.classList.add('selectContainer');
    input2.innerHTML = `
    <div class="label categoryLabel">Catégorie</div>
				<div class="select">
					<div class="selected defaultOption" ><i class="fa-solid fa-angle-up"></i></div>
					<div class="options hidden">
						<div class="option optionObjects">Objets</div>
						<div class="option optionAppartments">Appartements</div>
						<div class="option optionRestaurants">Hôtels et restaurants</div>
					</div>
				</div>
                `
    const section = document.querySelector('.modalGallery');
    section.setAttribute('isGallery', 'false');
    section.appendChild(addPhotoSection);

    addPhotoSection.classList.add('addPhotoSection');
    addPhotoSection.appendChild(addPhotoIcon);

    addPhotoIcon.classList.add('fa-regular', 'fa-image', 'fa-4x', 'addPhotoIcon');

    addPhotoSection.appendChild(addPhotoInput);
    addPhotoSection.appendChild(addPhotoInputLabel);
    addPhotoInput.classList.add('addPhotoInput');

    addPhotoInputLabel.classList.add('addPhotoInputLabel');
    addPhotoInputLabel.innerText = '+ Ajouter photo';
    addPhotoInputLabel.classList.add('addPhotoInputLabel');
    addPhotoInputLabel.setAttribute('for', 'addPhotoInput');
    addPhotoInput.setAttribute('type', 'file');
    addPhotoInput.setAttribute('name', 'addPhotoInput');
    addPhotoInput.setAttribute('id', 'addPhotoInput');
    addPhotoInput.setAttribute('accept', 'image/png, image/jpeg');

    addPhotoSection.appendChild(addPhotoText);
    addPhotoText.classList.add('addPhotoText');
    addPhotoText.innerText = 'jpg, png: 4mo max';

    section.appendChild(form);
    form.classList.add('addPhotoForm');
    form.appendChild(label);
    label.classList.add('titleLabel');
    label.innerText = 'Titre';
    form.appendChild(input);
    input.classList.add('titleInput');
    input.setAttribute('type', 't/ext');
    input.setAttribute('name', 'title');

    form.appendChild(input2);
}

const triggerSelectCategory = () => {
    const select = document.querySelector('.select');
    select.addEventListener('click', () => {
        const input = document.querySelector('.options');
        input.classList.toggle('hidden');
        const selected = document.querySelector('.defaultOption');
        selected.classList.toggle('isOpen');
    })
}

//MAIN CALLS
const works = await generateWorks();
setters();


