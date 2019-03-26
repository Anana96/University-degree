//export default
    class AjaxRequest {
    constructor(url, method = 'GET') {
        this.url = url;
        this.method = method;
    }

    getJson() {
        return fetch(this.url, { method: this.method})
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log("Ошибка обращения к серверу " + error.message);
            });
    }


}