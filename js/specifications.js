var visConfig = {
  // SVGS Width and Height
  width: 1200,
  height: 640,
  baseWidth: 1450,

  // Overview Visualization Specs

  // Color Scale
  scaleInitialColor: "#6AC1C8",
  scaleIntermColor: "#124A9B",
  scaleFinalColor: "#010038",

  // Superscription
  superTextSize: 18,
  superHMargin: 10,
  superSubtextSize: 12,
  superSubSubtextSize: 8,


  // Circles Config
  circleBiggerRadius: 37.5,
  circleSmallerRadius: 7,
  wCircleMargin: 20,
  hCircleMargin: 12,

  // guidelines
  hTopMargin: 56,
  hBottomMargin: 21,
  wLeftMargin: 64,
  wRightMargin: 17,
  verticalGuidelineHexValue: "#666766",
  horizontalGuidelineHexValue: "#f2f2f2",
  guidelineStrokeWidth: 1,

  // Year Text Config
  hYearMargin: 61,
  wYearMargin: 5,
  yearTextSize: 16,

  // Month Text Config
  hMonthMargin: 85,
  hMonthBox: 17,
  monthBoxHexValue: "#666666",
  monthBoxTextSize: 14,
  monthMovingDuration: 300,

  // Vis Margins
  wMargin: 37,
  hMargin: 0,

  // Month Hightlight Box Config
  wMonthHighlight: 523,
  hMonthHighlight: 327,
  wHighlightMargin: 30,
  hHighlightMargin: 17,
  hHighlightTextMargin: 15,
  HighlightHeadersSize: 16,
  HighlightTextsSize: 13,
  hHighlightLine1Spacing: 51,
  hHighlightLine2Spacing: 122,
  circleRankingBiggerRadius: 25,
  circleRankingSmallerRadius: 7.5,
  circleRankingHMargin: 15,


  // Nationalities Visualization Specs

  // Menu Specs
  natMenuH: 270,
  natMenuHMargin: 24,
  natMenuTitlesSize: 14,
  natMenuOptionsSize: 10,
  natMenuTitleTopMargin: 25,
  natMenuTitleBottomMargin: 10,
  natMenuLineHMargin: 62,
  natMenuCirclesRadius: 5,
  natMenuContinentWMargin: 50,
  natMenuWDistance: 140,

  // Titles Configs
  natTitleSize: 18,
  natSubTitleSize: 12,
  natContinentNameSize: 16,
  natContinentHMargin: 8,
  natContinentColor: "#000000",

  // Margins Configs
  natWMargin: 79,
  natHMarginGraph: 220,
  natHMarginGraphAxis: 51,
  natGraphLeft: 79,
  natGraphRight: 50,
  natGraphSpacing: 3,
  natGraphContinentSpacing: 15,
  natGraphAxisSpacing: 82.384615385,
  natGraphAxisDivHeight: 7,
  natGraphStrokeWidth: 1,

  // Graph Configs
  natHGraphBar: 62,
  natYearSelected: "2009",
  natStrokesWidth: 1,
  natStrokesColor: "#dd1924",



  // Recordists Visualization Specs

  // Decades

  recDecBiggerArea: 16900,
  recDecSmallerArea: 36,

  // Treemap

  recTreemapH: 516,
  recTreemapW: 740,
  recTreemapMarginLeft: 0,
  recTreemapMarginTop: 80,

  // Movies descriptions

  recMovieDescMargin: 50,
  recMovieDescSubWMargin: 224,
  recMoviesDescW: 25,

  // Comparison menu

  recMenuBoxW: 40,
  recMenuBoxH: 25,
  recMenuFill: "#F4F4F4",


  // Production Visualization Specs

  // Menu

  proMenuTopMargin: 96,
  proSelStartTopMargin: 48,
  proMenuCirclesRadius: 5,
  proMenuCirclesHDist: 25,
  proMenuCirclesWDist: 85,
  proMenuSelectionSize: 10,
  proMenuTitleSize: 14,
  proMenuSecondTitleTopMargin: 20,
  proWMargin: 12,

  // Graph

  proYAxisH: 334,
  proXAxisW: 840,
  proAxisStartW: 311,
  proAxisStartH: 458,
  proYearsLabelTopMargin: 35,
  proYearsLabelLeftMargin: 262,
  proProdLabelTopMargin: 97,
  proProdLabelLeftMargin: 266,
  proLabelSize: 13,
  proLabelRightMargin: 10,
  proGuidelinesColor: "#CCCCCC",
  proPathsColor: "#000000",
  proLinesWidth: 1,
  proCircleRadius: 5,



  // Utilities
  months: {
    0: "Janeiro",
    1: "Fevereiro",
    2: "Março",
    3: "Abril",
    4: "Maio",
    5: "Junho",
    6: "Julho",
    7: "Agosto",
    8: "Setembro",
    9: "Outubro",
    10: "Novembro",
    11: "Dezembro"
  },
  years: {
    "2009": 0,
    "2010": 1,
    "2011": 2,
    "2012": 3,
    "2013": 4,
    "2014": 5,
  },
  continents: {
    "América do Sul": 0,
    "América do Norte": 1,
    "Europa": 2,
    "Ásia": 3,
    "África": 4,
    "Oceania": 5
  },
  continentsFilter: {
    "América do Sul": true,
    "América do Norte": true,
    "Europa": true,
    "Ásia": true,
    "África": true,
    "Oceania": true
  },
  publicFilter: {
    "min": 0,
    "max": Infinity
  },
  continentsColors: {
    "América do Sul": "#1A1A1A",
    "América do Norte": "#666666",
    "Europa": "#B2B2B2",
    "Ásia": "#CCCCCC",
    "África": "#E6E6E6",
    "Oceania": "#B2B2B2"
  },
  decadesColors: {
    "00": "#1A1A1A",
    "10": "#666666",
    "70": "#B2B2B2",
    "80": "#CCCCCC",
    "90": "#E6E6E6"
  },
  continentsArr: [
    "América do Sul",
    "América do Norte",
    "Europa",
    "Ásia",
    "África",
    "Oceania"
  ],
  moviesColors: [
    "#4D4D4D",
    "#CCCCCC",
    "#1A1A1A",
    "#808080",
    "#E6E6E6"
  ],
  publicFilterOptions: [
    {
      "text": "De 0 a 10 mil",
      "min": 0,
      "max": 10000
    },
    {
      "text": "De 10 a 50 mil",
      "min": 10000,
      "max": 50000
    },
    {
      "text": "De 50 a 100 mil",
      "min": 50000,
      "max": 100000
    },
    {
      "text": "De 100 a 500 mil",
      "min": 100000,
      "max": 500000
    },
    {
      "text": "De 500 mil a 1 milhão",
      "min": 500000,
      "max": 1000000
    },
    {
      "text": "Todos",
      "min": 0,
      "max": Infinity
    }
  ],
  regionsArr: [
    "Sudeste",
    "Sul",
    "Nordeste",
    "Centro-Oeste",
    "Norte"
  ],
  regionsColors: {
    "Sudeste": "#1A1A1A",
    "Sul": "#666666",
    "Nordeste": "#B2B2B2",
    "Centro-Oeste": "#CCCCCC",
    "Norte": "#E6E6E6"
  },
  regionsFilter: {
    "Sudeste": true,
    "Sul": true,
    "Nordeste": true,
    "Centro-Oeste": true,
    "Norte": true
  },
  proUfsFilter: {
    "RJ": false,
    "SP": false,
    "RS": false,
    "MG": false,
    "PE": false,
    "DF": false,
    "BA": false,
    "CE": false,
    "PR": false,
    "SC": false,
    "ES": false,
    "MT": false,
    "AM": false,
    "MA": false,
    "GO": false,
    "SE": false
  },
  proYearsObj: {
      "1995": 0,
      "1996": 1,
      "1997": 2,
      "1998": 3,
      "1999": 4,
      "2000": 5,
      "2001": 6,
      "2002": 7,
      "2003": 8,
      "2004": 9,
      "2005": 10,
      "2006": 11,
      "2007": 12,
      "2008": 13,
      "2009": 14,
      "2010": 15,
      "2011": 16,
      "2012": 17,
      "2013": 18,
      "2014": 19
  },
  proYearsArr: [
      "1995",
      "1996",
      "1997",
      "1998",
      "1999",
      "2000",
      "2001",
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014"
  ]
};
