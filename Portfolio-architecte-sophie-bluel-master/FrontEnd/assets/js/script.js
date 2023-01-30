const fetchWorks = async function (workId) {
    const res = await fetch('http://localhost:5678/api/works', { method: 'GET' });
    const worksList = await res.json();
    if (workId > 0) {
        // worksList.filter(work => work.category.id === workId);
        // const worksListFiltered = worksList.filter(work => work.categoryId === workId);
        console.log('worksList: ' + JSON.stringify(worksList));
        console.log('Id :' + workId);
        return worksList.filter(work => work.categoryId === workId);
    }
    else {
        // worksListFiltered = worksList;
        console.log('nothing changed from the original list')
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

    // return workElement;
}

const generateWorks = async function (workId) {
    const works = await fetchWorks(workId);
    console.log('works: ');
    console.log(works);
    document.querySelector('.gallery').innerHTML = '';

    for (let work of works) {
        generateWork(work);
        console.log('work: ' + JSON.stringify(work.categoryId));
    }

    console.log('works:ldsklsdkj ' + JSON.stringify(works));

    return works;
}



//MAIN CALLS
const works = generateWorks();
//.then(works => console.log('works: ' + JSON.stringify(works)))
// const filters = document.querySelectorAll('.filter');

const filtersInput = document.querySelectorAll('.filter input');

console.log('filters: ' + JSON.stringify(filtersInput));

for (let filter of filtersInput) {
    filter.addEventListener('change', function (event) {
        console.log('filter: ' + event.target.id);
        switch (event.target.id) {
            case 'radio0': generateWorks(0); break;
            case 'radio1': generateWorks(1); break;
            case 'radio2': generateWorks(2); break;
            case 'radio3': generateWorks(3); break;
        }
        // generateWorks();
    });
}
