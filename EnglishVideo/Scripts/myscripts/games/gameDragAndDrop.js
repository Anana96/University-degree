import Game from './Game';

export default class DragAndDropGame extends Game {

    constructor() {
        super();
        this.stage = null;
        this.layer = null;
        this.limitWord = 5;
    }

    //---------Инициализация игры---------
    init() {
        document.getElementById('game-drag-and-drop').style.display = 'none';
        document.getElementsByClassName('lds-default')[0].style.display = 'block';
    }

    //---------Старт игры-------------
    start() {
        this.init();
        console.log("Начало игры");
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
        this.processingDictionary(dictionary);
        if(!this.validation())
                return;
            this.createKonva();
            document.getElementById('game-drag-and-drop').style.display = 'block';
            document.getElementsByClassName('lds-default')[0].style.display = 'none';
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));
    }

    //--------Обработка данных словаря-----------
    processingDictionary(dictionary) {
        this.setDictionary(dictionary);
        this.shakeArray(this.dictionary);
        this.setDictionary(dictionary.filter((item, index) => {
            if (index < this.limitWord)
                return item
        }));
    }

    //--------Отрисовка прямоугольника с текстом-----------
    drawRectangle(id, word) {
        let color = ['#40667c', '#b86650', '#786d6a', '#C98832'];
        let valueRandomColor = Math.floor(Math.random() * color.length);
        let textOfWord = new Konva.Text({
           text: word,
           fontSize: 25,
           fontFamily: 'Poiret One',
           fill: '#fff',
           padding: 20,
           align: 'center',
        });
        let rect = new Konva.Rect({
        
           strokeWidth: 1,
           fill: color[valueRandomColor],
           width: textOfWord.getWidth(),
           height: textOfWord.getHeight(),
           shadowColor: 'black',
           shadowBlur: 10,
           shadowOffset: [10, 10],
           shadowOpacity: 0.1,
           cornerRadius: 30
        });
        //определение положения фигуры
        let x = Math.floor(Math.random() * (this.stage.width() - rect.getWidth()+1));
        let y = Math.floor(Math.random() * (this.stage.height() - rect.getHeight()+1));


        let group = new Konva.Group({
           x: x,
           y: y,
           draggable: true,
           name: id.toString()
        });
        group.add(rect,textOfWord );
        return group;
}
    //--------Отрисовка словаря----------
    drawDictionary() {
        let dictionary = this.dictionary;
        dictionary.forEach((objectWord) => {
            let eng = objectWord.English;
            let rus = objectWord.Russia;
            let id = objectWord.Id;
            console.log(eng + " " + rus);
            let rectangleEng = this.drawRectangle(id, eng);
            let rectangleRus = this.drawRectangle(id, rus);
            this.layer.add(rectangleEng);
            this.layer.add(rectangleRus);
        });
        this.layer.draw();

    }


    //---------Отрисовка и определение игрового поля----------
    createKonva() {
        let stage = new Konva.Stage({
            container: 'game-drag-and-drop',
            width: document.getElementById('cont-game').offsetWidth,
            height: document.getElementById('cont-game').offsetHeight
        });
        let layer = new Konva.Layer();
        let tempLayer = new Konva.Layer();
        let drop = false;
        let that = this;
        let previousShape;
        let colorBack;

        stage.add(layer);
        stage.add(tempLayer);

        this.stage = stage;
        this.layer = layer;

        this.drawDictionary();

 
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
            let text = e.target.getChildren()[1];
            rectLower.fill('#772727'); //красный
            text.fill('#772727');
          //  text.text('drop ' + e.target.name());
            layer.draw();
        });
        //начало перетаскивания
        stage.on("dragenter", function (e) {
            console.log('enter');
            let rectLower = e.target.getChildren()[0];
            let text = e.target.getChildren()[1];
            colorBack = rectLower.getAttr('fill');
            text.fill('#966b6b');
            rectLower.fill('#f5eecb');
            layer.draw();
        });
        //перетаскивание с прикрытой фигуры и возвращение той в исх.состояние
        stage.on("dragleave", function (e) {
        console.log('leave');
        console.log(e.target);
        let rectLower = e.target.getChildren()[0];
        let text = e.target.getChildren()[1];
        rectLower.fill(colorBack);
        text.fill('white');
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
    checkEnd() {
        let layer = this.layer;
        console.log(layer.children.length);
        if (layer.children.length === 0) {
            console.log('Игра закончена');
            this.stage.destroy();
            this.endGame();
        }
    }  
}