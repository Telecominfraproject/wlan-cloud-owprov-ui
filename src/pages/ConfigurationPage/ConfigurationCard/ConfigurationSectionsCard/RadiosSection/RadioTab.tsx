import { Button, Heading, useColorModeValue, useMultiStyleConfig, useTab } from '@chakra-ui/react';
import useFastField from 'hooks/useFastField';
import React from 'react';

// eslint-disable-next-line react/prop-types
const RadioTab: React.FC<{ index: number }> = React.forwardRef(({ index, ...props }, ref) => {
  const { value } = useFastField({ name: `configuration[${index}]` });
  const bgColorSelected = useColorModeValue('gray.100', 'gray.800');
  const bgColorUnSelected = useColorModeValue('white', 'gray.700');

  // @ts-ignore
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];

  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig('Tabs', tabProps);

  return (
    <Button
      __css={styles.tab}
      {...tabProps}
      bgColor={isSelected ? bgColorSelected : bgColorUnSelected}
      _focus={{ outline: 'none !important' }}
    >
      <Heading size="md">{value?.band} Radio</Heading>
    </Button>
  );
});

export default React.memo(RadioTab);
