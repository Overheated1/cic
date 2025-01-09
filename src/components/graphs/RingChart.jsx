import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const RingChart = ({ data,labels }) => {

  const options = {
    chart: {
      width: 380,
      type: 'donut',
    },
    labels: labels,
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: true,
        },
      },
    }],
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    },
  };

  return (
    <div>
      <div className="chart-wrap">
        <div id="chart">
          <ReactApexChart options={options} series={data} type="donut" width={380} />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default RingChart;