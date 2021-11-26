import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
  CForm,
  CInput,
  CLabel,
  CCol,
  CFormGroup,
  CFormText,
  CRow,
  CDataTable,
  CLink,
  CPopover,
  CButton,
  CCollapse,
} from '@coreui/react';
import { FormattedDate, RequiredAsterisk, COUNTRY_LIST, useToggle } from 'ucentral-libs';

const EditLocationForm = ({
  t,
  disable,
  fields,
  updateField,
  updateFieldWithKey,
  entities,
  locationSearch,
  batchSetField,
  editing,
}) => {
  const [showDropdown, toggleDropdown, setShowDropdown] = useToggle(false);
  const [filter, setFilter] = useState('');

  const onPhonesChange = (v) => updateFieldWithKey('phones', { value: v.map((obj) => obj.value) });
  const onMobilesChange = (v) =>
    updateFieldWithKey('mobiles', { value: v.map((obj) => obj.value) });

  const NoOptionsMessage = () => (
    <h6 className="text-center pt-2">{t('common.type_for_options')}</h6>
  );

  const columns = [
    { key: 'created', label: t('common.created'), _style: { width: '20%' }, filter: false },
    { key: 'name', label: t('user.name'), _style: { width: '25%' }, filter: false },
    { key: 'description', label: t('user.description'), _style: { width: '50%' } },
    { key: 'actions', label: '', _style: { width: '15%' }, filter: false },
  ];

  const selectEntity = ({ id, name }) => {
    batchSetField([
      { id: 'entity', value: id },
      { id: 'entityName', value: name },
    ]);
    toggleDropdown();
  };

  useEffect(() => {
    if (!editing) setShowDropdown(false);
  }, [editing]);

  return (
    <CForm>
      <CRow>
        <CLabel className="mb-2" sm="2" col htmlFor="name">
          {t('contact.identifier')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
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
        <CLabel sm="2" col htmlFor="description">
          {t('user.description')}
        </CLabel>
        <CCol sm="4">
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
        <CLabel className="mb-2" sm="2" col htmlFor="type">
          {t('contact.type')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <div style={{ width: '200px' }}>
            <Select
              id="type"
              value={
                fields.type.value !== ''
                  ? { value: fields.type.value, label: fields.type.value }
                  : null
              }
              onChange={(v) => updateFieldWithKey('type', { value: v.value })}
              options={[
                { label: 'SERVICE', value: 'SERVICE' },
                { label: 'EQUIPMENT', value: 'EQUIPMENT' },
                { label: 'AUTO', value: 'AUTO' },
                { label: 'MANUAL', value: 'MANUAL' },
                { label: 'SPECIAL', value: 'SPECIAL' },
                { label: 'UNKNOWN', value: 'UNKNOWN' },
                { label: 'CORPORATE', value: 'CORPORATE' },
              ]}
              isDisabled={disable || !editing}
            />
          </div>
          <CFormText hidden={!fields.type.error} color={fields.type.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="buildingName">
          {t('location.building_name')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="buildingName"
                type="text"
                required
                value={fields.buildingName.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.buildingName.value}</p>
          )}
        </CCol>
        <CLabel className="mb-3" sm="2" col htmlFor="phones">
          {t('location.phones')}
        </CLabel>
        <CCol sm="4">
          <CreatableSelect
            isMulti
            id="phones"
            isDisabled={disable || !editing}
            onChange={onPhonesChange}
            components={{ NoOptionsMessage }}
            options={[]}
            value={fields.phones.value.map((opt) => ({ value: opt, label: opt }))}
            placeholder="+1(202)555-0103"
          />
        </CCol>
        <CLabel className="mb-3" sm="2" col htmlFor="mobiles">
          {t('location.mobiles')}
        </CLabel>
        <CCol sm="4">
          <CreatableSelect
            id="mobiles"
            isMulti
            isDisabled={disable || !editing}
            onChange={onMobilesChange}
            components={{ NoOptionsMessage }}
            options={[]}
            value={fields.mobiles.value.map((opt) => ({ value: opt, label: opt }))}
            placeholder="+1(202)555-0103"
          />
        </CCol>
        <CCol className="mb-3" sm="12">
          <CRow>
            <CCol sm="6">{locationSearch}</CCol>
          </CRow>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="addressLines">
          {t('location.street_address')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="addressLines"
                type="text"
                required
                value={fields.addressLines.value[0]}
                onChange={(e) =>
                  updateFieldWithKey('addressLines', { value: [e.target.value], error: false })
                }
                disabled={disable}
                invalid={fields.addressLines.error}
                maxLength="50"
              />
              <CFormText
                hidden={!fields.addressLines.error}
                color={fields.addressLines.error ? 'danger' : ''}
              >
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.addressLines.value[0]}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="country">
          {t('location.country')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <div>
            <Select
              id="country"
              value={{
                value: fields.country.value,
                label:
                  fields.country.value === ''
                    ? 'None'
                    : COUNTRY_LIST.find((c) => c.value === fields.country.value).label,
              }}
              onChange={(v) => updateFieldWithKey('country', { value: v.value })}
              options={COUNTRY_LIST}
              isDisabled={disable || !editing}
            />
            <CFormText hidden={!fields.country.error} color={fields.country.error ? 'danger' : ''}>
              {t('common.required')}
            </CFormText>
          </div>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="city">
          {t('location.city')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="city"
                type="text"
                required
                value={fields.city.value}
                onChange={updateField}
                invalid={fields.city.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText hidden={!fields.city.error} color={fields.city.error ? 'danger' : ''}>
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.city.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="state">
          {t('location.state')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="state"
                type="text"
                required
                value={fields.state.value}
                onChange={updateField}
                invalid={fields.state.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText hidden={!fields.state.error} color={fields.state.error ? 'danger' : ''}>
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.state.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="postal">
          {t('location.postal')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="postal"
                type="text"
                required
                value={fields.postal.value}
                onChange={updateField}
                invalid={fields.postal.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText hidden={!fields.postal.error} color={fields.postal.error ? 'danger' : ''}>
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.postal.value}</p>
          )}
        </CCol>
        <CLabel sm="2" col htmlFor="geoCode">
          {t('location.geocode')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="geoCode"
                type="text"
                required
                value={fields.geoCode.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.geoCode.value}</p>
          )}
        </CCol>
      </CRow>
      <CFormGroup row className="pt-2 pb-1">
        <CLabel sm="2" col htmlFor="title">
          {t('entity.entity')}
        </CLabel>
        <CCol sm="4">
          <CButton className="pl-0" color="link" onClick={toggleDropdown} disabled={!editing}>
            {fields.entity.value === '' ? t('entity.need_select_entity') : fields.entityName.value}
          </CButton>
        </CCol>
      </CFormGroup>
      <CCollapse show={showDropdown}>
        <div className="overflow-auto border mb-1" style={{ height: '200px' }}>
          <CInput
            className="w-50 mb-2"
            type="text"
            placeholder="Search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <CDataTable
            items={entities}
            fields={columns}
            hover
            tableFilterValue={filter}
            border
            scopedSlots={{
              name: (item) => (
                <td className="align-middle p-1">
                  <CLink
                    className="c-subheader-nav-link"
                    aria-current="page"
                    to={() => `/configuration/${item.id}`}
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
                      disabled={!editing}
                      size="sm"
                      color="primary"
                      variant="outline"
                      onClick={() => selectEntity(item)}
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
    </CForm>
  );
};

EditLocationForm.propTypes = {
  t: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldWithKey: PropTypes.func.isRequired,
  entities: PropTypes.instanceOf(Array).isRequired,
  locationSearch: PropTypes.node.isRequired,
  batchSetField: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

export default EditLocationForm;
