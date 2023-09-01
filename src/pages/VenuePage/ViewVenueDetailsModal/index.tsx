import * as React from 'react';
import { Box, IconButton, Tooltip, useBoolean, useToast } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import VenueActions from '../Actions';
import VenueDetailsForm from './Form';
import SaveButton from 'components/Buttons/SaveButton';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import EntityFavoritesButton from 'components/EntityFavoritesButton';
import ConfirmCloseAlert from 'components/Modals/Actions/ConfirmCloseAlert';
import { Modal } from 'components/Modals/Modal';
import { VenueSchema } from 'constants/formSchemas';
import { useGetVenue, useUpdateVenue } from 'hooks/Network/Venues';
import useFormModal from 'hooks/useFormModal';
import useFormRef from 'hooks/useFormRef';
import { AxiosError } from 'models/Axios';
import { VenueApiResponse } from 'models/Venue';

type Props = {
  id: string;
};

const ViewVenueDetailsModal = ({ id }: Props) => {
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
    <>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label={t('common.view_details')}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          onClick={modalInfo.onOpen}
          isDisabled={!getVenue.data}
        />
      </Tooltip>
      {getVenue.data ? (
        <Modal
          isOpen={modalInfo.isOpen}
          onClose={modalInfo.closeModal}
          title={getVenue.data?.name ?? ''}
          tags={
            <Box mt={-1}>
              <EntityFavoritesButton id={id} type="venue" />
            </Box>
          }
          topRightButtons={
            <>
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
              <Box fontSize="md">
                <VenueActions isDisabled={!getVenue.data || isEditing || updateVenue.isLoading} venueId={id} />
              </Box>
            </>
          }
        >
          <Formik
            innerRef={formRef}
            enableReinitialize
            key={formKey}
            initialValues={getVenue.data as VenueApiResponse & { __createLocation?: unknown }}
            validationSchema={VenueSchema(t)}
            onSubmit={(
              { name, description, deviceRules, sourceIP, location, __createLocation },
              { setSubmitting, resetForm },
            ) =>
              updateVenue.mutateAsync(
                {
                  params: {
                    name,
                    description,
                    deviceRules,
                    sourceIP,
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
        </Modal>
      ) : null}
      <ConfirmCloseAlert
        isOpen={modalInfo.isConfirmOpen}
        confirm={modalInfo.closeCancelAndForm}
        cancel={modalInfo.closeConfirm}
      />
    </>
  );
};

export default ViewVenueDetailsModal;
