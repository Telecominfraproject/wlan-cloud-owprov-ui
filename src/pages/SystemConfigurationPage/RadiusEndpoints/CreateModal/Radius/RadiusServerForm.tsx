import * as React from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import DeleteButton from 'components/Buttons/DeleteButton';
import NumberField from 'components/FormFields/NumberField';
import StringField from 'components/FormFields/StringField';
import useFastField from 'hooks/useFastField';

type Props = {
  namePrefix: string;
  label: string;
};

const RadiusServerForm = ({ namePrefix, label }: Props) => {
  const field = useFastField<{ Hostname: string; IP: string; Port: number; Secret: string }[]>({ name: namePrefix });

  const name = (postfix: string, index: number) => `${namePrefix}[${index}].${postfix}]`;

  const onAdd = () => {
    const newValue = [...field.value];
    newValue.push({ Hostname: '', IP: '', Port: 1815, Secret: '' });
    field.onChange(newValue);
  };
  const onRemove = (index: number) => {
    const newValue = [...field.value];
    newValue.splice(index, 1);
    field.onChange(newValue);
  };

  return (
    <>
      <Flex mt={4} mb={2} alignItems="center">
        <Heading size="sm" mr={2}>
          {label} ({field.value.length})
        </Heading>
        <Button onClick={onAdd} colorScheme="blue" size="sm">
          Add New Entry
        </Button>
      </Flex>
      <Box>
        {field.value.map((_: unknown, i: number) => (
          <Box key={i} borderWidth={1} borderRadius="15px" p={4} mb={4}>
            <Flex alignItems="center">
              <Heading size="sm" mr={2}>
                #{i}
              </Heading>
              <DeleteButton onClick={() => onRemove(i)} isDisabled={field.value.length === 1} />
            </Flex>
            <Flex>
              <Box w="300px">
                <StringField name={name('Hostname', i)} label="Hostname" isRequired />
              </Box>
              <Box w="240px" mx={4}>
                <StringField name={name('IP', i)} label="IP" isRequired />
              </Box>
              <Box>
                <NumberField name={name('Port', i)} label="Port" w="120px" isRequired />
              </Box>
            </Flex>
            <StringField name={name('Secret', i)} label="Secret" hideButton w="300px" isRequired />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default React.memo(RadiusServerForm);
