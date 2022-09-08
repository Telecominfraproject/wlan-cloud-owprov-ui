import { Button, Heading, useColorModeValue, useMultiStyleConfig, useTab } from '@chakra-ui/react';
import { useGetResource } from 'hooks/Network/Resources';
import useFastField from 'hooks/useFastField';
import React, { useMemo } from 'react';

const SsidTab: React.FC<{ index: number; interIndex: number }> = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ index, interIndex, ...props }, ref) => {
    const { value } = useFastField({ name: `configuration[${interIndex}].ssids[${index}]` });
    const { value: wifiBands } = useFastField({ name: `configuration[${interIndex}].ssids[${index}].wifi-bands` });
    const { data: resource } = useGetResource({
      id: value?.__variableBlock,
      enabled: value?.__variableBlock !== undefined,
    });
    const bgColorSelected = useColorModeValue('white', 'gray.700');
    const bgColorUnSelected = useColorModeValue('gray.100', 'gray.800');

    // @ts-ignore
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps['aria-selected'];

    const styles = useMultiStyleConfig('Tabs', tabProps);

    const name = useMemo(() => {
      if (value?.name) {
        return value.name.length <= 15 ? value.name : `${value.name.substring(0, 12)}...`;
      }
      if (resource?.variables && resource?.variables[0]?.value) {
        try {
          const json = JSON.parse(resource?.variables[0]?.value);
          return json.name.length <= 15 ? json.name : `${json.name.substring(0, 12)}...`;
        } catch (e) {
          return '';
        }
      }

      return '';
    }, [value, resource]);

    const bands = useMemo(() => {
      if (wifiBands) return wifiBands;
      if (resource?.variables && resource?.variables[0]?.value) {
        try {
          const json = JSON.parse(resource?.variables[0]?.value);
          return json['wifi-bands'];
        } catch (e) {
          return '';
        }
      }
      return undefined;
    }, [wifiBands, resource]);
    return (
      // @ts-ignore
      <Button
        __css={styles.tab}
        {...tabProps}
        bgColor={isSelected ? bgColorSelected : bgColorUnSelected}
        _focus={{ outline: 'none !important' }}
      >
        <Heading size="md">
          {name} ({bands?.join(', ')})
        </Heading>
      </Button>
    );
  },
);

export default React.memo(SsidTab);
