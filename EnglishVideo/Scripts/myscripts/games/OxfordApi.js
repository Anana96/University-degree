//получение текста из запроса к оксфордскому словарю
//import AjaxRequest from './AjaxRequest'


class OxfordApi {
    constructor() {
        this.urlServer = `${document.location.origin}/Games/OxfordRequest`
        this.urlOxford =`https://od-api.oxforddictionaries.com:443/api/v1/entries/`;
        this.method = 'GET';
        this.language = "en";
    }


//получение примеров предложений
 getSentenseExemple = (word) => {
    let sentense = [];
    let urlOxford = `${this.urlOxfrod}/${this.language}/${word.toLowerCase()}/sentences`;
    let urlServer = this.urlServer + '?url=' + urlOxford;
    let conn = new AjaxRequest(urlServer, this.method);
    return conn.getJson().then(response => {
        let responseJson = JSON.parse(response);
        responseJson = responseJson.results[0].lexicalEntries[0].sentences;
        responseJson.forEach((item) => {
            sentense.push(item.text);
        })
        sentense = sentense.filter((item, index) => { return index < 6 });
        sentense = sentense.map((item) => { return item.replace(new RegExp(word.toLowerCase(), 'gi'), '_'.repeat(word.length)) });
        return sentense;
    });
}

    getAudioExemple = (word) => {
        let urlAudio = '';
        //let urlOxford = `${this.urlOxfrod}/${this.language}/${word.toLowerCase()}`;
        let urlServer = this.urlServer + '?word=' + word;
        let conn = new AjaxRequest(urlServer, this.method);
        return conn.getJson().then(response => {
            let responseJson = JSON.parse(response);
            urlAudio = responseJson.results[0].lexicalEntries[0].pronunciations[0].audioFile;
            console.log(responseJson);
            return urlAudio;
        });
    }



}