/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  Box,
  Flex,
  useColorModeValue,
  Link,
  useToast,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Formik, Form } from 'formik';
import { CreateSubscriberSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import { DefaultRequirements, RequirementsShape } from 'constants/propShapes';
import InventoryTable from 'components/Tables/InventoryTable';
import { axiosProv, secUrl } from 'utils/axiosInstances';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import { useGetEntities } from 'hooks/Network/Entity';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  create: PropTypes.instanceOf(Object).isRequired,
  requirements: PropTypes.shape(RequirementsShape),
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const defaultProps = {
  requirements: DefaultRequirements,
};

const CreateSubscriberForm = ({ isOpen, onClose, create, requirements, refresh, formRef }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(uuid());
  const textColor = useColorModeValue('gray.400', 'white');
  const { data: entities } = useGetEntities({ t, toast });
  const [deviceSerials, setDeviceSerials] = useState([]);

  const addSerialNumber = useCallback(
    (newSerial) => {
      const newSerials = [...deviceSerials];
      newSerials.push(newSerial);
      setDeviceSerials(newSerials);
    },
    [deviceSerials, setDeviceSerials],
  );
  const removeSerialNumber = useCallback(
    (serialToRemove) => {
      const newSerials = deviceSerials.filter((serial) => serial !== serialToRemove);
      setDeviceSerials(newSerials);
    },
    [deviceSerials, setDeviceSerials],
  );

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  const claimDevices = async (devices, userId) => {
    const addPromises = devices.map(async (serialNumber) =>
      axiosProv
        .put(`inventory/${serialNumber}`, { subscriber: userId })
        .then(() => ({
          serialNumber,
        }))
        .catch(() => ({ serialNumber, error: true })),
    );

    const claimResults = await Promise.all(addPromises);

    const claimErrors = claimResults.filter((res) => res.error).map((res) => res.serialNumber);

    return claimErrors;
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        key={formKey}
        initialValues={{
          name: '',
          description: '',
          email: '',
          currentPassword: '',
          owner: '',
          note: '',
        }}
        validationSchema={CreateSubscriberSchema(t)}
        onSubmit={async ({ name, description, email, currentPassword, note, owner }, { setSubmitting, resetForm }) =>
          create.mutateAsync(
            {
              name,
              description,
              email,
              currentPassword,
              notes: note.length > 0 ? [{ note }] : undefined,
              userRole: 'subscriber',
              owner,
            },
            {
              onSuccess: async ({ data }) => {
                toast({
                  id: 'user-creation-success',
                  title: t('common.success'),
                  description: t('crud.success_create_obj', {
                    obj: t('user.title'),
                  }),
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });

                setSubmitting(false);
                resetForm();

                const addResults = await claimDevices(deviceSerials, data.id);
                if (addResults.length > 0) {
                  toast({
                    id: uuid(),
                    title: t('common.error'),
                    description: t('subscribers.error_claiming', {
                      serials: addResults.join(', '),
                    }),
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                  });
                }
                refresh();
                onClose();
              },
              onError: (e) => {
                toast({
                  id: uuid(),
                  title: t('common.error'),
                  description: t('crud.error_create_obj', {
                    obj: t('user.title'),
                    e: e?.response?.data?.ErrorDescription,
                  }),
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right',
                });
                setSubmitting(false);
              },
            },
          )
        }
      >
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px">
            <StringField name="email" label={t('common.email')} isRequired />
            <StringField name="name" label={t('common.name')} isRequired />
            <StringField name="currentPassword" label={t('user.password')} isRequired hideButton />
            <SelectWithSearchField
              name="owner"
              label={t('entities.one')}
              isRequired
              options={
                entities?.map((ent) => ({
                  value: ent.id,
                  label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
                })) ?? []
              }
              isPortal
            />
            <StringField name="description" label={t('common.description')} />
            <StringField name="note" label={t('common.note')} />
          </SimpleGrid>
        </Form>
      </Formik>
      <Accordion allowMultiple mt={4}>
        <AccordionItem key={uuid()}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {t('subscribers.devices_to_claim', { count: deviceSerials.length })}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Box mt={2} h="280px" border="1px" overflowX="auto" borderRadius="8px">
              <InventoryTable
                removeAction={removeSerialNumber}
                tagSelect={deviceSerials}
                ignoredColumns={['name', 'configuration']}
              />
            </Box>
            <Box mt={2} h="460px" border="1px" overflowX="auto" borderRadius="8px">
              <InventoryTable
                addAction={addSerialNumber}
                serialsToDisable={deviceSerials}
                ignoredColumns={['name', 'configuration']}
              />
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex justifyContent="center" alignItems="center" maxW="100%" mt={4} mb={6}>
        <Box w="100%">
          <Link href={`${secUrl}${requirements?.passwordPolicy}`} isExternal textColor={textColor}>
            {t('login.password_policy')}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
      </Flex>
    </>
  );
};

CreateSubscriberForm.propTypes = propTypes;
CreateSubscriberForm.defaultProps = defaultProps;

export default CreateSubscriberForm;
