

class AudioTranslationGame extends Game {
    constructor() {
        super();
        this.currentInterval = null;
    }

    start() {
        super.start();
        console.log("Начало игры");
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            if (dictionary)
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

    //-------Установка аудио в DOM----------
    setAudioDOM(audio) {
        let audioDOM = document.getElementById('audio-eng');
        audioDOM.src = audio;
        audioDOM.play();
    }

    //-----Инициализация таймера-----
    setTimerDOM() {
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = this.time;
        timerInDOM.className = '';
    }

    //-------Работа таймера и проверка ответа(замыкание)-------
    timer(i) {
        let word = this.dictionary[i].English;
        let time = this.time;
        let timerInDOM = document.getElementById('timer');
        let inputDOM = document.getElementById('user-input');
        this.setTimerDOM();
        var currentInterval = setInterval(() => {
            time--;
            timerInDOM.innerText = time;
            if (time == 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                this.downPoints();
                clearInterval(currentInterval);
                this.stepWithInterval(i - 1);
                return;
            }
            inputDOM.addEventListener('keyup', () => {
                if (word.toLowerCase() == inputDOM.value.toLowerCase()) {
                    this.upPoints();
                    clearInterval(currentInterval);
                    this.stepWithInterval(i - 1);
                    return;
                }
            });
        }, 1000);

    }

    //----------Шаг игры--------
    stepWithInterval = (i) => {
        document.getElementById('user-input').value = '';
        if (i >= 0) {
            let word = this.dictionary[i].English;
            let connOxford = new OxfordApi();
            connOxford.getAudioExemple(word).then((audio) => {
                if (!audio) {
                    console.log('аудио пропущено');
                    this.stepWithInterval(i - 1);
                    return;
                }
                this.setAudioDOM(audio);
                this.timer(i,word);
            });
            
        }
        else {
            this.endGame();
        }
    }

}


