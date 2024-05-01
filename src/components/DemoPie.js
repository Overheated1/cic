import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';

export const DemoPie = () => {
  const data = [
    {
      type: 'Ações',
      value: 27,
    },
    {
      type: 'Fundos Imobiliarios',
      value: 40,
    },
    {
      type: 'Renda Fixa',
      value: 18,
    },
    {
      type: 'Internacional',
      value: 15,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    theme: 'dark',
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.64,
    label: {
      offset: '-50%',
      autoRotate: false,
      style: {
        textAlign: 'center',
        fill: '#fff',
      },
    },
    statistic: {
      title: {
        offsetY: -8,
        style: {
          color: '#fff',
        },
      },
      content: {
        style: {
          color: '#fff',
        },
        offsetY: -4,
      },
    },
    pieStyle: {
      lineWidth: 0,
    },
  };
  return <Pie {...config} />;
};
