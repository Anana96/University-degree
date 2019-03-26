//получение текста из запроса к оксфордскому словарю
import AjaxRequest from './AjaxRequest'


export default class OxfordApi {
    constructor() {
        this.urlServerAudio = `${document.location.origin}/Games/OxfordAudio`;
        this.urlSeverSentense = `${document.location.origin}/Games/OxfordSentense`;
    }


    //получение примеров предложений
     getSentenseExemple(word){
        let sentense = [];
        let urlServer = `${this.urlSeverSentense}?word=${word.toLowerCase()}`;
        let conn = new AjaxRequest(urlServer, this.method);
         return conn.getJson().then(response => {
            if (response == "word not found")
                 return null;
            let responseJson = JSON.parse(response);
            responseJson = responseJson.results[0].lexicalEntries[0].sentences;
            responseJson.forEach((item) => {
                sentense.push(item.text);
            })
            return sentense;
        });
    }

    getAudioExemple (word) {
        let urlAudio = '';
        let urlServer = this.urlServerAudio + '?word=' + word;
        let conn = new AjaxRequest(urlServer, this.method);
        return conn.getJson().then(response => {
            if (response == "audio not found")
                return null;
            let responseJson = JSON.parse(response);
            urlAudio = responseJson.results[0].lexicalEntries[0].pronunciations[0].audioFile;
            console.log(responseJson);
            return urlAudio;
        });
    }



}