class AjaxRequest {
    constructor(url = '', method ='') {
        this.url = url;
        this.method = method;
    }

    getJson() {
        return fetch(this.url, { method: this.method })
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log("Ошибка обращения к серверу"+error.message);
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
        .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

}


function drawRectangle(stage, id, word) {

    let color = ['#c68724', '#4cff00', '#165ca3', '#c822bc', '#808080'];
    let valueRandomColor = Math.floor(Math.random() * color.length);

    var textOfWord = new Konva.Text({
       text: word,
       fontSize: 18,
       fontFamily: 'Calibri',
       fill: '#fff',
       padding: 20,
       align: 'center'
    });

    var rect = new Konva.Rect({
       stroke: '#dcdcdc',
       strokeWidth: 1,
       fill: color[valueRandomColor],
       width: textOfWord.getWidth(),
       height: textOfWord.getHeight(),
       shadowColor: 'black',
       shadowBlur: 10,
       shadowOffset: [10, 10],
       shadowOpacity: 0.1,
       cornerRadius: 15
    });

    //определение положения фигуры
    let width = Math.floor(Math.random() * (stage.width() - rect.getWidth()));
    let height = Math.floor(Math.random() * (stage.height() - rect.getHeight()));

    var group = new Konva.Group({
       x: width,
       y: height,
       draggable: true,
       name: id.toString(),
    });
    group.add(rect,textOfWord );
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

    ////текст с указанием движения
    //var text = new Konva.Text({
    //    fill: 'black'
    //});
    //layer.add(text);


    dictionary.forEach((objectWord) => {
        let eng = objectWord.English;
        let rus = objectWord.Russia;
        let id = objectWord.Id;
        let rectangleEng = drawRectangle(stage,id,eng);
        let rectangleRus = drawRectangle(stage,id,rus);
        layer.add(rectangleEng);
        layer.add(rectangleRus);
    });

    layer.draw();


    let drop = false;

    stage.on("dragstart", function (e) {
        e.target.moveTo(tempLayer);
        console.log('start');
    //    text.text('Moving ' + e.target.name());
        if (drop && previousShape) {
            previousShape.fire('dragleave', {
                type: 'dragleave',
                target: previousShape,
                evt: e.e
            }, true);
            previousShape = undefined;
        }
        layer.draw();

});


    var previousShape;
 
stage.on("dragmove", function (evt) {
    var pos = stage.getPointerPosition();
    var shape = layer.getIntersection(pos, 'Group');
    if (!previousShape && !shape) return;
    if (previousShape && shape) {
        if (previousShape !== shape) {
            // leave from old targer
            previousShape.fire('dragleave', {
                type: 'dragleave',
                target: previousShape,
                evt: evt.evt
            }, true);

            // enter new targer
            shape.fire('dragenter', {
                type: 'dragenter',
                target: shape,
                evt: evt.evt
            }, true);
            previousShape = shape;
        } else {
            previousShape.fire('dragover', {
                type: 'dragover',
                target: previousShape,
                evt: evt.evt
            }, true);
        }
    } else if (!previousShape && shape) {
        previousShape = shape;
        shape.fire('dragenter', {
            type: 'dragenter',
            target: shape,
            evt: evt.evt
        }, true);
    } else if (previousShape && !shape) {
        previousShape.fire('dragleave', {
            type: 'dragleave',
            target: previousShape,
            evt: evt.evt
        }, true);
         previousShape = undefined;
    }
    else
        return;
    });


    stage.on("dragend", function (e) {
    console.log('end');
    if (previousShape) {
        if (previousShape.getName() === e.target.getName()) {
            e.target.moveTo(layer);
            e.target.destroy();
            previousShape.destroy();
            upPoints();
            layer.draw();
            tempLayer.draw();
            checkEnd(layer, tempLayer);
            return;
        } else {
            downPoints();
            previousShape.fire('drop', {
                type: 'drop',
                target: previousShape,
                evt: e.evt
            }, true);
            drop = true;
        }
    }


    e.target.moveTo(layer);
    layer.draw();
    tempLayer.draw();
    });

    stage.on("drop", function (e) {
        console.log('drop');
        console.log(e.target);
        let rectLower = e.target.getChildren()[0];
        rectLower.fill('red');
      //  text.text('drop ' + e.target.name());
        layer.draw();
    });

    
    stage.on("dragenter", function (e) {
    console.log('enter');
    let rectLower = e.target.getChildren()[0];
    colorBack = rectLower.getAttr('fill');
    rectLower.fill('yellow');
   // text.text('dragenter ' + e.target.name());
    layer.draw();
});

    stage.on("dragleave", function (e) {
    console.log('leave');
    console.log(e.target);
    let rectLower = e.target.getChildren()[0];
    rectLower.fill(colorBack);
   // text.text('dragleave ' + e.target.name());
    layer.draw();
});


    let colorBack;

    stage.on("dragover", function (e) {
    console.log('over');
   // text.text('dragover ' + e.target.name());
    layer.draw();
    });


    function checkEnd(layer) {
        console.log(layer);
        console.log(layer.children.length);
        if (layer.children.length === 0) {
            console.log('Игра закончена');
            stage.destroy();
            endGame();
        }
        else
            console.log('Продолжаем игру');
    }

    
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