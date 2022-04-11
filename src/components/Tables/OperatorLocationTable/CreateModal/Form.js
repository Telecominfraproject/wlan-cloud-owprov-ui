import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { OperatorLocationSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import { useCreateOperatorLocation } from 'hooks/Network/OperatorLocations';
import useMutationResult from 'hooks/useMutationResult';
import AddressSearchField from 'components/CustomFields/AddressSearchField';
import COUNTRY_LIST from 'constants/countryList';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
  operatorId: PropTypes.string.isRequired,
};

const CreateOperatorLocationForm = ({ isOpen, onClose, refresh, formRef, operatorId }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const { onSuccess, onError } = useMutationResult({
    objName: t('locations.one'),
    operationType: 'create',
    refresh,
    onClose,
  });

  const create = useCreateOperatorLocation();

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      key={formKey}
      initialValues={{
        name: '',
        description: '',
        type: 'SERVICE',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        state: '',
        postal: '',
        country: '',
        buildingName: '',
        mobiles: [],
        phones: [],
        geoCode: '',
        note: '',
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
          note,
        },
        { setSubmitting, resetForm },
      ) =>
        create.mutateAsync(
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
            operatorId,
            notes: note.length > 0 ? [{ note }] : undefined,
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
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
            <StringField name="name" label={t('common.name')} errors={errors} touched={touched} isRequired />
            <StringField name="description" label={t('common.description')} errors={errors} touched={touched} />
            <SelectField
              name="type"
              label={t('common.type')}
              errors={errors}
              touched={touched}
              options={[
                { label: 'SERVICE', value: 'SERVICE' },
                { label: 'EQUIPMENT', value: 'EQUIPMENT' },
                { label: 'AUTO', value: 'AUTO' },
                { label: 'MANUAL', value: 'MANUAL' },
                { label: 'SPECIAL', value: 'SPECIAL' },
                { label: 'UNKNOWN', value: 'UNKNOWN' },
                { label: 'CORPORATE', value: 'CORPORATE' },
              ]}
            />
            <CreatableSelectField
              name="phones"
              label={t('contacts.phones')}
              errors={errors}
              touched={touched}
              placeholder="+1(202)555-0103"
              setFieldValue={setFieldValue}
            />
            <CreatableSelectField
              name="mobiles"
              label={t('contacts.mobiles')}
              errors={errors}
              touched={touched}
              placeholder="+1(202)555-0103"
              setFieldValue={setFieldValue}
            />
          </SimpleGrid>

          <AddressSearchField placeholder={t('common.address_search_autofill')} maxWidth="600px" mb={2} />
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
            <StringField
              name="addressLineOne"
              label={t('locations.address_line_one')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="addressLineTwo"
              label={t('locations.address_line_two')}
              errors={errors}
              touched={touched}
            />
            <StringField name="city" label={t('locations.city')} errors={errors} touched={touched} isRequired />
            <StringField name="state" label={t('locations.state')} errors={errors} touched={touched} isRequired />
            <StringField name="postal" label={t('locations.postal')} errors={errors} touched={touched} isRequired />
            <SelectField
              name="country"
              label={t('locations.country')}
              errors={errors}
              touched={touched}
              options={COUNTRY_LIST}
            />
            <StringField name="buildingName" label={t('locations.building_name')} errors={errors} touched={touched} />
            <StringField name="geoCode" label={t('locations.geocode')} errors={errors} touched={touched} />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

CreateOperatorLocationForm.propTypes = propTypes;

export default CreateOperatorLocationForm;
