import * as React from 'react';
import { Box, Center, HStack, Heading, Spacer, Spinner, useBoolean, useToast } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import VenueDetailsForm from './Form';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { VenueSchema } from 'constants/formSchemas';
import { useGetVenue, useUpdateVenue } from 'hooks/Network/Venues';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { AxiosError } from 'models/Axios';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  id: string;
};

const VenueDetailsCard = ({ id }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = React.useState(uuid());
  const { form, formRef } = useFormRef<VenueApiResponse & { __createLocation?: unknown }>();
  const updateVenue = useUpdateVenue({ id });
  const [isEditing, setEditing] = useBoolean();
  const modalInfo = useFormModal({
    isDirty: form.dirty,
  });
  const getVenue = useGetVenue({ id });

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
        <Heading size="md">{t('common.details')}</Heading>
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
            isDisabled={getVenue.isFetching}
            isDirty={form.dirty}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <Box w="100%">
          {getVenue.data ? (
            <Formik
              innerRef={formRef}
              enableReinitialize
              key={formKey}
              initialValues={getVenue.data as VenueApiResponse & { __createLocation?: unknown }}
              validationSchema={VenueSchema(t)}
              onSubmit={({ name, description, location, __createLocation }, { setSubmitting, resetForm }) =>
                updateVenue.mutateAsync(
                  {
                    params: {
                      name,
                      description,
                      location: location === 'CREATE_NEW' ? undefined : location,
                    },
                    createObjects: __createLocation ? { objects: [{ location: __createLocation }] } : undefined,
                  },
                  {
                    onSuccess: () => {
                      setSubmitting(false);
                      toast({
                        id: 'venue-update-success',
                        title: t('common.success'),
                        description: t('crud.success_update_obj', {
                          obj: t('venues.one'),
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
                          obj: t('venues.one'),
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
              <VenueDetailsForm
                isDisabled={!isEditing || getVenue.isFetching || updateVenue.isLoading}
                venue={getVenue.data}
              />
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

export default VenueDetailsCard;
