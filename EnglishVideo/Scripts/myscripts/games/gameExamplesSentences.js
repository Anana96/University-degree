//import OxfordApi from './OxfordApi'
//import Game from './Game';

//export default
class ExampleSentencesGame extends Game {

    constructor() {
        super();
        this.sentences = null;
        this.limitSentences = 3;
        this.limitWords = 5;
        this.answerButton = 0;
        this.currentWord = '';
        this.currentStep = 0;
    }

    //---------Инициализация шага игры---------
    initStep() {
        this.sentences = null;
        document.getElementById("body-third-game").style.display = 'none';
        document.getElementsByClassName('lds-default')[0].style.display = 'block';
        let buttons = document.getElementsByClassName('button-options');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('wrong-button','success-button');
        }
    }

    //---------Старт игры-------------
    start() {
        super.start();
        console.log("Начало игры");
        this.initStep();
        //если словарь уже получен
        if (this.dictionary) {
            this.shakeArray(this.dictionary);
            this.step(0);
            return;
        }
        //получение словаря
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            this.setDictionary(dictionary);
            if (!this.validation()) {
                return;
            }
            this.step(0);
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));
    }

    //----------Шаг игры--------
    step(i) {
        if (i >= this.lenghtDictionary && i >= this.limitWords) {
            this.endGame();
            return;
        }
        this.currentStep = i;
        let eng = this.currentWord = this.dictionary[i].English;
        console.log(eng);
        this.getSentense(eng).then((sentense) => {
            if (!sentense) {   
                this.initStep();
                this.step(this.currentStep + 1);
                return;
            }
            //отрисовка текста
            this.sentences = sentense;
            this.drawStep();

            //асинхронный запрос(ожидание,когда пользователь даст правильный ответ)
            this.getAnswer().then(() => { this.initStep(); this.step(this.currentStep + 1); })
        }).catch(err => { console.log(err) });
    }

    //--------Получение предложений из Оксфордского словаря--------
    getSentense(word) {
        let connOxford = new OxfordApi();
        return connOxford.getSentenseExemple(word).then((sentenses) => {
            if (!sentenses)
                return null
            return sentenses;
        });
    }

    //--------Асинхронная функция отслеживающая выбор правильного ответа----------
    getAnswer() {
        return new Promise((resolve) => {
            document.getElementsByClassName('button-options')[this.answerButton].onclick = () => {
                this.upPoints();
                resolve()
            }
        });
    }

    //--------Cлучайное значение в массиве--------
    getRandomValueArray(arr) {
        let index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    //-------Проверка словаря----------
    validation() {
        super.validation();
        if (this.lengthDictionary <= 3) {
            this.message('Недостаточно слов в словаре');
            console.log("Недостаточно слов в словаре");
            return false;
        }
        return true;
    }



    //*-------Работа с DOM-----------*


    //--------Отрисовка шага-------------
    drawStep() {
        this.drawTextInDOM();
        this.drawButtonInDOM();
        document.getElementById("body-third-game").style.display = 'block';
        document.getElementsByClassName('lds-default')[0].style.display = 'none';
    }

    //--------Отрисовка и обработка текста на поле---------------
    drawTextInDOM() {
        let textDOM = document.getElementById('block-examples-texts');
        let sentences = this.sentences;
        let list = '';
        let template = '<span class="find-word">' + '_'.repeat(this.currentWord.length) + '</span>';
        sentences = sentences.filter((item, index) => { return index < this.limitSentences });
        sentences = sentences.map((item) => { return item.replace(new RegExp(this.currentWord.toLowerCase(), 'gi'), template) });
        for (let i = 0; i < sentences.length; i++) {
            list += `<li>${sentences[i]}</li>`;
        }
        textDOM.innerHTML = `<ul> ${list} </ul>`;
    }

    //--------Отрисовка кнопоки с правильным ответом-------
    drawCorrectButton() {
        let buttonWithCurrentWord = document.getElementsByClassName('button-options')[this.answerButton];
        buttonWithCurrentWord.innerText = this.currentWord;
    }

    //--------Отрисовка кнопоки с неправильным ответом-------
    drawWrongButton(number, word) {
        let buttonWithRandomWord = document.getElementsByClassName('button-options')[number];
        buttonWithRandomWord.innerText = word;
        buttonWithRandomWord.onclick = () => {
            this.downPoints();
            buttonWithRandomWord.classList.add('wrong-button');
        }
    }

    //--------Отрисовка кнопок c ответами-----------
    drawButtonInDOM() {
        let orderButton = [0, 1, 2];
        this.shakeArray(orderButton);
        this.answerButton = orderButton[0];
        //выбор 2х случайных слов из словоря:
        let word1 = this.currentWord;
        let word2 = this.currentWord;

        while (word1 === this.currentWord) {
            word1 = this.getRandomValueArray(this.dictionary).English;
        }
        while (word2 === this.currentWord || word2 === word1) {
            word2 = this.getRandomValueArray(this.dictionary).English;
        }
        this.drawCorrectButton();
        this.drawWrongButton(orderButton[1], word1);
        this.drawWrongButton(orderButton[2], word2);
    }
}