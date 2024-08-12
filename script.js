const projectName = 'bar-chart';
localStorage.setItem('example_project', 'D3: Bar Chart');
// coded by Joseph-Samuels

let w = 0; // will be calculated
let h = 600;
let bottom = 35;
let barWidth = 4.2;
let jsonObject = {};

document.addEventListener('DOMContentLoaded', function () {
  let req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload = function () {
    jsonObject = JSON.parse(req.responseText);
    showbar();
  };
});

function showbar() {
  let dataset = jsonObject.data;
  let maxGDP = d3.max(dataset, d => d[1]);
  let datalengt = dataset.length;
  w = datalengt * barWidth; // calculated width

  var tooltip = d3.select(".tips").append("div").
  attr("id", "tooltip").
  style("opacity", 0);

  var overlay = d3.select('.tips').append('div').
  attr('class', 'overlay').
  style('opacity', 0);
  let svg = d3.select("#chart").
  append("svg").
  attr("width", w).
  attr("height", h);

  svg.append("text").
  attr("id", "title").
  attr("x", 580).
  attr("y", 50).
  attr("text-anchor", "middle").
  style("font-size", "24px").
  style("text-decoration", "underline").
  text("United States GDP");


  let alldates = dataset.map(function (item) {
    return new Date(item[0]);
  });
  let xMaxdate = new Date(d3.max(alldates));
  xMaxdate.setMonth(xMaxdate.getMonth() + 20);
  let xScale = d3.scaleTime().
  domain([d3.min(alldates), xMaxdate]).
  range([0, w - bottom]);
  let yScale = d3.scaleLinear().
  domain([0, maxGDP + 400]).
  range([h - bottom, 0]);
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.selectAll("rect").
  data(dataset).
  enter().
  append("rect").
  attr("data-date", (d, i) => d[0]).
  attr("data-gdp", (d, i) => d[1]).
  attr("class", "bar").
  attr("x", (d, i) => 50 + xScale(alldates[i])).
  attr("y", (d, i) => yScale(d[1])).
  attr("width", 3).
  attr("height", d => h - bottom - yScale(d[1])).
  attr("data-date", (d, i) => d[0]).
  attr("data-gdp", (d, i) => d[1]).
  attr("fill", "navy").
  on('mouseover', function (d, i) {
    tooltip.transition().
    duration(200).
    style('opacity', .9);
    tooltip.html(dataset[i][0] + ' <br> GDP:' + dataset[i][1]).
    style('left', i * 4.2 + 30 + 'px').
    style('top', h - 100 + 'px').
    style('transform', 'translateX(60px)').
    attr('data-date', dataset[i][0]);
  }).
  on('mouseout', function (d) {
    tooltip.transition().
    duration(200).
    style('opacity', 0);
    overlay.transition().
    duration(200).
    style('opacity', 0);
  });

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + 50 + ",0)").
  call(yAxis);

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(50," + (h - 35) + ")").
  call(xAxis);
}