const fetchWorks = async function (workId) {
    const res = await fetch('http://localhost:5678/api/works', { method: 'GET' });
    const worksList = await res.json();
    if (workId > 0) {
        return worksList.filter(work => work.categoryId === workId);
    }
    else {
        return worksList;
    }

}

const generateWork = function (work) {
    const workElement = document.createElement('figure');
    workElement.setAttribute('id', 'work_' + work.id);
    const workElementFigureImg = document.createElement("img");
    workElementFigureImg.src = work.imageUrl;
    workElementFigureImg.crossOrigin = "anonymous";
    workElementFigureImg.setAttribute('alt', work.title);
    const captionWork = document.createElement("figcaption");
    captionWork.innerText = work.title;
    document.querySelector('.gallery').appendChild(workElement);
    document.getElementById('work_' + work.id).appendChild(workElementFigureImg);
    document.getElementById('work_' + work.id).appendChild(captionWork);

}

const generateWorks = async function (workId) {
    const works = await fetchWorks(workId);

    document.querySelector('.gallery').innerHTML = '';

    for (let work of works) {
        generateWork(work);
    }

    return works;
}

const triggers = function () {
    triggerNavContact();
    triggerFilter();
    triggerNavLogin();
    triggerNavWork();
}

const triggerFilter = function () {
    const filtersInput = document.querySelectorAll('.filter input');
    for (let filter of filtersInput) {
        filter.addEventListener('change', function (event) {
            // console.log('filter: ' + event.target.id);
            switch (event.target.id) {
                case 'radio0': generateWorks(0); break;
                case 'radio1': generateWorks(1); break;
                case 'radio2': generateWorks(2); break;
                case 'radio3': generateWorks(3); break;
            }
            // generateWorks();
        });
    }

}

const triggerNavContact = function () {
    const contactTrigger = document.querySelector('.contact');
    contactTrigger.addEventListener('click', function () {
        console.log('contact');
        document.querySelector('.worksGallery').style.fontWeight = '400';
        document.querySelector('.login').style.fontWeight = '400';
        document.querySelector('.contact').style.fontWeight = '600';
        showWorks();
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }, true);
        document.querySelector('#login').style.display = 'none';
    });


}

const triggerNavWork = function () {
    const backToWorks = document.querySelector('.worksGallery');
    backToWorks.addEventListener('click', function () {
        console.log('works');
        document.querySelector('.worksGallery').style.fontWeight = '600';
        document.querySelector('.login').style.fontWeight = '400';
        document.querySelector('.contact').style.fontWeight = '400';
        document.querySelector('#login').style.display = 'none';
        showWorks();

    });

}

const triggerNavLogin = function () {
    const loginTrigger = document.querySelector('.login');
    loginTrigger.addEventListener('click', function () {
        console.log('login');
        hideZone('#introduction');
        hideZone('#portfolio');
        hideZone('#contact');
        document.querySelector('.worksGallery').style.fontWeight = '400';
        document.querySelector('.login').style.fontWeight = '600';
        document.querySelector('.contact').style.fontWeight = '400';
        document.querySelector('#login').style.display = 'flex';
    });

}

const triggerLoginSubmit = function () {
    // const loginSubmit = document.querySelector('#loginSubmit');
    const email = document.querySelector('#email_input').value;
    document.querySelector('#email_input').value = '';
    const password = document.querySelector('#password_input').value;
    document.querySelector('#password_input').value = '';

    console.log(email + ' ' + password);
    console.log('works');
    
    document.querySelector('.worksGallery').style.fontWeight = '600';
    document.querySelector('.login').style.fontWeight = '400';
    document.querySelector('.contact').style.fontWeight = '400';
    document.querySelector('#login').style.display = 'none';
    document.querySelector('.login').innerText = 'logout';
    showWorks();

    
}

const showWorks = function () {
    document.querySelector('#portfolio').style.display = 'flex';
    document.querySelector('#introduction').style.display = 'flex';
    document.querySelector('#contact').style.display = 'block';
}

const hideZone = function (zone) {
    document.querySelector(zone).style.display = 'none';
}
//MAIN CALLS
const works = generateWorks();
triggers();
