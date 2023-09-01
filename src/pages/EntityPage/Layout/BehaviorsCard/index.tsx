import * as React from 'react';
import { Box, Center, HStack, Heading, Spacer, Spinner, useBoolean, useToast } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import EntityDetailsForm from './Form';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { EntitySchema } from 'constants/formSchemas';
import { useGetEntity, useUpdateEntity } from 'hooks/Network/Entity';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { AxiosError } from 'models/Axios';
import { Entity } from 'models/Entity';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  id: string;
};

const EntityBehaviorsCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = React.useState(uuid());
  const { form, formRef } = useFormRef<VenueApiResponse & { __createLocation?: unknown }>();
  const updateEntity = useUpdateEntity({ id });
  const [isEditing, setEditing] = useBoolean();
  const modalInfo = useFormModal({
    isDirty: form.dirty,
  });
  const getEntity = useGetEntity({ id });

  React.useEffect(() => {
    setFormKey(uuid());
  }, [isEditing]);

  React.useEffect(() => {
    if (!modalInfo.isOpen) {
      setEditing.off();
    }
  }, [modalInfo.isOpen]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Behaviors</Heading>
        <Spacer />
        <HStack>
          <SaveButton
            onClick={form.submitForm}
            isLoading={form.isSubmitting}
            isCompact
            isDisabled={!isEditing || !form.isValid || !form.dirty}
            hidden={!isEditing}
          />
          <ToggleEditButton
            isEditing={isEditing}
            toggleEdit={setEditing.toggle}
            isDisabled={getEntity.isFetching}
            isDirty={form.dirty}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <Box w="100%">
          {getEntity.data ? (
            <Formik
              innerRef={formRef}
              enableReinitialize
              key={formKey}
              initialValues={getEntity.data as Entity}
              validationSchema={EntitySchema(t)}
              onSubmit={({ deviceRules, sourceIP }, { setSubmitting, resetForm }) =>
                updateEntity.mutateAsync(
                  {
                    deviceRules,
                    sourceIP,
                  },
                  {
                    onSuccess: () => {
                      setSubmitting(false);
                      toast({
                        id: 'entity-update-success',
                        title: t('common.success'),
                        description: t('crud.success_update_obj', {
                          obj: t('entities.one'),
                        }),
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right',
                      });
                      resetForm();
                      setEditing.off();
                    },
                    onError: (e) => {
                      toast({
                        id: uuid(),
                        title: t('common.error'),
                        description: t('crud.error_update_obj', {
                          obj: t('entities.one'),
                          e: (e as AxiosError)?.response?.data?.ErrorDescription,
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
              <EntityDetailsForm isDisabled={!isEditing || getEntity.isFetching || updateEntity.isLoading} />
            </Formik>
          ) : (
            <Center my={12}>
              <Spinner size="xl" />
            </Center>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default EntityBehaviorsCard;
