class Figure {

    constructor(grid, figureColor, circles) {

        this.figureColor = figureColor;

        this.grid = grid;

        this.circles = [];

        circles.forEach(el => {
            let newX = this.grid.convertXFromGridCoordinates(el.getX())
            let newY = this.grid.convertYFromGridCoordinates(el.getY())
            let newR = this.grid.convertLenghtToGrid(el.getR());
            this.circles.push(new Circle(newX, newY, newR))
        });

    }


    createLines() {

        const lines = [];

        let newCircle = this.circles[0].getPartialCircle(67, 180, 30);
        newCircle.forEach(el => {
            lines.push(new Konva.Line({
                points: el,
                stroke: this.figureColor,
                tension: 1
            }));
        });

        let firstCircleStart = newCircle[0];
        let findPoints = this.findTangentPoints(this.circles[0].getX(), this.circles[0].getY(), this.circles[0].getR(), firstCircleStart[2], firstCircleStart[3]);

        lines.push(new Konva.Line({
            points: [firstCircleStart[0], firstCircleStart[1], findPoints[2], findPoints[3] - this.grid.convertLenghtToGrid(0.5)],
            stroke: this.figureColor,
            tension: 1
        }));

        let lastCircleStart = newCircle[newCircle.length - 1];
        lines.push(new Konva.Line({
            points: [lastCircleStart[2], lastCircleStart[3], lastCircleStart[2], this.circles[1].getY() - this.circles[1].getR()],
            stroke: this.figureColor,
            tension: 1
        }));

        let lastLinePoints = lines[lines.length-1].getPoints();

        lines.push(new Konva.Line({
            points: [lastLinePoints[2], lastLinePoints[3], lastLinePoints[2] - this.grid.convertLenghtToGrid(3), this.grid.convertYFromGridCoordinates(0)],
            stroke: this.figureColor,
            tension: 1
        }));


        // Другий коло та наступні кола
        for (let i = 1; i < this.circles.length; i++) {
            let newCircle = this.getCircle(this.circles[i].getX(), this.circles[i].getY(), this.circles[i].getR(), 40);
            newCircle.forEach(elm => {
                lines.push(elm);
            });
        }



        return lines;
    }

    findTangentPoints(circleCenterX, circleCenterY, radius, pointX, pointY) {
        // Знаходимо нахил дотичної (m)
        const m = -(pointX - circleCenterX) / (pointY - circleCenterY);

        // Знаходимо точки дотику (x, y)
        const A = 1 + m ** 2;
        const B = 2 * (m * (pointY - m * pointX) - circleCenterX);
        const C = (pointY - m * pointX) ** 2 - radius ** 2;

        const discriminant = B ** 2 - 4 * A * C;
        const x1 = (-B + Math.sqrt(discriminant)) / (2 * A);
        const x2 = this.grid.convertXFromGridCoordinates(0)

        const y1 = m * (x1 - pointX) + pointY;
        const y2 = m * (x2 - pointX) + pointY;

        return [x1, y1, x2, y2];
    }



    getFigure() {

        const lines = this.createLines()

        const reflectedLines = [];

        lines.forEach(el => {
            reflectedLines.push(this.makeReflect(el, "X"))
            reflectedLines.push(this.makeReflect(el, "Y"))
            reflectedLines.push(this.makeReflect(el, "XY"))
        })

        reflectedLines.forEach(el => {
            lines.push(el)
        })


        return lines;
    }


    getCircle(x, y, radius, approx) {
        var lines = [];

        // Угол между каждой линией
        var angleIncrement = (2 * Math.PI) / approx;

        for (var i = 0; i < approx; i++) {
            var startAngle = i * angleIncrement;
            var endAngle = (i + 1) * angleIncrement;

            var startX = x + radius * Math.cos(startAngle);
            var startY = y + radius * Math.sin(startAngle);
            var endX = x + radius * Math.cos(endAngle);
            var endY = y + radius * Math.sin(endAngle);


            // Добавляем линию в массив
            lines.push(new Konva.Line({
                points: [startX, startY, endX, endY],
                stroke: this.figureColor,
                tension: 1
            }));
        }
        return lines;
    }


    makeReflect(line, axis) {

        let ParCoord = line.getAttr('points');

        let newFirstPoint = grid.convertToGridPoint(ParCoord.slice(0, 2))
        let newSecondPoint = grid.convertToGridPoint(ParCoord.slice(2))


        switch (axis) {
            case "X":

                newFirstPoint[1] *= -1;
                newSecondPoint[1] *= -1;

                break;
            case "Y":

                newFirstPoint[0] *= -1;
                newSecondPoint[0] *= -1;

                break;
            case "XY":
                newFirstPoint[1] *= -1;
                newSecondPoint[1] *= -1;
                newFirstPoint[0] *= -1;
                newSecondPoint[0] *= -1;
                break;
        }

        return new Konva.Line({
            points: [
                grid.convertXFromGridCoordinates(newFirstPoint[0]),
                grid.convertYFromGridCoordinates(newFirstPoint[1]),
                grid.convertXFromGridCoordinates(newSecondPoint[0]),
                grid.convertYFromGridCoordinates(newSecondPoint[1])],
            stroke: this.figureColor,
            tension: 1
        });
    }

}
