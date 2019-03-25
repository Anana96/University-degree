

class Game {

    constructor() {
        this.points = 0;
        this.time = 15;
        this.dictionary = null;
        this.lenghtDictionary = 0;
    }

    start() {
        console.log('Начало игры(родительский класс)');
    }

    
    setDictionary(dictionary) {
        this.dictionary = dictionary;
        this.lenghtDictionary = dictionary.length;
    }
    //---------Определение текущего пользователя------------
    getUserLogin() {
        let url = `${document.location.origin}/Account/CurrentUser`;
        let method = 'Get';
        let conn = new AjaxRequest(url, method);
        return conn.getJson().then(response => { return response.UserLogin; });
    }

    //-------Получение словаря пользователя---------
    getWordsFromDictionary() {
        let user = this.getUserLogin();
        return user.then((login) => {
            let url = `${document.location.origin}/Games/GetExpressionTranslator?userName=${login}`;
            let method = 'Get';
            let conn = new AjaxRequest(url, method);
            return conn.getJson();
        });
    }


    //-------Проверка словаря----------
    validation() {
        console.log('валидация');
        if (this.lengthDictionary === 0) {
            this.message("Недостаточно слов в словаре");
            console.log("Недостаточно слов в словаре");
            return false;
        }
        return true;
    }
    //-------Получить очки-----
    getPoints() {
   // return document.getElementById('points').innerText;
        return this.points;
    }
    //------Увеличить очки-----
    upPoints() {
        let points = document.getElementById('points').innerText;
        this.points = this.points + 1;
        console.log(`Повышение баллов ${this.points}`);
        document.getElementById('points').innerText = this.points;
    }
    //------Уменьшить очки------
    downPoints() {
        let points = document.getElementById('points').innerText;
        this.points = this.points - 1;
        document.getElementById('points').innerText = this.points;
    }
    //-----Конец игры-------
    endGame() {
        document.getElementsByClassName('body-game')[0].style.display = 'none';
        let endDOM = document.getElementById('end-game');
        endDOM.style.display = 'flex';
        endDOM.innerHTML = `<div class='end-game-content'>Игра окончена. <br> <span class="result-game-points">У вас ${this.getPoints()} балла</span><div>`;
    }

    message(text) {
        document.getElementsByClassName('body-game')[0].style.display = 'none';
        let endDOM = document.getElementById('message-game');
        endDOM.style.display = 'flex';
        endDOM.innerHTML = `<div class='end-game-content'><span class="result-game-points"> ${text}</span><div>`;
    }


}

//export default Game;