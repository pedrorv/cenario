function createVisNationalities(userWindowWidth) {

  if (!visConfig.countries) {
    d3.json("js/paises.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.countries = json;
      d3.json("js/data.json", function(error2, json2) {
        if (error) return console.warn(error2);
        visConfig.dataNationalitiesVis = json2;
        createVis();
      });
    });
  } else {
    createVis();
  }

  function createVis() {

    var vis = d3.select("svg")
      .append("g")
      .attr("class", "vis");

    var ratio = scaleRatio(userWindowWidth, visConfig.width, 1366);

    var map = new Datamap({
      element: document.getElementById('container'),
      height: ratio * 331,
      width:  ratio * 686,
      fills: {
        defaultFill: '#CDCDCD'
      },
      geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false
      },
    });

    scaleVis(ratio);
  }

}
