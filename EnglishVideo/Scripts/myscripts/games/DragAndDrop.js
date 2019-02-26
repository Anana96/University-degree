﻿class AjaxRequest {
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


function drawRectangle(stage, word, translate) {

    let color = ['#c68724', '#4cff00', '#165ca3', '#c822bc', '#808080'];
    let valueRandomColor = Math.floor(Math.random() * color.length);

    //var textOfWord = new Konva.Text({
    //    text: word,
    //    fontSize: 18,
    //    fontFamily: 'Calibri',
    //    fill: '#fff',
    //    padding: 20,
    //    align: 'center',
    //});

    ////определение положения фигуры
    //let width = Math.floor(Math.random() * (stage.width() - textOfWord.getWidth()));
    //let height = Math.floor(Math.random() * (stage.height() - textOfWord.getHeight()));

    //var rect = new Konva.Rect({
    //    stroke: '#fff',
    //    strokeWidth: 1,
    //    fill: color[valueRandomColor],
    //    width: textOfWord.getWidth(),
    //    height: textOfWord.getHeight(),
    //    shadowColor: 'black',
    //    shadowBlur: 10,
    //    shadowOffset: [10, 10],
    //    shadowOpacity: 0.1,
    //    cornerRadius: 10,
    //});





    // simple label
    var simpleLabel = new Konva.Label({
        x:0,
        y:0
    });



    simpleLabel.add(new Konva.Text({
        text: word,
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 10,
        fill: 'black',
        //draggable: true,
        name: word,
        zIndex:2
    }));

    simpleLabel.add(new Konva.Tag({
        fill: color[valueRandomColor],
        draggable: true
    }));


    let width = Math.floor(Math.random() * (stage.width() - simpleLabel.getWidth()));
    let height = Math.floor(Math.random() * (stage.height() - simpleLabel.getHeight()));
    simpleLabel.position({
        x: width,
        y: height
    });


    //var group = new Konva.Group({
    //    x: width,
    //    y: height,
    //    draggable: true,
    //    name: word
    //});
    //group.add(textOfWord, rect);

    return simpleLabel;
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
    //текст с указанием движения
    var text = new Konva.Text({
        fill: 'black'
    });
    layer.add(text);


    dictionary.forEach((objectWord) => {
        let eng = objectWord.English;
        let rus = objectWord.Russia;
        let rectangleEng = drawRectangle(stage,eng, rus);
        let rectangleRus = drawRectangle(stage,rus, eng);
        layer.add(rectangleEng);
        layer.add(rectangleRus);
    });

    layer.draw();




    //начало движения элемента
    stage.on("dragstart", function (e) {
        e.target.moveTo(tempLayer);
        text.text('Moving ' + e.target.name());
        layer.draw();
    });

    //покинутый элемент
    var previousShape;


    //движение
    stage.on("dragmove", function (evt) {
        var pos = stage.getPointerPosition();
        var shape = layer.getIntersection(pos);
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
    });

    //конец движения
    stage.on("dragend", function (e) {
        var pos = stage.getPointerPosition();
        var shape = layer.getIntersection(pos);
        if (shape) {
            previousShape.fire('drop', {
                type: 'drop',
                target: previousShape,
                evt: e.evt
            }, true);
        }
        previousShape = undefined;
        e.target.moveTo(layer);
        layer.draw();
        tempLayer.draw();
    });

    //первый раз накрывает другой
    stage.on("dragenter", function (e) {
        e.target.fill('green');
        text.text('dragenter ' + e.target.name());
        layer.draw();
    });

    let colorBack;
    //покидает другой и еще держится пользователем
    stage.on("dragleave", function (e) {
        e.target.fill('blue');
        text.text('dragleave ' + e.target.name());
        layer.draw();
    });

    //накрывает другой и еще держится пользователем
    stage.on("dragover", function (e) {
        text.text('dragover ' + e.target.name());
        layer.draw();
    });

    //элемент опускается на другой и остается
    stage.on("drop", function (e) {
        console.log(e.target);
        e.target.fill('red');
        text.text('drop ' + e.target.name());
        layer.draw();
        });

}


//точка входа
startGame(getWordsFromDictionary());