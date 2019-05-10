//import AjaxRequest from './AjaxRequest'
//import Game from './Game';

//export default
    class SpeechGame extends Game{
    constructor() {
        super();
        this.currentText = '';
        this.currentRecognition = null;
        this.limitSymbolsSentense = 300;
        this.currentStep = 0;
        this.limitStep = 5;
        this.stopWithoutResult = false;
        document.getElementById('stop-speech').onclick = this.stop.bind(this);
        document.getElementById('next-text-speech').onclick = this.nextStep.bind(this);
    }

    //---------Старт игры-------------
    start() {
        this.step(0);
    }
    //------Следующий шаг игры----------
    nextStep() {
        this.clear();
        this.step(this.currentStep + 1);   
        document.getElementById('next-text-speech').style.display = 'none';
        document.getElementById('stop-speech').style.display = 'inline-block';
    }
    //------Стоп----------
    stop() {
        document.getElementById('stop-speech').style.display = 'none';
        document.getElementById('next-text-speech').style.display = 'inline-block';
        this.currentRecognition.stop();
    }

    //---------Шаг игры--------
    step(i) {
        this.currentStep = i;
        if (i >= this.limitStep)
            return this.endGame();
        this.getText().then((text) => {
            let initialText = this.currentText = text;
            this.updateTextDOM();
            if (!this.currentText) 
                return this.message('Технические неполадки. Извините');           
            this.recognizer().then((recordText) => {
                let result = this.findCoincidences(initialText, recordText);
                document.getElementsByClassName('result-speech')[0].innerHTML = 'Вы прочитали текст: ' +'<span id="result-speech-level">'+ result+ '</span>';

            })
                .catch((error) => console.log(`ошибка при распозновании голоса: ${error}`));
        }).catch(error => this.message(error));
    }

    //---------Распознование речи------------
    recognizer() {
        let resultText = '';
        let preloaderDOM = document.getElementsByClassName('container')[0];
        preloaderDOM.style.display = 'flex';
        return new Promise((resolve, reject) => {
            if ('webkitSpeechRecognition' in window) {
                var recognition = this.currentRecognition = new webkitSpeechRecognition();
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
                    if (document.getElementById('stop-speech').style.display !== 'none') {
                        document.getElementById('stop-speech').style.display = 'none';
                        document.getElementById('next-text-speech').style.display = 'inline-block';
                    }
                    resolve(resultText);
                }.bind(this);
                recognition.start();
            } else {
                reject('webkitSpeechRecognition не поддерживается :(');
            }
        });
    }


    //---------Получение книги-------------
    getBook() {
        let url = `${document.location.origin}/Games/GetBookAsync`;
        let method = 'GET';
        let conn = new AjaxRequest(url, method);
        return conn.getJson();
    }
    //--------Обработка текста из книги---------------
    bookProcessing(book) {
        let regexp = /[.?!]/ig;
        let index;
        book = book.replace(/\s{2,}/g, " ");//удаление лишних пробелов
        index = Math.floor(Math.random() * book.length - this.limitSymbolsSentense);
        index = book.indexOf('.', index) + 1;
        let pieceBook = book.slice(index, index+this.limitSymbolsSentense);
        for (let res; res = regexp.exec(pieceBook);)
            index = res.index;
        pieceBook = pieceBook.slice(0, index + 1);
        return pieceBook;

    }
    //--------Получение текста из книги-------------
    getText() {
        return new Promise((resolve, reject) => {
            this.getBook().then((book) => {
                book = this.bookProcessing(book);
                resolve(book);
            })
                .catch((error) => {
                    console.log(`Ошибка при нахождении текста ${error}`);
                    reject(`Извините, текст не может быть загружен`);
                });
        })
    }



    //----------Сравнение текстов-----------//

    //-------Обработка текста-----------
    textProcessing(text) {
        text = text.trim();
        text = text.toLowerCase();
        text = text.replace(/[.+,\/#!$%\^&\*;:{}=\-_`…\'’‘“”—–?~()]/g, ""); //удаление знаков препинани
        text = text.replace(/\s{2,}/g, " ");//удаление лишних пробелов
        return text;
    }
    //-------Перевод процентов в уровень-------
    percentToLevel(percent) {
        switch (true) {
            case (percent === 0): return 'Ужасно';
            case (percent > 0 && percent < 30): return 'Плохо';
            case (percent >= 30 && percent < 50): return 'Нормально';
            case (percent >= 50 && percent < 70): return 'Хорошо';
            case (percent >= 70 && percent < 90): return 'Отлично';
            case (percent >= 90 && percent <= 100): return 'Безупречно';
                default: return 'Ошибка в распозновании';
        }
    }
    //-------Сравнение текстов и вывод результата совпадения-----------
    findCoincidences(textInput, textRecord) {
        let str1 = this.textProcessing(textInput);
        let str2 = this.textProcessing(textRecord);
        let percent, equal, levenshteinDistance,result;
        let maxLength = (str1.length > str2.length) ? str1.length : str2.length;
        console.log(str1);
        console.log(str2);
        levenshteinDistance = this.levenshtein(str1, str2);
        //число совпавших символов
        equal = maxLength - levenshteinDistance;
        percent = (!levenshteinDistance) ? 100 : Math.round(100 * equal / maxLength);
        console.log(`Проценты ${percent}`);
        (percent >= 50) ? this.upPoints() : this.downPoints();
        result = this.percentToLevel(percent);
        return result;
    }
     //---------Алгоритм нахождения совпадения оригинального текста и распознанного текста(Левенштейна)---------
    levenshtein(s1, s2, costs) {
    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;

    costs = costs || {};
    var cr = costs.replace || 1;
    var cri = costs.replaceCase || costs.replace || 1;
    var ci = costs.insert || 1;
    var cd = costs.remove || 1;

    cutHalf = flip = Math.max(l1, l2);

    var minCost = Math.min(cd, ci, cr);
    var minD = Math.max(minCost, (l1 - l2) * cd);
    var minI = Math.max(minCost, (l2 - l1) * ci);
    var buf = new Array((cutHalf * 2) - 1);

    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }

    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();

        buf[flip] = (i + 1) * minI;

        ii = flip;
        ii2 = cutHalf - flip;

        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
}


    //------------Работа с DOM-----------//

    //------Отрисовка текста в DOM--------
    updateTextDOM() {
        document.getElementsByClassName('lds-default')[0].style.display = 'none';
        document.getElementsByClassName('text-speech')[0].innerText = this.currentText;
    }
    //------Очищение поля----------
    clear() {
        this.currentRecognition = null;
        document.getElementsByClassName('result-speech')[0].innerText = '';
        document.getElementsByClassName('text-speech')[0].innerText = '';
        document.getElementsByClassName('lds-default')[0].style.display = 'block';
    }
}
