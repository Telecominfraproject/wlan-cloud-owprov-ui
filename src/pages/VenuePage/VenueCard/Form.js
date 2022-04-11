import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { useToast, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid, Box } from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import { useAuth } from 'contexts/AuthProvider';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { EntityShape } from 'constants/propShapes';
import { VenueSchema } from 'constants/formSchemas';
import SelectField from 'components/FormFields/SelectField';
import FormattedDate from 'components/FormattedDate';
import { useQueryClient } from 'react-query';
import IpDetectionModalField from 'components/CustomFields/IpDetectionModalField';
import { useUpdateVenue } from 'hooks/Network/Venues';
import LocationPickerCreator from 'components/CreateObjectsForms/LocationPickerCreator';
import { useCreateAnalyticsBoard, useDeleteAnalyticsBoard, useUpdateAnalyticsBoard } from 'hooks/Network/Analytics';
import VenueAnalytics from './VenueAnalytics';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  venue: PropTypes.shape(EntityShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  stopEditing: PropTypes.func.isRequired,
  board: PropTypes.shape({
    name: PropTypes.string.isRequired,
    venueList: PropTypes.arrayOf(
      PropTypes.shape({
        interval: PropTypes.number.isRequired,
        retention: PropTypes.number.isRequired,
        monitorSubVenues: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }),
};

const defaultProps = {
  board: null,
};

const EditVenueForm = ({ editing, venue, formRef, stopEditing, board }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { endpoints } = useAuth();
  const [formKey, setFormKey] = useState(uuid());
  const queryClient = useQueryClient();
  const updateVenue = useUpdateVenue({ id: venue.id });
  const createAnalytics = useCreateAnalyticsBoard();
  const updateAnalytics = useUpdateAnalyticsBoard();
  const deleteAnalytics = useDeleteAnalyticsBoard();

  useEffect(() => {
    setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={{
        ...venue,
        rrm: venue.rrm !== '' ? venue.rrm : 'inherit',
        __BOARD: !board
          ? undefined
          : {
              name: board.name,
              interval: board.venueList[0].interval,
              retention: board.venueList[0].retention,
              monitorSubVenues: board.venueList[0].monitorSubVenues,
            },
      }}
      validationSchema={VenueSchema(t)}
      onSubmit={(
        { name, description, rrm, sourceIP, notes, location, __createLocation, __BOARD },
        { setSubmitting, resetForm },
      ) => {
        const updateVenueWithInfo = (boards) =>
          updateVenue.mutateAsync(
            {
              params: {
                name,
                description,
                rrm,
                sourceIP,
                location: location === 'CREATE_NEW' ? undefined : location,
                boards,
                notes: notes.filter((note) => note.isNew),
              },
              createObjects: __createLocation ? { objects: [{ location: __createLocation }] } : undefined,
            },
            {
              onSuccess: ({ data }) => {
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
                queryClient.setQueryData(['get-venue', venue.id], data);
                queryClient.invalidateQueries(['get-entity-tree']);
                queryClient.invalidateQueries(['get-all-locations']);
                resetForm();
                stopEditing();
              },
              onError: (e) => {
                toast({
                  id: uuid(),
                  title: t('common.error'),
                  description: t('crud.error_update_obj', {
                    obj: t('venue.one'),
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
          );

        if (__BOARD) {
          if (venue.boards.length > 0) {
            updateAnalytics.mutateAsync(
              {
                name: __BOARD.name,
                venueList: [
                  {
                    id: venue.id,
                    name,
                    retention: __BOARD.retention,
                    interval: __BOARD.interval,
                    monitorSubVenues: __BOARD.monitorSubVenues,
                  },
                ],
                id: venue.boards[0],
              },
              {
                onSuccess: () => {
                  updateVenueWithInfo();
                  queryClient.invalidateQueries(['get-board', venue.boards[0]]);
                },
                onError: (e) => {
                  toast({
                    id: uuid(),
                    title: t('common.error'),
                    description: t('crud.error_update_obj', {
                      obj: t('analytics.board'),
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
            );
          } else {
            createAnalytics.mutateAsync(
              {
                name: __BOARD.name,
                venueList: [
                  {
                    id: venue.id,
                    name,
                    retention: __BOARD.retention,
                    interval: __BOARD.interval,
                    monitorSubVenues: __BOARD.monitorSubVenues,
                  },
                ],
              },
              {
                onSuccess: ({ data: boardData }) => updateVenueWithInfo([boardData.id]),
                onError: (e) => {
                  toast({
                    id: uuid(),
                    title: t('common.error'),
                    description: t('crud.error_create_obj', {
                      obj: t('analytics.board'),
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
            );
          }
        } else if (venue.boards.length > 0) {
          deleteAnalytics.mutateAsync(venue.boards[0], {
            onSuccess: () => updateVenueWithInfo([]),
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_delete_obj', {
                  obj: t('analytics.board'),
                  e: e?.response?.data?.ErrorDescription,
                }),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              setSubmitting(false);
            },
          });
        } else {
          updateVenueWithInfo();
        }
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Tabs variant="enclosed" w="100%">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
            {endpoints.owanalytics && <Tab>{t('analytics.title')}</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form>
                <SimpleGrid minChildWidth="300px" spacing="20px">
                  <StringField
                    name="name"
                    label={t('common.name')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                    isRequired
                  />
                  <StringField
                    name="description"
                    label={t('common.description')}
                    errors={errors}
                    touched={touched}
                    isDisabled={!editing}
                  />
                  <SelectField
                    name="rrm"
                    label="RRM"
                    errors={errors}
                    touched={touched}
                    options={[
                      { label: 'inherit', value: 'inherit' },
                      { label: 'on', value: 'on' },
                      { label: 'off', value: 'off' },
                    ]}
                    isDisabled={!editing}
                    w={28}
                  />
                  <IpDetectionModalField
                    name="sourceIP"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    isDisabled={!editing}
                  />
                  <LocationPickerCreator
                    locationName="location"
                    createLocationName="__createLocation"
                    editing={editing}
                    venueId={venue.id}
                    isModal
                  />
                  <StringField
                    name="created"
                    label={t('common.created')}
                    errors={errors}
                    touched={touched}
                    element={
                      <Box pl={1} pt={2}>
                        <FormattedDate date={venue.created} />
                      </Box>
                    }
                  />
                  <StringField
                    name="modified"
                    label={t('common.modified')}
                    errors={errors}
                    touched={touched}
                    element={
                      <Box pl={1} pt={2}>
                        <FormattedDate date={venue.modified} />
                      </Box>
                    }
                  />
                </SimpleGrid>
              </Form>
            </TabPanel>
            <TabPanel>
              <Field name="notes">
                {({ field }) => <NotesTable notes={field.value} setNotes={setFieldValue} isDisabled={!editing} />}
              </Field>
            </TabPanel>
            {endpoints.owanalytics && (
              <TabPanel>
                <VenueAnalytics editing={editing} venueName={venue?.name} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      )}
    </Formik>
  );
};

EditVenueForm.propTypes = propTypes;
EditVenueForm.defaultProps = defaultProps;

export default EditVenueForm;
