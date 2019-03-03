class AjaxRequest {
    constructor(url = '', method = '') {
        this.url = url;
        this.method = method;
    }

    getJson() {
        return fetch(this.url, { method: this.method })
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log("Ошибка обращения к серверу" + error.message);
            });
    }


}

function getUserLogin() {
    let url = `${document.location.origin}/Account/CurrentUser`;
    let method = 'Get';
    let conn = new AjaxRequest(url, method);
    return conn.getJson().then(response => { return response.UserLogin; });
    // console.log(` мой логин: ${login}`);
}


function getWordsFromDictionary() {
    user = getUserLogin();
    return user.then((login) => {
        let url = `${document.location.origin}/Games/GetExpressionTranslator?userName=${login}`;
        let method = 'Get';
        let conn = new AjaxRequest(url, method);
        return conn.getJson();
    });
}

//-------ИГРА----------//



function startGame(words) {
    words.then((dictionary) => {
        console.log(dictionary);
        createKonva(dictionary);
    })
        //.catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

}


function drawRectangle(stage, id, word) {

    let color = ['#c68724', '#4cff00', '#165ca3', '#c822bc', '#808080'];
    let valueRandomColor = Math.floor(Math.random() * color.length);

    var textOfWord = new Konva.Text({
        text: word,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: '#fff',
        padding: 100,
        align: 'center'
    });

    var rect = new Konva.Rect({
     //   stroke: '#dcdcdc',
       // strokeWidth: 0,
        fill: '#464b5e',
        width: textOfWord.getWidth(),
        height: textOfWord.getHeight(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.1
    });


    var group = new Konva.Group({
        x: stage.width() / 2 - textOfWord.getWidth()/2,
        y: stage.height() / 2 - textOfWord.getHeight() / 2,
        name: id.toString(),
    });
    group.add(rect, textOfWord);
    return group;
}

function createKonva(dictionary) {

    var stage = new Konva.Stage({
        container: 'container-konva',
        width: document.getElementById('container-konva').offsetWidth,
        height: document.getElementById('container-konva').offsetHeight
    });
    var layer = new Konva.Layer();
    stage.add(layer);
    var tempLayer = new Konva.Layer();
    stage.add(tempLayer);


    //dictionary.forEach((objectWord) => {
    //    let eng = objectWord.English;
    //    //let rus = objectWord.Russia;
    //    let id = objectWord.Id;
    //    let rectangleEng = drawRectangle(stage, id, eng);
    //    //let rectangleRus = drawRectangle(stage, id, rus);
    //    layer.add(rectangleEng);
    //    //layer.add(rectangleRus);
    //});

    let eng = dictionary[0].English;
    let id = dictionary[0].Id;
    let rectangleEng = drawRectangle(stage, id, eng);
    layer.add(rectangleEng);

    layer.draw();
}

function getPoints() {
    return document.getElementById('points').innerText;
}


function upPoints() {
    let points = document.getElementById('points').innerText;
    points = ++points;
    document.getElementById('points').innerText = points;
}

function downPoints() {
    let points = document.getElementById('points').innerText;
    points = --points;
    document.getElementById('points').innerText = points;
}

function endGame() {
    let konvaContainer = document.getElementById('container-konva');
    var div = document.createElement('div');
    div.className = "konva-dark";
    var message = document.createElement('span');
    message.className = "result-game";
    message.innerHTML = `Вы победили. <br> <span class="result-game-points">У вас ${getPoints()} балла</span>`;
    div.appendChild(message);
    konvaContainer.appendChild(div);
}

//точка входа
startGame(getWordsFromDictionary());