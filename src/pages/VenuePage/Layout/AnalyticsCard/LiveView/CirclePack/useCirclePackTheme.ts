import * as React from 'react';
import { useColorMode } from '@chakra-ui/react';
import { patternLinesDef } from '@nivo/core';
import { AssociationCircle, CirclePackRoot, RadioCircle, SsidCircle } from './utils';

const THEME = {
  labels: {
    text: {
      background: 'black',
    },
    background: 'black',
  },
};

const LABEL_TEXT_COLORS = {
  from: 'color',
  modifiers: [['darker', 4]],
};

const MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };

const getFill = [
  {
    match: (d: { data: CirclePackRoot | SsidCircle | RadioCircle | AssociationCircle }) =>
      d.data.type === 'association' && typeof d.data.details.rssi === 'number' && d.data.details.rssi >= -45,
    id: 'assoc_success',
  },
  {
    match: (d: { data: CirclePackRoot | SsidCircle | RadioCircle | AssociationCircle }) =>
      d.data.type === 'association' && typeof d.data.details.rssi === 'number' && d.data.details.rssi >= -60,
    id: 'assoc_warning',
  },
  {
    match: (d: { data: CirclePackRoot | SsidCircle | RadioCircle | AssociationCircle }) =>
      d.data.type === 'association' && typeof d.data.details.rssi === 'number' && d.data.details.rssi < -60,
    id: 'assoc_danger',
  },
];

const getLabelsFilter = (label: { node: { height: number } }) => label.node.height === 0;

export const useCirclePackTheme = () => {
  const { colorMode } = useColorMode();

  const shapeDefs = React.useMemo(
    () => [
      patternLinesDef(
        'assoc_success',
        colorMode === 'light'
          ? {
              rotation: -45,
              color: 'var(--chakra-colors-success-400)',
              background: 'var(--chakra-colors-success-600)',
            }
          : {
              rotation: -45,
              color: 'var(--chakra-colors-success-400)',
              background: 'var(--chakra-colors-success-600)',
            },
      ),
      patternLinesDef(
        'assoc_warning',
        colorMode === 'light'
          ? {
              rotation: -45,
              color: 'var(--chakra-colors-warning-100)',
              background: 'var(--chakra-colors-warning-400)',
            }
          : {
              rotation: -45,
              color: 'var(--chakra-colors-warning-100)',
              background: 'var(--chakra-colors-warning-400)',
            },
      ),
      patternLinesDef(
        'assoc_danger',
        colorMode === 'light'
          ? {
              rotation: -45,
              color: 'var(--chakra-colors-danger-200)',
              background: 'var(--chakra-colors-danger-400)',
            }
          : {
              rotation: -45,
              color: 'var(--chakra-colors-danger-200)',
              background: 'var(--chakra-colors-danger-400)',
            },
      ),
    ],
    [colorMode],
  );

  return {
    shapeDefs,
    THEME,
    LABEL_TEXT_COLORS,
    MARGINS,
    getFill,
    getLabelsFilter,
  };
};
