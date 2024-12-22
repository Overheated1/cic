import React from 'react';

export const DemoLine = ({ data }) => {
  let formattedDate = new Date().toISOString().split('T')[0];

  const config = {
    data: {
      value: data,
      transform: [
        {
          type: 'fold',
          fields: ['|d1 - d2|'],
          key: 'type',
          value: 'value',
        },
      ],
    },
    xField: (d) => new Date(d.date).toISOString().split('T')[0],
    yField: 'value',
    colorField: 'type',
    axis: {
      x: { labelAutoHide: 'greedy' },
    },
    annotations: [
      {
        type: 'text',
        data: [formattedDate, 4],
        style: {
          text: '',
          wordWrap: true,
          wordWrapWidth: 164,
          dx: -174,
          dy: 30,
          fill: '#2C3542',
          fillOpacity: 0.65,
          fontSize: 10,
          background: true,
          backgroundRadius: 2,
          connector: true,
          startMarker: true,
          startMarkerFill: '#2C3542',
          startMarkerFillOpacity: 0.65,
        },
        tooltip: false,
      },
    ],
  };

  return (
    <div id="rep-graph">
    </div>);
};