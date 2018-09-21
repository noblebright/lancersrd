function request(url, options) {
    return fetch(url, options)
    .then(response => response.json());
}

export function get(url, options) {
    return request(url, options);
}
