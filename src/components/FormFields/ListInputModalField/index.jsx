import React, { useEffect, useState } from 'react';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  UnorderedList,
  ListItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Trash } from '@phosphor-icons/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import CloseButton from 'components/Buttons/CloseButton';
import SaveButton from 'components/Buttons/SaveButton';
import ModalHeader from 'components/Modals/ModalHeader';

const propTypes = {
  initialValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  explanation: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  placeholder: PropTypes.string,
  validation: PropTypes.func,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  button: PropTypes.func,
};

const defaultProps = {
  error: false,
  isRequired: false,
  isDisabled: false,
  placeholder: '',
  validation: () => true,
};

const ListInputModalField = ({
  initialValue,
  setValue,
  label,
  buttonLabel,
  title,
  explanation,
  placeholder,
  validation,
  error,
  isDisabled,
  isRequired,
  button,
}) => {
  const { t } = useTranslation();
  const [entry, setEntry] = useState('');
  const [localValue, setLocalValue] = useState([]);
  const initialRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const save = () => {
    setValue(localValue);
    onClose();
  };
  const addEntry = () => setLocalValue([...localValue, entry]);
  const deleteEntry = (val) => setLocalValue(localValue.filter((localVal) => localVal !== val));
  const handleEntryChange = (e) => setEntry(e.target.value);

  useEffect(() => {
    if (isOpen) {
      setEntry('');
      setLocalValue(initialValue);
    }
  }, [initialValue, isOpen]);

  return (
    <>
      <FormControl isInvalid={error} isRequired={isRequired} isDisabled={isDisabled}>
        <FormLabel ms="4px" fontSize="md" fontWeight="normal" _disabled={{ opacity: 0.8 }}>
          {label}
        </FormLabel>
        {button ? (
          button(onOpen)
        ) : (
          <Button
            mt={3}
            alignItems="center"
            colorScheme="blue"
            onClick={onOpen}
            ml={1}
            isDisabled={isDisabled}
            variant="link"
          >
            {buttonLabel}
          </Button>
        )}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size="md" initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            title={title}
            right={
              <>
                <SaveButton onClick={save} hidden={isDisabled} />
                <CloseButton ml={2} onClick={onClose} ref={initialRef} />
              </>
            }
          />
          <ModalBody>
            {explanation}
            <InputGroup size="md" mt={6} hidden={isDisabled}>
              <Input
                borderRadius="15px"
                fontSize="sm"
                type="text"
                value={entry}
                onChange={handleEntryChange}
                placeholder={placeholder}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={addEntry}
                  isDisabled={entry.length === 0 || !validation(entry) || localValue.find((val) => val === entry)}
                >
                  {t('crud.add')}
                </Button>
              </InputRightElement>
            </InputGroup>
            <UnorderedList>
              {localValue.map((val) => (
                <ListItem key={uuid()}>
                  {val}
                  <Tooltip label={t('crud.delete')}>
                    <IconButton
                      ml={2}
                      size="sm"
                      colorScheme="red"
                      type="button"
                      onClick={() => deleteEntry(val)}
                      icon={<Trash size={16} />}
                      hidden={isDisabled}
                    />
                  </Tooltip>
                </ListItem>
              ))}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ListInputModalField.propTypes = propTypes;
ListInputModalField.defaultProps = defaultProps;

export default ListInputModalField;
