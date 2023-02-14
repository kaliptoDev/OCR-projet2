export const STORAGE_KEY = "user_token"
export const SESSION_STORAGE_KEY = "temp_works"

export const setStorage = (data) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export const getStorage = () => {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
}

export const setSessionStorage = (data) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
}

export const getSessionStorage = () => {
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
}

export const deleteSessionStorage = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export const deleteStorage = () => {
    window.localStorage.removeItem(STORAGE_KEY);
}

export const createUserJson = (email, password) => {

    const user = {
        email: email,
        password: password
    }

    return user;

}

export const fetchAPI = async (url, method, payload) => {
    
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: payload || null
        });
        return res;

}

export const resetFooter = () => {
    document.querySelector('body').classList.remove('loginPage');
    document.querySelector('footer').style.bottom = '';

}