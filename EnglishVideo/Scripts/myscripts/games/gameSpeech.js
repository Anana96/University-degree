//import AjaxRequest from './AjaxRequest'
//import Game from './Game';

//export default
    class SpeechGame extends Game{
    constructor() {
        super();
        this.currentText = '';
        this.currentRecognition = null;
        this.init();
        this.limitSentense = 3;
        this.currentStep = 0;
        this.limitStep = 5;
    }

    //-------Сеттер текущего текста на экране---------
    setCurrentText(text) {
    this.currentText = text;
    }
    //-------Сеттер текущего распознователя---------
    setCurrentRecognition(recognition) {
        this.currentRecognition = recognition;
    }

    init() {
        document.getElementById("next-text-speech").onclick = ()=> {
            if (this.currentStep <= this.limitStep) {
                this.start();
            }
            else {
                this.endGame();
            }
        };
        document.getElementById('stop-speech').onclick = () => {
            this.currentRecognition.stop();
        };
    }

    clear() {
        document.getElementsByClassName('result-speech')[0].innerText = '';
        document.getElementsByClassName('text-speech')[0].innerText = '';
        let preloaderDOM = document.getElementsByClassName('lds-default')[0];
        preloaderDOM.style.display = 'block';
    }

    start () {
        super.start();
        ++this.currentStep;
        this.clear();
        this.getText().then((text) => {
            let initialText = this.currentText = text;
            console.log("Начало игры speech");
            this.updateTextDOM();
            let preloaderDOM = document.getElementsByClassName('lds-default')[0];
            preloaderDOM.style.display = 'none';

            if (!this.currentText)
                return;

            this.recognizer().then((textRecord) => {
                console.log(`полученный текст: ${textRecord}`);
                let result = this.findCoincidences(initialText, textRecord);
                let interest = document.getElementsByClassName('result-speech')[0]; //процент
                if (result >= 50) {
                    this.upPoints();
                }
                else {
                    this.downPoints();
                }
                interest.innerText = 'Вы угадали на:' + result + '%';
            })
                .catch((error) => console.log(`ошибка при распозновании голоса: ${error}`));
        }).catch(error => this.message(error));
       

    }

    //---------Распознование речи------------
    recognizer() {
        let resultText = '';
        let preloaderDOM = document.getElementsByClassName('lds-default')[0];
        preloaderDOM.style.display = 'block';
        return new Promise((resolve, reject) => {
            if ('webkitSpeechRecognition' in window) {
                var recognition = new webkitSpeechRecognition();
                recognition.lang = 'en';
                recognition.continuous = true;
                recognition.onresult = function (event) {
                    var result = event.results[event.resultIndex];
                    resultText += result[0].transcript;
                    console.log(result[0].transcript);
                };

                recognition.onend = function () {
                    console.log('Распознавание завершилось.');
                    preloaderDOM.style.display = 'none';
                    resolve(resultText);
                };
                recognition.start();
                this.currentRecognition = recognition;

            } else {
                reject('webkitSpeechRecognition не поддерживается :(');
            }
        });
    }

    //----------Обработка текста-----------
    textProcessing(text) {
        text = text.toLowerCase();
        text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); //удаление знаков препинани
        text = text.replace(/\s{2,}/g, " ");//удаление лишних пробелов
        return text;

    }

    //----------Обработка текста и преобразование в массив-----------
    textConvertInArray(text) {
        text = this.textProcessing(text);
        text = text.split(' ');
        return text;
    }

    //---------Алгоритм нахождения совпадения оригинального текста и распознанного текста---------
    algorithmCoincidences(arr1, arr2) {
        let findWords = 0;
        let indexRecordPosition = 0;
        if (arr1.length === 1 || arr2.length === 1)
            return 0;
        arr1.forEach((word, index) => {
            let posPrev = indexRecordPosition - 1;
            let posNext = indexRecordPosition + 1;
            console.log(`Слово: ${index}, позиция записи: ${indexRecordPosition}`);
            if (word === arr2[indexRecordPosition]) {
                console.log(`find ${word}`);
                ++findWords;
                ++indexRecordPosition;
            } else
                if (posPrev >= 0) {
                    if (word === arr2[posPrev]) {
                        console.log(`find ${word}`);
                        ++findWords;
                    }
                } else
                    if (posNext <= arr2.length - 1) {
                        if (word === arr2[posNext]) {
                            console.log(`find ${word}`);
                            ++findWords;
                            indexRecordPosition = posNext + 1;
                        }
                    }
                    else
                        ++indexRecordPosition;
        });
        return findWords;
    }


    getBook() {
        let url = `${document.location.origin}/Games/GetBookAsync`;
        let method = 'GET';
        let conn = new AjaxRequest(url, method);
        return conn.getJson();
    }


    bookProcessing(book) {
        book = book.replace(/\s{2,}/g, " ");//удаление лишних пробелов
        book = book.split('.');
        let index = Math.floor(Math.random() * book.length - this.limitSentense);
        let newBook = [];
        for (let i = index; i < index + this.limitSentense; i++) {
            newBook.push(book[i]);
        }
        book = newBook.join('.');
        book += '.';
        return book;
    }

    //--------Следующий текст---\--------
        getText() {
            return new Promise((resolve, reject) => {
                let text = '';
                this.getBook().then((book) => {
                    text = this.bookProcessing(book);
                    resolve(text);
                    
                })
                    .catch((error) => {
                        console.log(`Ошибка при нахождении текста ${error}`);
                        reject(`Извините, текст не может быть загружен`);
                    });
            })    
    }



    //--------Отрисовка текста в DOM--------
    updateTextDOM() {
        let textDOM = document.getElementsByClassName('text-speech')[0];
        textDOM.innerText = this.currentText;
    }


    //-------Обработка текста и вывод процентов-----------
    findCoincidences(textInput, textRecord) {
        let arrTextInput = this.textConvertInArray(textInput);
        let arrTextRecord = this.textConvertInArray(textRecord);
        let totalWords = arrTextInput.length , findWords = 0 , interest = 0;
        //текстов нет
        console.log(arrTextInput);
        console.log(arrTextRecord);
        console.log(totalWords);
        findWords = this.algorithmCoincidences(arrTextInput, arrTextRecord);
        if (findWords === 0)
            return 0;
        interest = Math.floor(findWords / totalWords * 100);
        return interest;
    }


}
