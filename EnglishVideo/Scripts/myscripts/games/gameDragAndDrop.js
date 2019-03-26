import Game from './Game';

export default class DragAndDropGame extends Game {

    constructor() {
        super();
    }

    start() {

        console.log("Начало игры");
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            this.setDictionary(dictionary);
            if(!this.validation())
              return;
            this.createKonva();
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

    }



    //--------Отрисовка прямоугольника с текстом-----------
    drawRectangle(stage,layer, id, word) {
        let color = ['#c68724', '#4cff00', '#165ca3', '#c822bc', '#808080'];
        let valueRandomColor = Math.floor(Math.random() * color.length);
        let textOfWord = new Konva.Text({
           text: word,
           fontSize: 18,
           fontFamily: 'Calibri',
           fill: '#fff',
           padding: 20,
           align: 'center'
        });
        let rect = new Konva.Rect({
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
        let x = Math.floor(Math.random() * (stage.width() - rect.getWidth()));
        let y = Math.floor(Math.random() * (stage.height() - rect.getHeight()));

        var pos =({ x: x, y: y });
        let group = new Konva.Group({
           x: x,
           y: y,
           draggable: true,
           name: id.toString(),
        });
        group.add(rect,textOfWord );
        return group;
}

    drawDictionary(stage,layer) {

        let dictionary = this.dictionary;
        dictionary.forEach((objectWord) => {
            let eng = objectWord.English;
            let rus = objectWord.Russia;
            let id = objectWord.Id;
            console.log(eng + " " + rus);
            let rectangleEng = this.drawRectangle(stage,layer, id, eng);
            let rectangleRus = this.drawRectangle(stage, layer,id, rus);
            layer.add(rectangleEng);
            layer.add(rectangleRus);
        });
        layer.draw();

    }


    //---------Отрисовка и определение игрового поля----------
    createKonva() {
        let stage = new Konva.Stage({
            container: 'game-drag-and-drop',
            width: document.getElementById('container-konva').offsetWidth,
            height: document.getElementById('container-konva').offsetHeight
        });
        let layer = new Konva.Layer();
        let tempLayer = new Konva.Layer();
        let drop = false;
        let that = this;
        let previousShape;
        let colorBack;

        stage.add(layer);
        stage.add(tempLayer);


        this.drawDictionary(stage,layer);

 
        //начало перемещение фигуры
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
        //движение фигуры
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
        //опустить фигуру и закончить перемещение
        stage.on("dragend", function (e) {
        console.log('end');
        if (previousShape) {
            if (previousShape.getName() === e.target.getName()) {
                e.target.moveTo(layer);
                e.target.destroy();
                previousShape.destroy();
                that.upPoints();
                layer.draw();
                tempLayer.draw();
                that.checkEnd(layer, stage);
                return;
            } else {
                that.downPoints();
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
        //опустить фигуру на другую
        stage.on("drop", function (e) {
            console.log('drop');
            console.log(e.target);
            let rectLower = e.target.getChildren()[0];
            rectLower.fill('red');
          //  text.text('drop ' + e.target.name());
            layer.draw();
        });
        //начало перетаскивания
        stage.on("dragenter", function (e) {
            console.log('enter');
            let rectLower = e.target.getChildren()[0];
            colorBack = rectLower.getAttr('fill');
            rectLower.fill('yellow');
            layer.draw();
        });
        //перетаскивание с прикрытой фигуры и возвращение той в исх.состояние
        stage.on("dragleave", function (e) {
        console.log('leave');
        console.log(e.target);
        let rectLower = e.target.getChildren()[0];
        rectLower.fill(colorBack);
       // text.text('dragleave ' + e.target.name());
        layer.draw();
        });
        //другая фигура полностью покинута текущей
        stage.on("dragover", function (e) {
        console.log('over');
       // text.text('dragover ' + e.target.name());
        layer.draw();
        });
 
    }

    //---------Проверка конца игры---------------
    checkEnd(layer,stage) {
        console.log(layer);
        console.log(layer.children.length);
        if (layer.children.length === 0) {
            console.log('Игра закончена');
            stage.destroy();
            this.endGame();
        }
        else
            console.log('Продолжаем игру');
    }  
}