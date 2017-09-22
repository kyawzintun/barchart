import React, { Component } from 'react';
import './App.css';

import * as d3 from "d3";

const jsonUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

class App extends Component {
  componentDidMount() {
    fetch(jsonUrl)
    .then((res) => {return res.json()})
    .then((res)=> {
      let data = res.data.map(d => {
        let obj={};
        obj.date = d[0];
        obj.value = d[1];
        return obj;
      })
      this.drawBarChart(data);
    });
  }

  drawBarChart(data) {
    console.log(data);
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let formatCurrency = d3.format("$,.2f");
    let minDate = new Date(data[0].date);
    let maxDate = new Date(data[274].date);
    let svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    barWidth = Math.ceil(width / data.length);
    
    let x = d3.scaleTime().domain([minDate,maxDate]).range([0,width]),
    y = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; })]).range([height, 0]);

    let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("class", "axis-y-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.8em")
    .attr("text-anchor", "end")
    .text("Gross Domestic Product, USA");
    
    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(new Date(d.date)); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", barWidth)
    .attr("height", function(d) { return height - y(d.value); })
    .attr("id", function(d) { return d.value; })
    .attr("data-toggle", 'tooltip')
    .on("mouseover", function(d) {
      let currentDateTime = new Date(d.date);
      let year = currentDateTime.getFullYear();
      let month = currentDateTime.getMonth();
      div.transition()
        .duration(100)
        .style("opacity", .9);
      div .html(
        "<span class='amount'>" + formatCurrency(d.value) + "&nbsp;Billion </span><br><span class='year'>" + year + ' - ' + months[month] + "</span>")     
        .style("left", (d3.event.pageX + 5) + "px")             
        .style("top", (d3.event.pageY - 50) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
        .duration(100)
        .style("opacity", 0);
    });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Gross Domestic Product</h2>
        </div>
        <p className="App-intro card">
          <svg width="1000" height="500"></svg>
        </p>
      </div>
    );
  }
}

export default App;
