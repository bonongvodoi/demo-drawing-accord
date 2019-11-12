
class SpideModel {

  static TriangleSpide = [{ x: 105, y: 15 },
  { x: 205, y: 178 },
  { x: 4, y: 178 }];

  static SquareSpide = [
    { x: 105, y: 13 },
    { x: 208, y: 121 },
    { x: 103, y: 227 },
    { x: 4, y: 121 }];

  static PentagonSpide = [
    { x: 105, y: 6 },
    { x: 205, y: 88 },
    { x: 156, y: 205 },
    { x: 50, y: 205 },
    { x: 4, y: 88 }];

  static HexagonSpide = [
    { x: 105, y: 4 },
    { x: 205, y: 60 },
    { x: 205, y: 180 },
    { x: 101, y: 236 },
    { x: 4, y: 180 },
    { x: 4, y: 60 },
  ];

  pointsOfPeaks;

  getPointsOfPeaks(numbersOfNotes) {

    switch (numbersOfNotes) {
      case 6:
        this.pointsOfPeaks = SpideModel.HexagonSpide;
        break;
      case 5:
        this.pointsOfPeaks = SpideModel.PentagonSpide;
        break;
      case 4:
        this.pointsOfPeaks = SpideModel.SquareSpide;
        break;
      case 3:
        this.pointsOfPeaks = SpideModel.TriangleSpide;
        break;
      case 2:
        this.pointsOfPeaks = SpideModel.TriangleSpide;
        break;
    }
  }


  getCharPoint(i, weight) {

    var commonLength = Math.sqrt((Math.pow(105 - this.pointsOfPeaks[i].x, 2) + Math.pow(120 - this.pointsOfPeaks[i].y, 2)));
    var length = weight * commonLength;
    var ratio;
    weight == 1 ? ratio = commonLength : ratio = length / (commonLength - length);

    var x = (105 + (ratio * this.pointsOfPeaks[i].x)) / (1 + ratio);
    var y = (120 + (ratio * this.pointsOfPeaks[i].y)) / (1 + ratio);

    return { x: x, y: y };
  }

  static GetChartLineСoordinates(accords) {

    var m = new SpideModel();
    m.getPointsOfPeaks(accords.length);

    var result = [];
    for (var i = 0; i < accords.length; i++) {
      var weight = (i >= accords.length) ? 0 : accords[i].weight;
      result.push(m.getCharPoint(i, weight));
    }
    if (accords.length == 2) result.push(m.getCharPoint(2, 0));
    return result;
  }

  static GetSpideType(numbersOfNotes) {
    switch (numbersOfNotes) {
      case 6:
        return 'Hexagon';
      case 5:
        return 'Pentagon';
      case 4:
        return 'Square';
      case 3:
        return 'Triangle';
      case 2:
        return 'Triangle';
    }
  }
}

function renderSpide(accords, canvas) {

  let numbersOfNotes;
  accords.length >= 3 ? numbersOfNotes = accords.length : numbersOfNotes = 3;

  let image = "https://waft.com/assets/img/wizard/fragrancesChoice/spide" + numbersOfNotes + ".png";

  let context = canvas.getContext('2d');
  let source = new Image();

  source.crossOrigin = 'Anonymous';

  source.onload = () => {

    canvas.height = source.height;
    canvas.width = source.width;
    context.drawImage(source, 0, 0);

    var chartLineСoordinates = SpideModel.GetChartLineСoordinates(accords);
    drawAccords(context, chartLineСoordinates, numbersOfNotes, canvas.width, canvas.height);
    image = canvas.toDataURL();
  };

  source.src = image;
}

function drawAccords(context, coordinates, numbersOfNotes, canvasWidth, canvasHeight) {
  var colors = ["rgba(245,166,35,0.6)", "rgba(241,113,0,0.6)", "rgba(126,211,33,0.6)", "rgba(216,171,255,0.6)", "rgba(246,203,255,0.6)", "rgba(3,120,246,0.6)"];
  for (var i = 0; i < numbersOfNotes; i++) {
    //drow line

    // Create gradient
    var grd = context.createRadialGradient(105, 120, 1, 105, 120, 100);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, colors[i]);

    // Fill with gradient
    context.fillStyle = grd;
    // context.fillRect(10, 10, 150, 80);

    context.beginPath();
    context.moveTo(canvasWidth / 2, canvasHeight / 2);
    context.lineTo(coordinates[i].x, coordinates[i].y);
    i != numbersOfNotes - 1 ? context.lineTo(coordinates[i + 1].x, coordinates[i + 1].y) : context.lineTo(coordinates[0].x, coordinates[0].y);
    context.lineTo(canvasWidth / 2, canvasHeight / 2);
    context.closePath();
    context.lineCap = 'round';
    context.lineWidth = 2;
    context.fillStyle = grd;
    context.fill();
  }
}

function getMockData() {
  return [
    {
      "name": "white floral",
      "weight": 1
    },
    {
      "name": "fruity",
      "weight": 0.69
    },
    {
      "name": "musk",
      "weight": 0.53
    },
    {
      "name": "floral",
      "weight": 0.49
    },
    {
      "name": "fresh",
      "weight": 0.44
    },
    {
      "name": "gourmand",
      "weight": 0.4
    }
  ];
}