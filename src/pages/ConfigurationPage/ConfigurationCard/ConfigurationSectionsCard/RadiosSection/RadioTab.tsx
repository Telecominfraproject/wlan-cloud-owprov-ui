import { Button, Heading, useColorModeValue, useMultiStyleConfig, useTab } from '@chakra-ui/react';
import { useGetResource } from 'hooks/Network/Resources';
import useFastField from 'hooks/useFastField';
import React, { useMemo } from 'react';

// eslint-disable-next-line react/prop-types
const RadioTab: React.FC<{ index: number }> = React.forwardRef(({ index, ...props }, ref) => {
  const { value } = useFastField({ name: `configuration[${index}]` });
  const { data: resource } = useGetResource({
    id: value?.__variableBlock,
    enabled: value?.__variableBlock !== undefined,
  });
  const bgColorSelected = useColorModeValue('gray.100', 'gray.800');
  const bgColorUnSelected = useColorModeValue('white', 'gray.700');

  // @ts-ignore
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];

  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig('Tabs', tabProps);

  const name = useMemo(() => {
    if (value?.band) {
      return value.band;
    }
    if (resource?.variables && resource?.variables[0]?.value) {
      try {
        const json = JSON.parse(resource?.variables[0]?.value);
        return json.band;
      } catch (e) {
        return '';
      }
    }

    return '';
  }, [value, resource]);
  return (
    // @ts-ignore
    <Button
      __css={styles.tab}
      {...tabProps}
      bgColor={isSelected ? bgColorSelected : bgColorUnSelected}
      _focus={{ outline: 'none !important' }}
    >
      <Heading size="md">{name} Radio</Heading>
    </Button>
  );
});

export default React.memo(RadioTab);
