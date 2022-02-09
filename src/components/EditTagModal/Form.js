import React, { useEffect, useState } from 'react';
import {
  CForm,
  CDataTable,
  CLink,
  CInput,
  CLabel,
  CCol,
  CFormGroup,
  CFormText,
  CRow,
  CButton,
  CCollapse,
  CPopover,
} from '@coreui/react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { FormattedDate, RequiredAsterisk, SELECT_STYLES, useToggle } from 'ucentral-libs';

const EditInventoryTagForm = ({
  t,
  disable,
  fields,
  updateField,
  updateFieldDirectly,
  entities,
  venues,
  deviceTypes,
  editing,
  hideEntities,
  batchSetField,
}) => {
  const [showDropdown, toggleDropdown, setShowDropdown] = useToggle(false);
  const [entityFilter, setEntityFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('');

  const selectEntity = ({ id, name }) => {
    batchSetField([
      { id: 'entity', value: id },
      { id: 'entityName', value: name },
      { id: 'venue', value: '' },
      { id: 'venueName', value: '' },
    ]);
    toggleDropdown();
  };

  const selectVenue = ({ id, name }) => {
    batchSetField([
      { id: 'venue', value: id },
      { id: 'venueName', value: name },
      { id: 'entity', value: '' },
      { id: 'entityName', value: '' },
    ]);
    toggleDropdown();
  };

  const columns = [
    { key: 'created', label: t('common.created'), _style: { width: '20%' }, filter: false },
    { key: 'name', label: t('user.name'), _style: { width: '25%' }, filter: false },
    { key: 'description', label: t('user.description'), _style: { width: '50%' } },
    { key: 'actions', label: '', _style: { width: '15%' }, filter: false },
  ];

  const getEntityLabel = () => {
    if (fields.entity.value !== '') return t('entity.entity');
    if (fields.venue.value !== '') return t('inventory.venue');
    return `${t('entity.entity')}/${t('inventory.venue')}`;
  };

  const getEntityValue = () => {
    if (fields.entity.value !== '') return fields.entityName.value;
    if (fields.venue.value !== '') return fields.venueName.value;
    return t('entity.need_select_entity');
  };

  useEffect(() => {
    if (!editing) setShowDropdown(false);
  }, [editing]);

  return (
    <CForm>
      <CFormGroup row className="mb-1">
        <CCol>
          <CLabel htmlFor="serialNumber">{t('common.serial_number')}</CLabel>
        </CCol>
        <CCol sm="8">{fields.serialNumber.value}</CCol>
      </CFormGroup>
      <CFormGroup row className="mb-1">
        <CLabel col htmlFor="name">
          {t('user.name')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="8">
          {editing ? (
            <div>
              <CInput
                id="name"
                type="text"
                required
                value={fields.name.value}
                onChange={updateField}
                invalid={fields.name.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText hidden={!fields.name.error} color={fields.name.error ? 'danger' : ''}>
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.name.value}</p>
          )}
        </CCol>
      </CFormGroup>
      <CFormGroup row className="mb-1">
        <CLabel col htmlFor="description">
          {t('user.description')}
        </CLabel>
        <CCol sm="8">
          {editing ? (
            <div>
              <CInput
                id="description"
                type="text"
                required
                value={fields.description.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.description.value}</p>
          )}
        </CCol>
      </CFormGroup>
      <CFormGroup row className="mb-1">
        <CLabel col htmlFor="deviceType">
          {t('firmware.device_type')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="8">
          <div style={{ width: '250px' }}>
            <Select
              styles={SELECT_STYLES}
              id="deviceType"
              value={{ value: fields.deviceType.value, label: fields.deviceType.value }}
              onChange={(v) => updateFieldDirectly('deviceType', { value: v.value })}
              options={deviceTypes.map((v) => ({ value: v, label: v }))}
              isDisabled={disable || !editing}
            />
          </div>
          <CFormText
            hidden={!fields.deviceType.error}
            color={fields.deviceType.error ? 'danger' : ''}
          >
            {t('common.required')}
          </CFormText>
        </CCol>
      </CFormGroup>
      <CRow className="mb-1">
        <CLabel sm="4" col htmlFor="rrm">
          RRM
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="8">
          <div style={{ width: '120px' }}>
            <Select
              id="rrm"
              styles={SELECT_STYLES}
              value={{ value: fields.rrm.value, label: fields.rrm.value }}
              onChange={(v) => updateFieldDirectly('rrm', { value: v.value, error: false })}
              options={[
                { label: 'on', value: 'on' },
                { label: 'off', value: 'off' },
                { label: 'inherit', value: 'inherit' },
              ]}
              isDisabled={disable || !editing}
            />
          </div>
          <CFormText hidden={!fields.rrm.error} color={fields.rrm.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
      </CRow>
      <CRow className="mb-1">
        <CLabel sm="4" col htmlFor="name">
          Device Class
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="8">
          <div style={{ width: '120px' }}>
            <Select
              id="devClass"
              styles={SELECT_STYLES}
              value={{ value: fields.devClass.value, label: fields.devClass.value }}
              onChange={(v) => updateFieldDirectly('devClass', { value: v.value, error: false })}
              options={[
                { value: 'any', label: 'any' },
                { value: 'entity', label: 'entity' },
                { value: 'venue', label: 'venue' },
                { value: 'subscriber', label: 'subscriber' },
              ]}
              isDisabled={disable || !editing}
            />
          </div>
          <CFormText hidden={!fields.rrm.error} color={fields.rrm.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
      </CRow>
      <CFormGroup row className="pb-1">
        <CLabel sm="4" col htmlFor="title">
          {getEntityLabel()}
        </CLabel>
        <CCol sm="8">
          <CButton className="pl-0" color="link" onClick={toggleDropdown} disabled={!editing}>
            {getEntityValue()}
          </CButton>
        </CCol>
      </CFormGroup>
      {hideEntities ? null : (
        <CCollapse show={showDropdown}>
          <div className="overflow-auto border mb-3" style={{ height: '200px' }}>
            <h5>{t('entity.entities')}</h5>
            <CInput
              className="w-50 mb-2"
              type="text"
              placeholder="Search"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            />
            <CDataTable
              items={entities}
              fields={columns}
              hover
              tableFilterValue={entityFilter}
              border
              scopedSlots={{
                name: (item) => (
                  <td className="align-middle p-1">
                    <CLink
                      className="c-subheader-nav-link"
                      aria-current="page"
                      to={() => `/entity/${item.id}`}
                    >
                      {item.name}
                    </CLink>
                  </td>
                ),
                created: (item) => (
                  <td className="align-middle p-1">
                    <FormattedDate date={item.created} />
                  </td>
                ),
                actions: (item) => (
                  <td className="align-middle p-1">
                    <CPopover content={t('entity.select_entity')}>
                      <CButton
                        size="sm"
                        color="primary"
                        variant="outline"
                        onClick={() => selectEntity(item)}
                        disabled={!editing}
                      >
                        {t('common.select')}
                      </CButton>
                    </CPopover>
                  </td>
                ),
              }}
            />
            <h5>{t('entity.venues')}</h5>
            <CInput
              className="w-50 mb-2"
              type="text"
              placeholder="Search"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            />
            <CDataTable
              items={venues}
              fields={columns}
              hover
              tableFilterValue={venueFilter}
              border
              scopedSlots={{
                name: (item) => (
                  <td className="align-middle p-1">
                    <CLink
                      className="c-subheader-nav-link"
                      aria-current="page"
                      to={() => `/entity/${item.id}`}
                    >
                      {item.name}
                    </CLink>
                  </td>
                ),
                created: (item) => (
                  <td className="align-middle p-1">
                    <FormattedDate date={item.created} />
                  </td>
                ),
                actions: (item) => (
                  <td className="align-middle p-1">
                    <CPopover content={t('entity.select_entity')}>
                      <CButton
                        size="sm"
                        color="primary"
                        variant="outline"
                        onClick={() => selectVenue(item)}
                        disabled={!editing}
                      >
                        {t('common.select')}
                      </CButton>
                    </CPopover>
                  </td>
                ),
              }}
            />
          </div>
        </CCollapse>
      )}
    </CForm>
  );
};

EditInventoryTagForm.propTypes = {
  t: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldDirectly: PropTypes.func.isRequired,
  deviceTypes: PropTypes.instanceOf(Array).isRequired,
  editing: PropTypes.bool.isRequired,
  entities: PropTypes.instanceOf(Array).isRequired,
  venues: PropTypes.instanceOf(Array).isRequired,
  hideEntities: PropTypes.bool,
  batchSetField: PropTypes.func.isRequired,
};

EditInventoryTagForm.defaultProps = {
  hideEntities: false,
};

export default EditInventoryTagForm;
