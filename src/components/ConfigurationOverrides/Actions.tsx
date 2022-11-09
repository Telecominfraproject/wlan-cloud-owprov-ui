import React from 'react';
import {
  IconButton,
  Tooltip,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Center,
  Box,
  Button,
  useDisclosure,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Trash } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import EditOverrideForm from './EditForm';
import { ConfigurationOverride } from 'hooks/Network/ConfigurationOverride';
import useFastField from 'hooks/useFastField';

interface Props {
  override: ConfigurationOverride;
  isDisabled?: boolean;
}

const ConfigurationOverrideActions = ({ override, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { value, onChange } = useFastField<ConfigurationOverride[] | undefined>({ name: 'overrides' });

  const overrides: ConfigurationOverride[] = value || [];

  const handleDeleteClick = React.useCallback(() => {
    const stringOverride = JSON.stringify(override);
    const newOverrides = overrides.filter(
      (curr) => !(override.source === curr.source && stringOverride === JSON.stringify(curr)),
    );

    onChange(newOverrides);
  }, [overrides]);

  return (
    <HStack mx="auto">
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton
                aria-label="delete-device"
                colorScheme="red"
                icon={<Trash size={20} />}
                size="sm"
                isDisabled={isDisabled}
              />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent w="340px">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {override.parameterName}
          </PopoverHeader>
          <PopoverBody>
            <Text whiteSpace="break-spaces">{t('crud.delete_confirm', { obj: t('overrides.one') })}</Text>
          </PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick}>
                {t('common.yes')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <EditOverrideForm override={override} isDisabled={isDisabled} />
    </HStack>
  );
};

export default ConfigurationOverrideActions;
