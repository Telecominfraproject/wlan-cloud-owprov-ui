import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid,
  Select,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Select as SelectSearch } from 'chakra-react-select';
import ConfirmCloseAlert from 'components/ConfirmCloseAlert';
import SaveButton from 'components/Buttons/SaveButton';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/ModalHeader';
import CreateButton from 'components/Buttons/CreateButton';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';
import InterfaceSsidRadius from './InterfaceSsidRadius';

const propTypes = {
  refresh: PropTypes.func.isRequired,
};

const parentToObject = (parent) => {
  const splitParent = parent.split(':');
  const type = splitParent[0];
  const id = splitParent[1];

  return {
    entity: type === 'ent' ? id : undefined,
    venue: type === 'ven' ? id : undefined,
  };
};

const getValueFromOptions = (options, parent) => {
  const entity = options[0].options.find((opt) => opt.value === parent);
  if (entity) return entity;
  const venue = options[1].options.find((opt) => opt.value === parent);
  if (venue) return venue;
  return null;
};

const CreateResourceModal = ({ refresh }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: entities } = useGetEntities({ t, toast });
  const { data: venues } = useGetVenues({ t, toast });
  const [selectedVariable, setSelectedVariable] = useState('interface.ssid.radius');
  const [parent, setParent] = useState('ent:0000-0000-0000');
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const [form, setForm] = useState({});
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty)
      ) {
        setForm(node);
      }
    },
    [form],
  );

  const closeModal = () => (form.dirty ? openConfirm() : onClose());

  const closeCancelAndForm = () => {
    closeConfirm();
    onClose();
  };

  const parentOptions = () => [
    {
      label: t('entities.title'),
      options:
        entities?.map((ent) => ({
          value: `ent:${ent.id}`,
          label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
        })) ?? [],
    },
    {
      label: t('venues.title'),
      options:
        venues?.map((ven) => ({
          value: `ven:${ven.id}`,
          label: `${ven.name}${ven.description ? `: ${ven.description}` : ''}`,
        })) ?? [],
    },
  ];

  const onVariableChange = (e) => setSelectedVariable(e.target.value);
  const onParentChange = (v) => setParent(v.value);

  return (
    <>
      <CreateButton ml={2} onClick={onOpen} />
      <Modal onClose={closeModal} isOpen={isOpen} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '600px', md: '700px', lg: '800px', xl: '50%' }}>
          <ModalHeader
            title={t('crud.create_object', { obj: t('resources.configuration_resource') })}
            right={
              <>
                <SaveButton
                  onClick={form.submitForm}
                  isLoading={form.isSubmitting}
                  isDisabled={!form.isValid || !form.dirty}
                />
                <CloseButton ml={2} onClick={closeModal} />
              </>
            }
          />
          <ModalBody>
            <SimpleGrid minChildWidth="300px" spacing="20px">
              <FormControl isRequired>
                <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                  {t('resources.variable')}
                </FormLabel>
                <Select
                  value={selectedVariable}
                  onChange={onVariableChange}
                  borderRadius="15px"
                  fontSize="sm"
                >
                  <option value="interface.ssid.radius">interface.ssid.radius</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel ms="4px" fontSize="md" fontWeight="normal">
                  {t('inventory.parent')}
                </FormLabel>
                <SelectSearch
                  options={parentOptions()}
                  value={getValueFromOptions(parentOptions(), parent)}
                  onChange={(option) => onParentChange(option)}
                  classNamePrefix="chakra-react-select"
                  menuPortalTarget={document.body}
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '15px',
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      backgroundColor: 'unset',
                      border: 'unset',
                    }),
                  }}
                />
              </FormControl>
            </SimpleGrid>
            {selectedVariable === 'interface.ssid.radius' && (
              <InterfaceSsidRadius
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                formRef={formRef}
                parent={parentToObject(parent)}
              />
            )}
          </ModalBody>
        </ModalContent>
        <ConfirmCloseAlert
          isOpen={showConfirm}
          confirm={closeCancelAndForm}
          cancel={closeConfirm}
        />
      </Modal>
    </>
  );
};

CreateResourceModal.propTypes = propTypes;

export default CreateResourceModal;
