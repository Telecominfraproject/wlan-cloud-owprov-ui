import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import NotesTable from 'components/CustomFields/NotesTable';
import StringField from 'components/FormFields/StringField';
import { LocationShape } from 'constants/propShapes';
import { OperatorLocationSchema } from 'constants/formSchemas';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { useUpdateOperatorLocation } from 'hooks/Network/OperatorLocations';
import useMutationResult from 'hooks/useMutationResult';
import COUNTRY_LIST from 'constants/countryList';
import AddressSearchField from 'components/CustomFields/AddressSearchField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  location: PropTypes.shape(LocationShape).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const EditOperatorLocationForm = ({ editing, isOpen, onClose, refresh, location, formRef }) => {
  const { t } = useTranslation();
  const { onSuccess, onError } = useMutationResult({
    objName: t('locations.one'),
    operationType: 'update',
    refresh,
    onClose,
  });
  const [formKey, setFormKey] = useState(uuid());
  const updateLocation = useUpdateOperatorLocation({ id: location.id });

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={{
        ...location,
        addressLineOne: location.addressLines[0],
        addressLineTwo: location.addressLines.length >= 2 ? location.addressLines[1] : '',
      }}
      validationSchema={OperatorLocationSchema(t)}
      onSubmit={(
        {
          name,
          description,
          type,
          addressLineOne,
          addressLineTwo,
          city,
          state,
          postal,
          country,
          buildingName,
          mobiles,
          phones,
          geoCode,
          notes,
        },
        { setSubmitting, resetForm },
      ) =>
        updateLocation.mutateAsync(
          {
            name,
            description,
            type,
            addressLines: [addressLineOne, addressLineTwo],
            city,
            state,
            postal,
            country,
            buildingName,
            mobiles,
            phones,
            geoCode,
            notes: notes.filter((note) => note.isNew),
          },
          {
            onSuccess: () => {
              onSuccess(setSubmitting, resetForm);
            },
            onError: (e) => {
              onError(e, { resetForm });
            },
          },
        )
      }
    >
      <Tabs variant="enclosed">
        <TabList>
          <Tab>{t('common.main')}</Tab>
          <Tab>{t('common.notes')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Form>
              <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
                <StringField name="name" label={t('common.name')} isRequired isDisabled={!editing} />
                <StringField name="description" label={t('common.description')} isDisabled={!editing} />
                <SelectField
                  name="type"
                  label={t('common.type')}
                  options={[
                    { label: 'SERVICE', value: 'SERVICE' },
                    { label: 'EQUIPMENT', value: 'EQUIPMENT' },
                    { label: 'AUTO', value: 'AUTO' },
                    { label: 'MANUAL', value: 'MANUAL' },
                    { label: 'SPECIAL', value: 'SPECIAL' },
                    { label: 'UNKNOWN', value: 'UNKNOWN' },
                    { label: 'CORPORATE', value: 'CORPORATE' },
                  ]}
                  isDisabled={!editing}
                />
                <CreatableSelectField
                  name="phones"
                  label={t('contacts.phones')}
                  placeholder="+1(202)555-0103"
                  isDisabled={!editing}
                />
                <CreatableSelectField
                  name="mobiles"
                  label={t('contacts.mobiles')}
                  placeholder="+1(202)555-0103"
                  isDisabled={!editing}
                />
              </SimpleGrid>

              <AddressSearchField
                placeholder={t('common.address_search_autofill')}
                maxWidth="600px"
                mb={2}
                isDisabled={!editing}
              />
              <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
                <StringField
                  name="addressLineOne"
                  label={t('locations.address_line_one')}
                  isRequired
                  isDisabled={!editing}
                />
                <StringField name="addressLineTwo" label={t('locations.address_line_two')} isDisabled={!editing} />
                <StringField name="city" label={t('locations.city')} isRequired isDisabled={!editing} />
                <StringField name="state" label={t('locations.state')} isRequired isDisabled={!editing} />
                <StringField name="postal" label={t('locations.postal')} isRequired isDisabled={!editing} />
                <SelectField
                  name="country"
                  label={t('locations.country')}
                  options={COUNTRY_LIST}
                  isDisabled={!editing}
                />
                <StringField name="buildingName" label={t('locations.building_name')} isDisabled={!editing} />
                <StringField name="geoCode" label={t('locations.geocode')} isDisabled={!editing} />
              </SimpleGrid>
            </Form>
          </TabPanel>
          <TabPanel>
            {' '}
            <NotesTable name="notes" isDisabled={!editing} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Formik>
  );
};

EditOperatorLocationForm.propTypes = propTypes;

export default EditOperatorLocationForm;
