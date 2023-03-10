
import * as utils from './index.js'
import { fetchAPIMultipart } from './index.js';

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
    triggerGalleryDeletion();
    applyChangesAdminBarTrigger();
}

const triggerFilter = () => {
    const filtersInput = document.querySelectorAll('.filter input');
    for (let filter of filtersInput) {
        filter.addEventListener('change', (event) => {
            displayWorksInMainGallery(parseInt(event.target.id.slice(5)))
        });
    }
}

const triggerNavContact = () => {
    const contactTrigger = document.querySelector('.contact');
    contactTrigger.addEventListener('click', function () {
        navUpdate('400', '400', '600', 'none', true)
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }, true);
        utils.resetFooter();
    });
}

const triggerNavLogin = () => {
    const loginTrigger = document.querySelector('.login');
    loginTrigger.addEventListener('click', triggerLogInorOut);

}

const triggerNavWork = () => {
    const backToWorks = document.querySelector('.worksGallery');
    backToWorks.addEventListener('click', () => {
        navUpdate('600', '400', '400', 'none', true)
        utils.resetFooter();
    });
}

const triggerModal = () => {
    const modal = document.querySelector('#portfolioEditButton');
    modal.addEventListener('click', () => openAndUpdateModal());
}

const triggerModalClose = () => {
    const modal = document.querySelector('.modalCloseButton');
    modal.addEventListener('click', () => closeModal());
    const modalBg = document.querySelector('.modalBg');
    modalBg.addEventListener('click', () => closeModal());
}

const triggerGalleryDeletion = () => {
    const galleryDelete = document.querySelector('.modalDeleteGallery');
    galleryDelete.addEventListener('click', async () => {
        await utils.deleteAllWorksFromDB();
        document.querySelector('.modalGallery').innerHTML = '';
        document.querySelector('.gallery').innerHTML = '';
    });
}

const applyChangesAdminBarTrigger = () => {
    const adminBar = document.querySelector('.publishChanges');
    adminBar.addEventListener('click', () => {
    })
}


const closeModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'none';
}

const openAndUpdateModal = () => {
    displayModal();
    triggersInsideModal();
}



const displayModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'flex';
    const modalH2 = document.querySelector('.modalH2');
    modalH2.innerText = 'Galerie photo';
    const modalConfirmNewWork = document.querySelector('.modalConfirmNewPhotoButton');
    modalConfirmNewWork.style.display = 'none';
    const modalAddAPhotoButton = document.querySelector('.addModalPhotoButton');
    modalAddAPhotoButton.style.display = 'block';
    const modalDeleteGallery = document.querySelector('.modalDeleteGallery');
    modalDeleteGallery.style.display = 'block';
    document.querySelector('.modalBackButton').style.display = 'none';
    updateModal();

}

const updateModal = async () => {
    updateDisplayModal();
    await displayWorksModal();
}

const updateDisplayModal = () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';
    const modalBg = document.querySelector('.modalBg');
    modalBg.style.display = 'flex';
    const modalH2 = document.querySelector('.modalH2');
    modalH2.innerText = 'Galerie photo';
    const modalConfirmNewWork = document.querySelector('.modalConfirmNewPhotoButton');
    modalConfirmNewWork.style.display = 'none';
    const modalAddAPhotoButton = document.querySelector('.addModalPhotoButton');
    modalAddAPhotoButton.style.display = 'block';
    const modalDeleteGallery = document.querySelector('.modalDeleteGallery');
    modalDeleteGallery.style.display = 'block';
    document.querySelector('.modalBackButton').style.display = 'none';
}

const triggersInsideModal = () => {
    triggerModalBack();
    triggerAddWorkToModal();
    triggerModalBack();
}

const triggerAddWorkToModal = () => {
    const modalAddPhotoButton = document.querySelector('.addModalPhotoButton');
    modalAddPhotoButton.addEventListener('click', () => {
        displayNewWorkModal();
        triggerPhotoInput();
        triggerSelectCategory();
    });
}

const displayNewWorkModal = () => {
    document.querySelector('.modalGallery').innerHTML = '';
    const modalH2 = document.querySelector('.modalH2');
    modalH2.innerText = 'Ajout photo';
    document.querySelector('.modalBackButton').style.display = 'block';
    changeModalButtons();
    generateAndDisplayNewWorkModal();
    const title = document.querySelector('.titleInput');
    title.addEventListener('input', () => checkIfNewWorkComplete());

}

const triggerPhotoInput = () => {
    const input = document.querySelector('.addPhotoInput');
    input.addEventListener('change', handleImageInput);
}

