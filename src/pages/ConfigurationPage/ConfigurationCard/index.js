import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Box, Center, Heading, Spacer, Spinner, useBoolean, useDisclosure, useToast } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetConfiguration, useUpdateConfiguration } from 'hooks/Network/Configurations';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import isEqual from 'react-fast-compare';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import RefreshButton from 'components/Buttons/RefreshButton';
import CardBody from 'components/Card/CardBody';
import EditConfigurationForm from './Form';
import DeleteConfigurationPopover from './DeleteConfigurationPopover';
import ConfigurationSectionsCard from './ConfigurationSectionsCard';
import { BASE_SECTIONS } from '../../../constants/configuration';
import ConfirmConfigurationWarnings from './ConfirmConfigurationWarnings';

const propTypes = {
  id: PropTypes.string.isRequired,
};

const tryParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
};

const ConfigurationCard = ({ id }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useBoolean();
  const { isOpen: showWarnings, onOpen: openWarnings, onClose: closeWarnings } = useDisclosure();
  const { isOpen: showConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure();
  const { data: configuration, refetch, isFetching } = useGetConfiguration({ id });
  const updateEntity = useUpdateConfiguration({ id });
  const [form, setForm] = useState({});
  const [sections, setSections] = useState(BASE_SECTIONS);
  const formRef = useCallback(
    (node) => {
      if (
        node !== null &&
        (form.submitForm !== node.submitForm ||
          form.isSubmitting !== node.isSubmitting ||
          form.isValid !== node.isValid ||
          form.dirty !== node.dirty ||
          !isEqual(form.values, node.values))
      ) {
        setForm(node);
      }
    },
    [form],
  );

  const submit = () => {
    closeWarnings();
    updateEntity.mutateAsync(
      {
        ...form.values,
        entity:
          form.values.entity === '' || form.values.entity.split(':')[0] !== 'ent'
            ? ''
            : form.values.entity.split(':')[1],
        venue:
          form.values.entity === '' || form.values.entity.split(':')[0] !== 'ven'
            ? ''
            : form.values.entity.split(':')[1],
        configuration: sections.activeConfigurations.map((conf) => {
          const deviceConfig = sections.data[conf].data.configuration;
          if (conf !== 'third-party') deviceConfig.__selected_subcategories = undefined;
          const config = { ...sections.data[conf].data, configuration: {} };
          if (conf === 'interfaces') config.configuration = { interfaces: deviceConfig };
          else if (conf === 'third-party') config.configuration = { 'third-party': tryParse(deviceConfig) };
          else config.configuration[conf] = deviceConfig;
          return config;
        }),
      },
      {
        onSuccess: ({ data }) => {
          toast({
            id: 'configuration-update-success',
            title: t('common.success'),
            description: t('crud.success_update_obj', {
              obj: t('configurations.one'),
            }),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          queryClient.setQueryData(['get-configuration', configuration.id], data);
          queryClient.invalidateQueries(['get-configurations']);
          setEditing.off();
        },
        onError: (e) => {
          toast({
            id: uuid(),
            title: t('common.error'),
            description: t('crud.error_update_obj', {
              obj: t('configurations.one'),
              e: e?.response?.data?.ErrorDescription,
            }),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        },
      },
    );
  };

  const handleSubmitClick = () => {
    if (!sections?.warnings?.interfaces || sections?.warnings?.interfaces.length === 0) {
      submit();
    } else {
      openWarnings();
    }
  };

  const stopEditing = () => (form.dirty || sections.isDirty ? openConfirm() : setEditing.off());

  const toggleEdit = () => {
    if (editing) stopEditing();
    else setEditing.on();
  };
  const closeCancelAndForm = () => {
    closeConfirm();
    setEditing.off();
    queryClient.invalidateQueries(['get-configuration', id]);
  };

  return (
    <>
      <Card mb={4}>
        <CardHeader mb="10px" display="flex">
          <Box pt={1}>
            <Heading size="md">{configuration?.name}</Heading>
          </Box>
          <Spacer />
          <Box>
            <SaveButton
              onClick={handleSubmitClick}
              isLoading={updateEntity.isLoading}
              isCompact={false}
              isDisabled={
                !editing || !form.isValid || sections.invalidValues.length > 0 || (!form.dirty && !sections.isDirty)
              }
              ml={2}
            />
            <ToggleEditButton
              toggleEdit={toggleEdit}
              isEditing={editing}
              isDisabled={isFetching}
              isDirty={formRef.dirty}
              ml={2}
            />
            <DeleteConfigurationPopover isDisabled={editing || isFetching} configuration={configuration} />
            <RefreshButton onClick={refetch} isFetching={isFetching} isDisabled={editing} ml={2} />
          </Box>
        </CardHeader>
        <CardBody>
          {!configuration && isFetching ? (
            <Center w="100%">
              <Spinner size="xl" />
            </Center>
          ) : (
            <LoadingOverlay isLoading={isFetching}>
              <EditConfigurationForm
                editing={editing}
                configuration={configuration}
                stopEditing={setEditing.off}
                formRef={formRef}
              />
            </LoadingOverlay>
          )}
        </CardBody>
      </Card>
      <ConfigurationSectionsCard editing={editing} configId={id} setSections={setSections} />
      <ConfirmConfigurationWarnings
        isOpen={showWarnings}
        onClose={closeWarnings}
        warnings={sections?.warnings ?? {}}
        submit={submit}
        activeConfigurations={sections?.activeConfigurations ?? []}
      />
      <ConfirmCloseAlert isOpen={showConfirm} confirm={closeCancelAndForm} cancel={closeConfirm} />
    </>
  );
};

ConfigurationCard.propTypes = propTypes;

export default React.memo(ConfigurationCard);
