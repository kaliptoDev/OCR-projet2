const fetchWorks = async function () {
    const res = await fetch('http://localhost:5678/api/works', { method: 'GET' });
    const worksList = await res.json();
    return worksList;
}

const generateWork = function (work) {
    const workElement = document.createElement('figure');
    workElement.setAttribute('id', 'work_' + work.id);
    // const workElementFigure = document.getElementById('work_' + work.id);
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

const generateWorks = async function () {
    const works = await fetchWorks();
    console.log('works: ');
    console.log(works);

    for (let work of works) {
        const workElement = generateWork(work);
    }




    return works;
}

//MAIN CALLS
const works = generateWorks().then(works => console.log('works: ' + JSON.stringify(works)));

// console.log('works: ' + works);