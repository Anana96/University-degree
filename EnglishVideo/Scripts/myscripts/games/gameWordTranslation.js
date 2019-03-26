import Game from './Game';

export default class WordTranslationGame extends Game {
    constructor() {
        super();
    }


    start() {
        console.log("Начало игры");
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            //перемешиваем массив случайным образом
            if(dictionary)
            dictionary.sort(() => {
                return Math.random() - 0.5;
            });
            this.setDictionary(dictionary);
            if (!this.validation())
                return;
            this.stepWithInterval(this.lenghtDictionary - 1);
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

    }

    //-----Инициализация таймера-----
    setTimerDOM() {
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = this.time;
        timerInDOM.className = '';
    }

    //------Инициализации карточки с английским словом-------
    setEnglishTextDOM(word) {
        let engDOM = document.getElementById('card-eng');
        engDOM.innerText = word;
    }

    //-------Работа таймера и проверка ответа(замыкание)-------
    timer(i) {
        let time = this.time;
        let russianWord = this.dictionary[i].Russia;
        let timerInDOM = document.getElementById('timer');
        let rusDOM = document.getElementById('user-input');
        this.setTimerDOM();
       
        var currentInterval = setInterval(() => {
            console.log(`время ${time}; i=${i} перевод=${russianWord}`);
            time--;
            timerInDOM.innerText = time;
            if (time === 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                this.downPoints();
                clearInterval(currentInterval);
                this.stepWithInterval(i - 1);
                return;
            }
            rusDOM.addEventListener('keyup', () => {
                if (russianWord.toLowerCase() === rusDOM.value.toLowerCase()) {
                    this.upPoints();
                    clearInterval(currentInterval);
                    this.stepWithInterval(i - 1);
                    return;
                }
            });
        }, 1000);
    }

    //----------Шаг игры--------
    stepWithInterval (i) {
        document.getElementById('user-input').value = '';
        if (i >= 0) {
            this.setEnglishTextDOM(this.dictionary[i].English);
            this.timer(i);
        }
        else {
            this.endGame();
        }
    }

}

