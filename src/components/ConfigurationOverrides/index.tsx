import * as React from 'react';
import { Box } from '@chakra-ui/react';
import ConfigurationOverridesTable from './Table';

type Props = {
  serialNumber: string;
  isDisabled?: boolean;
};

const ConfigurationOverrides = ({ serialNumber, isDisabled }: Props) => (
  <Box>
    <ConfigurationOverridesTable serialNumber={serialNumber} isDisabled={isDisabled} />
  </Box>
);

export default ConfigurationOverrides;
