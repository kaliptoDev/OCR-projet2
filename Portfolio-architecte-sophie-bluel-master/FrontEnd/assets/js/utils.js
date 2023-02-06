const STORAGE_KEY = "user_token"

export const setStorage = (data) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export const getStorage = () => {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
}

export const createUserJson = (email, password) => {

    const user = {
        email: email,
        password: password
    }

    return user;

}

export const fetchAPI = async (url, method, payload) => {
    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: payload || null
        });
        if (!res.ok) throw new Error(res.status);

        const data = await res.json();
        // console.log(data);
        return data;
    }
    catch (error) {
        console.log(error);
        return null;
    }

}
