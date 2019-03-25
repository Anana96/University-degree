'use strict';

class ExampleSentencesGame extends Game {

    constructor() {
        super();
        this.sentences = null;
        this.limitSentences = 6;
        this.answerButton = 0;
    }

    start() {
        super.start();
        console.log("Начало игры");
        this.initStep();
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            console.log(dictionary);
            dictionary.sort(() => {
                return Math.random() - 0.5;
            });
            console.log(dictionary);
            this.dictionary = dictionary;
            this.lenghtDictionary = Object.keys(this.dictionary).length; 
            if (!this.validation()) {
                return;
            }
            this.step(0);
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));
    }

    //--------Получение предложений из Оксфордского словаря--------
    getSentense(word) {
        let connOxford = new OxfordApi();
        return connOxford.getSentenseExemple(word).then((sentenses) => {
             if (!sentenses)
                 return null
             sentenses = sentenses.filter((item, index) => { return index < this.limitSentences });
             sentenses = sentenses.map((item) => { return item.replace(new RegExp(word.toLowerCase(), 'gi'), '_'.repeat(word.length)) });
             return sentenses;
         });
    }

    //--------Cлучайное значение в массиве--------
    getRandomValueArray(arr) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
    }

    //-----------Отрисовка текста на поле---------------
    drawTextInDOM() {
        let textDOM = document.getElementById('block-examples-texts');
        let sentences = this.sentences;
        let list = '';
        for (let i = 0; i < sentences.length; i++) {
            list += `<li>${sentences[i]}</li>`;
        }
        textDOM.innerHTML = `<ul> ${list} </ul>`;
    }

    //-------Проверка словаря----------
    validation() {
        super.validation();
        if (this.lengthDictionary <= 3) {
            //месседж на экране
            console.log("Недостаточно слов в словаре");
            return false;
        }
        return true;
    }

    //--------Инициализация шага---------
    initStep() {
        document.getElementById("body-third-game").style.display = 'none';
        let preloaderDOM = document.getElementsByClassName('lds-default')[0];
        preloaderDOM.style.display = 'block';
    }


    //--------Отрисовка шага-------------
    drawStep(i , word) {
        this.drawTextInDOM();
        this.drawButtonInDOM(i, word);
        document.getElementById("body-third-game").style.display = 'block';
        let preloaderDOM = document.getElementsByClassName('lds-default')[0];
        preloaderDOM.style.display = 'none';
    }

    //-----------Отрисовка кнопок-----------
    drawButtonInDOM(i,word) {
        //отрисовка кнопоки с правильным ответом
        let orderButton = [0, 1, 2];
        this.randomArraySort(orderButton);
        let answer = orderButton[0];
        this.answerButton = answer;
        let buttonWithCurrentWord = document.getElementsByClassName('button-options')[answer];
        buttonWithCurrentWord.onclick = () => { this.upPoints(); }
        buttonWithCurrentWord.innerText = word;

        //выбор 2х случайных слов из словоря:
        let Word1 = word;
        let Word2 = word;
        let lengthDictionary = Object.keys(this.dictionary).length;

        if (lengthDictionary > i)
            while (Word1 === word) {
            Word1 = this.getRandomValueArray(this.dictionary).English;
        }
        while (Word2 === word || Word2 === Word1) {
            Word2 = this.getRandomValueArray(this.dictionary).English;
        }
        let buttonWithRandomWord1 = document.getElementsByClassName('button-options')[orderButton[1]];
        buttonWithRandomWord1.onclick = () => { this.downPoints();}
        buttonWithRandomWord1.innerText = Word1;
        let buttonWithRandomWord2 = document.getElementsByClassName('button-options')[orderButton[2]];
        buttonWithRandomWord2.onclick = () => { this.downPoints(); }
        buttonWithRandomWord2.innerText = Word2;
    }


    //----------Шаг игры--------
    step(i) {
    this.initStep();
    let eng = this.dictionary[i].English;
    console.log(eng);
        this.getSentense(eng).then((sentense) => {
            if (!sentense) {
                if (i == this.lenghtDictionary - 1) {
                    this.endGame();
                } else {
                    this.step(++i);
                }
                return;
            }
            //отрисовка текста
            this.sentences = sentense;
            this.drawStep(i, eng);


            //асинхронный запрос(ожидание,когда пользователь даст правильный ответ)
            this.getAnswer().then(
                (value) => {
                    if (value) {
                        if (i == this.lenghtDictionary - 1) {
                            this.endGame();
                        }
                        else
                            this.step(++i);
                    }
                })
                .catch(err => console.log(err))

        });

    }


//--------Асинхронная функция отслеживающая выбор правильного ответа----------
    getAnswer() {
        return new Promise((resolve) => {
            let index = this.answerButton;
            document.getElementsByClassName('button-options')[index].addEventListener('click', () => {
                resolve(true);
            })
        });
    }


    //--------Перемешивание массива--------
    randomArraySort(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
     }

}
