import { CirclePacking } from '@nivo/circle-packing';
import React, { useState } from 'react';

const commonProperties = {
  width: 900,
  height: 500,
  data: {
    name: 'nivo',
    color: 'hsl(264, 70%, 50%)',
    children: [
      {
        name: 'viz',
        color: 'hsl(137, 70%, 50%)',
        children: [
          {
            name: 'stack',
            color: 'hsl(209, 70%, 50%)',
            children: [
              {
                name: 'cchart',
                color: 'hsl(323, 70%, 50%)',
                loc: 159163,
              },
              {
                name: 'xAxis',
                color: 'hsl(77, 70%, 50%)',
                loc: 135760,
              },
            ],
          },
          {
            name: 'ppie',
            color: 'hsl(344, 70%, 50%)',
            children: [
              {
                name: 'chart',
                color: 'hsl(97, 70%, 50%)',
                children: [
                  {
                    name: 'pie',
                    color: 'hsl(238, 70%, 50%)',
                    children: [
                      {
                        name: 'outline',
                        color: 'hsl(65, 70%, 50%)',
                        loc: 196552,
                      },
                      {
                        name: 'slices',
                        color: 'hsl(189, 70%, 50%)',
                        loc: 15332,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'legends',
                color: 'hsl(129, 70%, 50%)',
                loc: 38994,
              },
            ],
          },
        ],
      },
      {
        name: 'colors',
        color: 'hsl(291, 70%, 50%)',
        children: [
          {
            name: 'rgb',
            color: 'hsl(263, 70%, 50%)',
            loc: 38690,
          },
          {
            name: 'hsl',
            color: 'hsl(267, 70%, 50%)',
            loc: 81691,
          },
        ],
      },
      {
        name: 'utils',
        color: 'hsl(204, 70%, 50%)',
        children: [
          {
            name: 'randomize',
            color: 'hsl(17, 70%, 50%)',
            loc: 85412,
          },
          {
            name: 'resetClock',
            color: 'hsl(13, 70%, 50%)',
            loc: 183588,
          },
        ],
      },
      {
        name: 'generators',
        color: 'hsl(21, 70%, 50%)',
        children: [
          {
            name: 'address',
            color: 'hsl(8, 70%, 50%)',
            loc: 106057,
          },
          {
            name: 'city',
            color: 'hsl(189, 70%, 50%)',
            loc: 179311,
          },
          {
            name: 'animal',
            color: 'hsl(23, 70%, 50%)',
            loc: 19629,
          },
          {
            name: 'movie',
            color: 'hsl(131, 70%, 50%)',
            loc: 80528,
          },
          {
            name: 'user',
            color: 'hsl(357, 70%, 50%)',
            loc: 192122,
          },
        ],
      },
      {
        name: 'set',
        color: 'hsl(337, 70%, 50%)',
        children: [
          {
            name: 'clone',
            color: 'hsl(129, 70%, 50%)',
            loc: 141963,
          },
          {
            name: 'intersect',
            color: 'hsl(275, 70%, 50%)',
            loc: 74219,
          },
        ],
      },
      {
        name: 'text',
        color: 'hsl(171, 70%, 50%)',
        children: [
          {
            name: 'trim',
            color: 'hsl(211, 70%, 50%)',
            loc: 44996,
          },
          {
            name: 'slugify',
            color: 'hsl(333, 70%, 50%)',
            loc: 56664,
          },
          {
            name: 'snakeCase',
            color: 'hsl(319, 70%, 50%)',
            loc: 22892,
          },
          {
            name: 'camelCase',
            color: 'hsl(27, 70%, 50%)',
            loc: 66898,
          },
          {
            name: 'repeat',
            color: 'hsl(22, 70%, 50%)',
            loc: 189697,
          },
          {
            name: 'padLeft',
            color: 'hsl(40, 70%, 50%)',
            loc: 79534,
          },
          {
            name: 'padRight',
            color: 'hsl(233, 70%, 50%)',
            loc: 170579,
          },
          {
            name: 'sanitize',
            color: 'hsl(156, 70%, 50%)',
            loc: 23012,
          },
          {
            name: 'ploucify',
            color: 'hsl(48, 70%, 50%)',
            loc: 18720,
          },
        ],
      },
      {
        name: 'misc',
        color: 'hsl(165, 70%, 50%)',
        children: [
          {
            name: 'greetings',
            color: 'hsl(180, 70%, 50%)',
            children: [
              {
                name: 'hey',
                color: 'hsl(44, 70%, 50%)',
                loc: 123441,
              },
              {
                name: 'hi',
                color: 'hsl(199, 70%, 50%)',
                loc: 40101,
              },
            ],
          },
          {
            name: 'other',
            color: 'hsl(303, 70%, 50%)',
            loc: 94851,
          },
          {
            name: 'path',
            color: 'hsl(260, 70%, 50%)',
            children: [
              {
                name: 'pathA',
                color: 'hsl(242, 70%, 50%)',
                loc: 142944,
              },
              {
                name: 'pathB',
                color: 'hsl(315, 70%, 50%)',
                children: [
                  {
                    name: 'pathB1',
                    color: 'hsl(183, 70%, 50%)',
                    loc: 11757,
                  },
                  {
                    name: 'pathB2',
                    color: 'hsl(34, 70%, 50%)',
                    loc: 137471,
                  },
                ],
              },
              {
                name: 'pathC',
                color: 'hsl(223, 70%, 50%)',
                children: [
                  {
                    name: 'pathC1',
                    color: 'hsl(322, 70%, 50%)',
                    loc: 197027,
                  },
                  {
                    name: 'pathC2',
                    color: 'hsl(314, 70%, 50%)',
                    loc: 161292,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  padding: 2,
  id: 'name',
  value: 'loc',
  labelsSkipRadius: 16,
};

const CirclePackTest = () => {
  const [zoomedId, setZoomedId] = useState(null);

  return (
    <CirclePacking
      {...commonProperties}
      labelsSkipRadius={16}
      labelsFilter={(label) => label.node.height === 0}
      zoomedId={zoomedId}
      enableLabels
      motionConfig="slow"
      onClick={(node) => {
        setZoomedId(zoomedId === node.id ? null : node.id);
      }}
    />
  );
};

export default CirclePackTest;
