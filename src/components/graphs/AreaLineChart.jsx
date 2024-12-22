import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function AreaLineChart({ data, labels ,dates }) {

    let state = {
          
    series: [{
      name: labels[0],
      data: data[0]
    }, {
      name: labels[1],
      data: data[1]
    }],
    options: {
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: dates
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    },
  
  
  };




  return (
    <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
  );
}

export default AreaLineChart;