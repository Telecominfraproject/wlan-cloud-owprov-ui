import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Tooltip,
  IconButton,
  Box,
} from '@chakra-ui/react';
import ModalHeader from 'components/Modals/ModalHeader';
import { useTranslation } from 'react-i18next';
import CloseButton from 'components/Buttons/CloseButton';
import SaveButton from 'components/Buttons/SaveButton';
import { useGetConfigurations } from 'hooks/Network/Configurations';
import { ArrowDown, ArrowUp, Plus, Trash } from 'phosphor-react';
import DataTable from 'components/DataTable';

const propTypes = {
  initialValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

const defaultProps = {
  isRequired: false,
  isDisabled: false,
};

const DeviceConfigurationsModal = ({ name, initialValue, setValue, errors, isDisabled, isRequired, label }) => {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState([]);
  const initialRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: configurations, isFetching } = useGetConfigurations();

  const save = () => {
    setValue(localValue);
    onClose();
  };
  const addConfig = (newConf) => setLocalValue([...localValue, newConf]);
  const deleteConfig = (index) => {
    const newConfigs = [...localValue];
    newConfigs.splice(index, 1);
    setLocalValue(newConfigs);
  };

  const moveUp = (index) => {
    const newUp = localValue[index];
    const newConfigs = [...localValue];
    newConfigs[index] = newConfigs[index - 1];
    newConfigs[index - 1] = newUp;
    setLocalValue(newConfigs);
  };

  const moveDown = (index) => {
    const newDown = localValue[index];
    const newConfigs = [...localValue];
    newConfigs[index] = newConfigs[index + 1];
    newConfigs[index + 1] = newDown;
    setLocalValue(newConfigs);
  };

  const configLabel = useCallback(() => {
    const { length } = initialValue;
    if (length === 0) return t('entities.add_configurations');
    if (length === 1 && configurations)
      return configurations.find((conf) => conf.id === initialValue[0])?.name ?? `1 ${t('configurations.one')}`;
    return `${length} ${t('configurations.title')}`;
  }, [initialValue, configurations]);

  const memoizedActions = useCallback(
    (cell, isSelected) => {
      if (isSelected) {
        return (
          <Flex>
            <Tooltip hasArrow label={t('common.make_higher_priority')} placement="top">
              <IconButton
                isDisabled={cell.row.index === 0}
                ml={2}
                colorScheme="blue"
                icon={<ArrowUp size={20} />}
                size="sm"
                onClick={() => moveUp(cell.row.index)}
              />
            </Tooltip>
            <Tooltip hasArrow label={t('common.make_lower_priority')} placement="top">
              <IconButton
                isDisabled={cell.row.index === localValue.length - 1}
                ml={2}
                colorScheme="blue"
                icon={<ArrowDown size={20} />}
                size="sm"
                onClick={() => moveDown(cell.row.index)}
              />
            </Tooltip>
            <Tooltip hasArrow label={t('common.remove')} placement="top">
              <IconButton
                ml={2}
                colorScheme="red"
                icon={<Trash size={20} />}
                size="sm"
                onClick={() => deleteConfig(cell.row.index)}
              />
            </Tooltip>
          </Flex>
        );
      }
      return (
        <Tooltip hasArrow label={t('crud.add')} placement="top">
          <IconButton
            colorScheme="blue"
            icon={<Plus size={20} />}
            size="sm"
            onClick={() => addConfig(cell.row.original.id)}
          />
        </Tooltip>
      );
    },
    [localValue],
  );

  const columns = useCallback(
    (isSelected) => {
      const baseColumns = [
        {
          id: 'name',
          Header: t('common.name'),
          Footer: '',
          accessor: 'name',
          customMaxWidth: '200px',
          customWidth: 'calc(15vh)',
          customMinWidth: '150px',
        },
        {
          id: 'description',
          Header: t('common.description'),
          Footer: '',
          accessor: 'description',
          disableSortBy: true,
        },
        {
          id: 'actions',
          Header: t('common.actions'),
          Footer: '',
          accessor: 'Id',
          customWidth: '80px',
          Cell: ({ cell }) => memoizedActions(cell, isSelected),
          disableSortBy: true,
          alwaysShow: true,
        },
      ];

      return baseColumns;
    },
    [localValue],
  );

  useEffect(() => {
    if (isOpen) {
      setLocalValue(initialValue);
    }
  }, [initialValue, isOpen]);

  return (
    <>
      <FormControl isInvalid={errors[name]} isRequired={isRequired} isDisabled={isDisabled}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal">
          {label}
        </FormLabel>
        <Button
          mt={3}
          alignItems="center"
          colorScheme="blue"
          onClick={onOpen}
          ml={1}
          isDisabled={isDisabled}
          isLoading={isFetching}
          variant="link"
        >
          {configLabel()}
        </Button>
        <FormErrorMessage>{errors[name]}</FormErrorMessage>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('configurations.device_configurations')}
            right={
              <>
                <SaveButton onClick={save} />
                <CloseButton ml={2} onClick={onClose} ref={initialRef} />
              </>
            }
          />
          <ModalBody overflowX="auto">
            <DataTable
              columns={columns(true)}
              data={configurations ? localValue.map((id) => configurations.find((config) => config.id === id)) : []}
              isLoading={isFetching}
              obj={t('configurations.title')}
            />
            <Box h="100px" />
            <DataTable
              columns={columns(false)}
              data={configurations?.filter((config) => !localValue.find((local) => local === config.id)) ?? []}
              isLoading={isFetching}
              obj={t('configurations.title')}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

DeviceConfigurationsModal.propTypes = propTypes;
DeviceConfigurationsModal.defaultProps = defaultProps;

export default DeviceConfigurationsModal;