const handleImageInput = () => {
    previewFile();
    checkIfNewWorkComplete();
}

const previewFile = () => {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        const section = document.querySelector('.addPhotoSection')
        section.querySelector('i').style.display = 'none';
        section.querySelector('span').style.display = 'none';
        section.querySelector('label').style.display = 'none';
        const img = document.createElement('img');
        img.classList.add('addPhotoPreview');
        section.appendChild(img);
        img.src = reader.result;
        checkIfNewWorkComplete();
    });

    if (file) {
        reader.readAsDataURL(file);
    }
}

const triggerSelectCategory = () => {
    const select = document.querySelector('.defaultOption');
    select.addEventListener('click', () => {
        const input = document.querySelector('.options');
        input.classList.toggle('hidden');
        const arrow = document.querySelector('.selectorArrow');
        arrow.classList.toggle('isOpen');
        checkIfNewWorkComplete();
    })
}

const checkIfNewWorkComplete = () => {
    const title = document.querySelector('.titleInput').value;
    const category = document.querySelector('.selectedOption').innerText;
    const img = document.querySelector('.addPhotoPreview');
    if (title && category && img) {
        updateValidateButton(true);
    }
    else {
        updateValidateButton(false);
    }
}

const updateValidateButton = (isComplete) => {
    const button = document.querySelector('.modalConfirmNewPhotoButton');
    if (isComplete) {
        button.setAttribute('allowed', true);
        triggerValidateButton();
    }
    else {
        button.setAttribute('allowed', false);
        removeListenerFromButton();
    }
}

const triggerValidateButton = () => {
    const button = document.querySelector('.modalConfirmNewPhotoButton');
    button.addEventListener('click', triggerModalConfirmNewWork);
}

const removeListenerFromButton = () => {
    const button = document.querySelector('.modalConfirmNewPhotoButton');
    button.removeEventListener('click', triggerModalConfirmNewWork);
}

const triggerModalConfirmNewWork = async () => {
    await pushWorkIntoDB();
    updateModal();
    displayWorksInMainGallery();
}

const pushWorkIntoDB = async () => {
    const file = document.querySelector('.addPhotoInput').files[0];
    const data = new FormData();
    const category = document.querySelector('.selectedOption').innerText;
    let categoryId = 0;
    if (category === 'Objets') {
        categoryId = 1;
    } else if (category === 'Appartements') {
        categoryId = 2;
    } else if (category === 'Hôtels et restaurants') {
        categoryId = 3;
    }
    data.append('title', document.querySelector('.titleInput').value);
    data.append('image', file);
    data.append('category', categoryId);

    await fetchAPIMultipart('http://localhost:5678/api/works', 'POST', data)
}

const generateAndDisplayNewWorkModal = () => {
    const section = document.querySelector('.modalGallery');
    const addPhotoSection = document.createElement('section');
    const addPhotoIcon = document.createElement('i');
    const addPhotoInput = document.createElement('input');
    const addPhotoInputLabel = document.createElement('label');
    const addPhotoText = document.createElement('span');
    const form = document.createElement('form');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const input2 = document.createElement('div');
    input2.classList.add('selectContainer');

    input2.innerHTML = `
    <div class="label categoryLabel">Catégorie</div>
				<div class="select">
					<div class="selected defaultOption" ><span class="selectedOption"></span><i class="fa-solid fa-angle-up selectorArrow"></i></div>
					<div class="options hidden">
						<div id="option_1" class="option optionObjects" >Objets</div>
						<div id="option_2" class="option optionAppartments" >Appartements</div>
						<div id="option_3" class="option optionRestaurants" >Hôtels et restaurants</div>
					</div>
				</div>
                `

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
    addPhotoInput.setAttribute('required', 'true');
    addPhotoInput.setAttribute('size', '4194304');
    addPhotoIcon.crossOrigin = "anonymous";

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
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'title');

    form.appendChild(input2);

    const option1 = document.querySelector('#option_1');
    const option2 = document.querySelector('#option_2');
    const option3 = document.querySelector('#option_3');

    option1.onclick = () => { updateSelected('1') }
    option2.onclick = () => { updateSelected('2') }
    option3.onclick = () => { updateSelected('3') }

}

const updateSelected = (id) => {
    document.querySelector('.selectorArrow').classList.toggle('isOpen');
    const selected = document.querySelector('.selectedOption');
    const selectedOption = document.querySelector(`#option_${id}`);
    selected.innerText = selectedOption.innerText;
    const input = document.querySelector('.options');
    input.classList.toggle('hidden');
    checkIfNewWorkComplete();
}

