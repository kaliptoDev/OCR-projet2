export const STORAGE_KEY = "user_token"

export const setStorage = (data) => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export const getStorage = () => {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
}

export const deleteStorage = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
}

export const createUserJson = (email, password) => {

    const user = {
        email: email,
        password: password
    }

    return user;

}

export const fetchAPIMultipart = async (url, method, payload) => {
    let headers = {}
    if (method === 'DELETE' || method === 'POST') {
        headers = {
            'Authorization': 'Bearer ' + getStorage().token
        };
    } else {
        console.warn('Methode inexistante ou non reconnue');
        console.warn('Méthode utilisée: ' + method || 'Aucune');
        console.warn('Méthodes acceptées: DELETE, POST');
        console.warn('Fetch non accompli');
    }

    const res = await fetch(url, {
        method: method,
        headers: headers || null,
        body: payload || null
    });
    return res;

}

export const fetchAPI = async (url, method, payload) => {
    let headers = {}
    if (method === 'DELETE') {
        headers = {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + getStorage().token
        };
    } else {
        headers = { 'Content-Type': 'application/json;charset=utf-8' };
    }

    const res = await fetch(url, {
        method: method,
        headers: headers,
        body: payload || null
    });
    if(method=== "DELETE"){
        setTimeout(() => {return res}, 5000);
    }
    return res;

}

export const resetFooter = () => {
    document.querySelector('body').classList.remove('loginPage');
    document.querySelector('footer').style.bottom = '';
}

export const  deleteAllWorksFromDB = async () => {
    try {
        const reponse = await fetchAPI('http://localhost:5678/api/works', 'GET', null);
        if (reponse.status === 200) {
            const works = await reponse.json();
            works.forEach(work =>{
                
                deleteWorkFromDB(work.id);
            })
        } else {
            throw new Error('Une erreur est survenue, veuillez réessayer. Erreur: ' + reponse.status);
        }

    } catch (error) {
        console.warn(error);
        alert('Une erreur est survenue, veuillez réessayer. Erreur: ' + error);
    }
}

export const deleteWorkFromDB = async (id) => {
    try {
        const reponse = await fetchAPI(`http://localhost:5678/api/works/${id}`, 'DELETE');
        if (reponse.status === 200) {
        } else if (reponse.status === 401) {
            console.warn('Unauthorized');
            throw new Error('Unauthorized');
        }
        else if (reponse.status === 500) {
            console.warn('Unexepected behaviour');
            throw new Error('Unexepected behaviour');
        }
    } catch (error) {
        console.warn(error);
        alert('Une erreur est survenue, veuillez réessayer. Erreur: ' + error);
    }
    
}

