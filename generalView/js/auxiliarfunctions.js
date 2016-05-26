function getBoundingBoxCenter(selection) {
    var element = selection.node(),
        bbox = element.getBBox();
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

function getBoundingBoxWidthAndHeight(selection) {
    var element = selection.node(),
        bbox = element.getBBox();
    return [bbox.width, bbox.height];
}

function returnBarsData(data) {
    var data2 = {};
    var counts = ["Salas", "Público", "Renda"];
    for (var year in data) {
      data2[year] = {};
      for (var month in data[year]) {
        data2[year][month] = {};
        for (var i = 0; i < 3; i++) {
          data2[year][month][counts[i]] = 0;
        }
        for (var title in data[year][month]) {
          for (var i = 0; i < 3; i++) {
            data2[year][month][counts[i]] += data[year][month][title][counts[i]];
          }
        }
      }
    }
    return data2;
}

function returnMaxDataCircles(dataset, property) {
  var max = 0;
  for (var year in dataset) {
    for (var month in dataset[year]) {
      for (var movie in dataset[year][month]) {
        if (dataset[year][month][movie][property] > max)
          max = dataset[year][month][movie][property];
      }
    }
  }
  return max;
}

function returnMaxDataBars(dataset, property) {
  var max = 0;
  for (var year in dataset) {
    for (var month in dataset[year]) {
      if (dataset[year][month][property] > max)
        max = dataset[year][month][property];
    }
  }
  return max;
}


function separateData(array, product) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i]["products"][product]) {
      newArray.push(array[i]);
    }
  }
  return newArray;
}
