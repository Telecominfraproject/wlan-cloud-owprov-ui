import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AddLocationForm, useAuth, useFormFields, useToast, AddressEditor } from 'ucentral-libs';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CNav,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CPopover,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX, cilSave } from '@coreui/icons';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import LocationTable from 'components/LocationTable';

const initialForm = {
  name: {
    value: '',
    error: false,
    hidden: false,
    required: true,
  },
  type: {
    value: 'AUTO',
    error: false,
  },
  buildingName: {
    value: '',
    error: false,
  },
  addressLines: {
    value: [''],
    error: false,
    required: false,
  },
  city: {
    value: '',
    error: false,
    required: true,
  },
  state: {
    value: '',
    error: false,
    required: true,
  },
  postal: {
    value: '',
    error: false,
    required: true,
  },
  country: {
    value: '',
    error: false,
    required: true,
  },
  phones: {
    value: [],
    error: false,
    required: false,
  },
  mobiles: {
    value: [],
    error: false,
    required: false,
  },
  geoCode: {
    value: '',
    error: false,
    required: false,
  },
  description: {
    value: '',
    error: false,
  },
  initialNote: {
    value: '',
    error: false,
    ignore: true,
  },
  entity: {
    value: '',
    error: false,
    hidden: false,
    required: true,
  },
};

const AddLocationModal = ({ entity, show, toggle, refreshTable }) => {
  const { t } = useTranslation();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [fields, updateFieldWithId, updateField, setFormFields, batchSetField] =
    useFormFields(initialForm);
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState([]);

  const toggleModal = () => {
    if (show) refreshTable();
    toggle();
  };

  const validation = () => {
    for (const [key, field] of Object.entries(fields)) {
      if (
        (field.required && field.value === '') ||
        (field.length && field.value.length !== field.length)
      ) {
        updateField(key, { error: true });
        return false;
      }

      if (fields.addressLines.value[0] === '') {
        updateField('addressLines', { error: true });
        return false;
      }
    }
    return true;
  };

  const setAddress = (v) => {
    const city =
      v.locality.long_name ??
      v.administrative_area_level_3.long_name ??
      v.administrative_area_level_2.long_name;

    batchSetField([
      { id: 'addressLines', value: [`${v.street_number.long_name} ${v.route.long_name}`] },
      {
        id: 'city',
        value: city,
      },
      { id: 'state', value: v.administrative_area_level_1.long_name },
      { id: 'postal', value: v.postal_code.long_name },
      { id: 'country', value: v.country.short_name },
      { id: 'geoCode', value: JSON.stringify(v.geoCode) },
    ]);
  };

  const addLocation = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {};

      for (const [k, v] of Object.entries(fields)) {
        if (!fields.ignore) parameters[k] = v.value;
      }

      if (fields.initialNote !== '') parameters.notes = [{ note: fields.initialNote.value }];

      if (entity) parameters.entity = entity.uuid;

      axiosInstance
        .post(`${endpoints.owprov}/api/v1/location/1`, parameters, options)
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('location.successful_creation'),
            color: 'success',
            autohide: true,
          });
          refreshTable();
          toggleModal();
        })
        .catch((e) => {
          addToast({
            title: t('common.error'),
            body: t('location.error_creation', { error: e.response?.data?.ErrorDescription }),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getPartialEntities = async (offset) => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity?limit=500&offset=${offset}`, { headers })
      .then((response) => response.data.entities)
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.general_error'),
          color: 'danger',
          autohide: true,
        });
        return [];
      });
  };

  const getEntities = async () => {
    setLoading(true);

    const allEntites = [];
    let continueGetting = true;
    let i = 1;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newStuff = await getPartialEntities(i);
      if (newStuff === null || newStuff.length === 0) continueGetting = false;
      allEntites.push(...newStuff);
      i += 500;
    }
    const sorted = allEntites.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });
    setEntities(sorted);

    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      if (entity === null) getEntities();
      setActiveTab(0);
      refreshTable();
      const startingForm = initialForm;

      // If this modal is used within an Entity Page, we use the page's entity and hide the field
      if (entity) {
        startingForm.entity.value = entity.uuid;
        startingForm.entity.hidden = true;
      }

      setFormFields(startingForm);
    }
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggleModal}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">Add Location</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton
              color="primary"
              variant="outline"
              className="mx-2"
              onClick={addLocation}
              disabled={activeTab !== 0}
            >
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggleModal}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody className="pb-5">
        {entity !== null ? (
          <div>
            <CNav variant="tabs">
              <CNavLink
                href="#"
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
                className="font-weight-bold"
              >
                Create New
              </CNavLink>
              <CNavLink
                href="#"
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                className="font-weight-bold"
              >
                Already Existing Locations
              </CNavLink>
            </CNav>
            <CTabContent className="py-2">
              <CTabPane active={activeTab === 0}>
                <AddLocationForm
                  t={t}
                  disable={loading}
                  fields={fields}
                  updateField={updateFieldWithId}
                  updateFieldWithKey={updateField}
                  batchSetField={batchSetField}
                  locationSearch={
                    show ? (
                      <AddressEditor
                        t={t}
                        currentToken={currentToken}
                        endpoint={endpoints.owprov}
                        setAddress={setAddress}
                        show={show}
                      />
                    ) : null
                  }
                />
              </CTabPane>
              <CTabPane active={activeTab === 1}>
                {show ? <LocationTable entity={entity} title={t('location.title')} /> : null}
              </CTabPane>
            </CTabContent>
          </div>
        ) : (
          <AddLocationForm
            t={t}
            disable={loading}
            fields={fields}
            updateField={updateFieldWithId}
            updateFieldWithKey={updateField}
            entities={entities}
            batchSetField={batchSetField}
            locationSearch={
              show ? (
                <AddressEditor
                  t={t}
                  currentToken={currentToken}
                  endpoint={endpoints.owprov}
                  setAddress={setAddress}
                  show={show}
                />
              ) : null
            }
          />
        )}
      </CModalBody>
    </CModal>
  );
};

AddLocationModal.propTypes = {
  entity: PropTypes.instanceOf(Object),
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
};

AddLocationModal.defaultProps = {
  entity: null,
  refreshTable: null,
};

export default AddLocationModal;