const changeModalButtons = () => {
    const modalAddAPhotoButton = document.querySelector('.addModalPhotoButton');
    modalAddAPhotoButton.style.display = 'none';
    const modalDeleteGallery = document.querySelector('.modalDeleteGallery');
    modalDeleteGallery.style.display = 'none';
    const modalConfirmNewWork = document.querySelector('.modalConfirmNewPhotoButton');
    modalConfirmNewWork.style.display = 'block';
}

const triggerModalBack = () => {
    const modalBackButton = document.querySelector('.modalBackButton');
    modalBackButton.addEventListener('click', updateModal);
}

const displayWorksModal = async () => {
    document.querySelector('.modalGallery').innerHTML = '';

    const works = await generateWorks();

    const gallery = document.querySelector('.modalGallery');
    for (let work of works) {
        gallery.appendChild(generateWorkModal(work));
        const workTrash = document.querySelector(`#workTrash_${work.id}`);
        workTrash.addEventListener('click', async () => {
            await deleteModalGalleryItem(work.id);
            updateModal()
            displayWorksInMainGallery();
        });
    }
}

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
    return workElementFigure;
}

const deleteModalGalleryItem = async (workId) => {
    const workElement = document.querySelector(`#work_${workId}`);
    workElement.remove();

    utils.deleteWorkFromDB(workId);
}



const triggerLogInorOut = () => {
    if (utils.getStorage(utils.STORAGE_KEY)) {
        document.querySelector('.login').innerText = 'login';
        utils.deleteStorage();
        navUpdate('600', '400', '400', 'none', true);
        showFilters();
        displayWorksInMainGallery();
    }
    else {
        window.location.href = 'login/'
    }
    updateAdminBar();
    updateEditButtons();
}

const navUpdate = (parameter1, parameter2, parameter3, worksBoolean) => {
    document.querySelector('.worksGallery').style.fontWeight = parameter1;
    document.querySelector('.login').style.fontWeight = parameter2;
    document.querySelector('.contact').style.fontWeight = parameter3;
    if (worksBoolean) { showWorks(); }
}

const showWorks = () => {
    document.querySelector('#portfolio').style.display = 'flex';
    document.querySelector('#introduction').style.display = 'flex';
    document.querySelector('#contact').style.display = 'block';
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

const loggedInDetection = () => {
    if (utils.getStorage()) {
        document.querySelector('.login').innerText = 'logout';
        navUpdate('600', '400', '400', 'none', true)
        const userId = utils.getStorage(utils.STORAGE_KEY).userId;
        const token = utils.getStorage(utils.STORAGE_KEY).token;
        hideFilters();

    } else {
        showFilters();
    }
}

const hideFilters = () => {
    document.querySelector('.filters').classList.add('hidden');
    document.querySelector('#portfolioTitle').classList.add('margin50_0');
    document.querySelector('#portfolioTitle').classList.remove('margin60_0_40_0');
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

const hideZone = (zone) => {
    document.querySelector(zone).style.display = 'none';
}

const showZone = (zone) => {
    document.querySelector(zone).style.display = 'block';
}

const fetchWorks = async (workId) => {
    try {
        const reponse = await utils.fetchAPI('http://localhost:5678/api/works', 'GET');
        if (!reponse.ok) throw new Error(reponse.status);
        const data = await reponse.json();
        if (workId > 0) {
            return data.filter(work => work.categoryId === workId);
        }
        return data;

    }
    catch (error) {
        console.warn(error);
        alert('Erreur lors du chargement des oeuvres');
        return null;
    }
}

const showFilters = () => {
    document.querySelector('.filters').classList.remove('hidden');
    document.querySelector('#portfolioTitle').classList.remove('margin50_0');
    document.querySelector('#portfolioTitle').classList.add('margin60_0_40_0');
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
    document.getElementById('work_' + work.id).classList.add('work');

    return workElement;
}

const displayWorksInMainGallery = async (categoryId) => {
    document.querySelector('.gallery').innerHTML = '';
    const works = await generateWorks(categoryId);
    const gallery = document.querySelector('.gallery');
    for (let work of works) {
        gallery.appendChild(generateWork(work));
    }
    return works;
}


const generateWorks = async (categoryId) => {

    let works = [];
    works = await fetchWorks(categoryId);
    return works;
}

const init = () => {
    setters();
    displayWorksInMainGallery();
}

// INIT CALL

init();

