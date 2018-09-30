function request(url, options) {
    return fetch(url, options)
    .then(response => {
        if(response.status >= 200 && response.status < 400) {
            return response.json();
        } else {
            return Promise.reject(response.status);
        }
    });
}

export function get(url, options) {
    return request(url, options);
}
