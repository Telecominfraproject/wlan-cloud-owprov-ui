import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as createUuid } from 'uuid';
import { useToast, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { CreateLocationSchema } from 'constants/formSchemas';
import StringField from 'components/FormFields/StringField';
import SelectWithSearchField from 'components/FormFields/SelectWithSearchField';
import { useGetEntities } from 'hooks/Network/Entity';
import { useCreateLocation } from 'hooks/Network/Locations';
import SelectField from 'components/FormFields/SelectField';
import CreatableSelectField from 'components/FormFields/CreatableSelectField';
import COUNTRY_LIST from 'constants/countryList';
import AddressSearchField from 'components/FormFields/AddressSearchField';
import { useQueryClient } from 'react-query';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  entityId: PropTypes.string,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const defaultProps = {
  entityId: '',
};

const CreateLocationForm = ({ isOpen, onClose, refresh, formRef, entityId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formKey, setFormKey] = useState(createUuid());
  const { data: entities } = useGetEntities({ t, toast });
  const queryClient = useQueryClient();

  const create = useCreateLocation();

  useEffect(() => {
    setFormKey(createUuid());
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
        entity: entityId,
        note: '',
      }}
      validationSchema={CreateLocationSchema(t)}
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
          entity,
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
            entity,
            notes: note.length > 0 ? [{ note }] : undefined,
          },
          {
            onSuccess: async () => {
              toast({
                id: 'location-creation-success',
                title: t('common.success'),
                description: t('crud.success_create_obj', {
                  obj: t('locations.one'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              queryClient.invalidateQueries('get-location-count');
              queryClient.invalidateQueries('get-locations-with-pagination');
              queryClient.invalidateQueries('get-locations-with-pagination');
              queryClient.invalidateQueries('get-all-locations');
              setSubmitting(false);
              resetForm();
              refresh();
              onClose();
            },
            onError: (e) => {
              toast({
                id: createUuid(),
                title: t('common.error'),
                description: t('crud.error_create_obj', {
                  obj: t('locations.one'),
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
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8}>
            <StringField
              name="name"
              label={t('common.name')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="description"
              label={t('common.description')}
              errors={errors}
              touched={touched}
            />
            <SelectWithSearchField
              name="entity"
              label={t('inventory.parent')}
              errors={errors}
              touched={touched}
              options={
                entities?.map((ent) => ({
                  value: ent.id,
                  label: `${ent.name}${ent.description ? `: ${ent.description}` : ''}`,
                })) ?? []
              }
              setFieldValue={setFieldValue}
              isHidden={entityId !== ''}
              isRequired
            />
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

          <AddressSearchField
            placeholder={t('common.address_search_autofill')}
            maxWidth="600px"
            mb={2}
          />
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
            <StringField
              name="city"
              label={t('locations.city')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="state"
              label={t('locations.state')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <StringField
              name="postal"
              label={t('locations.postal')}
              errors={errors}
              touched={touched}
              isRequired
            />
            <SelectField
              name="country"
              label={t('locations.country')}
              errors={errors}
              touched={touched}
              options={COUNTRY_LIST}
            />
            <StringField
              name="buildingName"
              label={t('locations.building_name')}
              errors={errors}
              touched={touched}
            />
            <StringField
              name="geoCode"
              label={t('locations.geocode')}
              errors={errors}
              touched={touched}
            />
            <StringField name="note" label={t('common.note')} errors={errors} touched={touched} />
          </SimpleGrid>
        </Form>
      )}
    </Formik>
  );
};

CreateLocationForm.propTypes = propTypes;
CreateLocationForm.defaultProps = defaultProps;

export default CreateLocationForm;
