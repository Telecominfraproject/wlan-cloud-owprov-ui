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
import { FormattedDate, RequiredAsterisk, SELECT_STYLES, useToggle } from 'ucentral-libs';

const EditContactForm = ({
  t,
  disable,
  fields,
  updateField,
  updateFieldWithKey,
  entities,
  batchSetField,
  hideEntities,
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
        <CLabel className="mb-2" sm="2" col htmlFor="type">
          {t('contact.type')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          <div style={{ width: '200px' }}>
            <Select
              id="type"
              styles={SELECT_STYLES}
              value={
                fields.type.value !== ''
                  ? { value: fields.type.value, label: fields.type.value }
                  : null
              }
              onChange={(v) => updateFieldWithKey('type', { value: v.value })}
              options={[
                { label: 'SUBSCRIBER', value: 'SUBSCRIBER' },
                { label: 'USER', value: 'USER' },
                { label: 'INSTALLER', value: 'INSTALLER' },
                { label: 'CSR', value: 'CSR' },
                { label: 'MANAGER', value: 'MANAGER' },
                { label: 'BUSINESSOWNER', value: 'BUSINESSOWNER' },
                { label: 'TECHNICIAN', value: 'TECHNICIAN' },
                { label: 'CORPORATE', value: 'CORPORATE' },
              ]}
              isDisabled={disable || !editing}
            />
          </div>
          <CFormText hidden={!fields.type.error} color={fields.type.error ? 'danger' : ''}>
            {t('common.required')}
          </CFormText>
        </CCol>
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
        <CLabel className="mb-2" sm="2" col htmlFor="title">
          {t('contact.user_title')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="title"
                type="text"
                required
                value={fields.title.value}
                onChange={updateField}
                invalid={fields.title.error}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.title.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="salutation">
          {t('contact.salutation')}
        </CLabel>
        <CCol sm="4">
          <div style={{ width: '120px' }}>
            <Select
              id="salutation"
              styles={SELECT_STYLES}
              value={{
                value: fields.salutation.value,
                label: fields.salutation.value === '' ? 'None' : fields.salutation.value,
              }}
              onChange={(v) => updateFieldWithKey('salutation', { value: v.value })}
              options={[
                { label: 'None', value: '' },
                { label: 'Mr.', value: 'Mr.' },
                { label: 'Ms.', value: 'Ms.' },
                { label: 'Mx.', value: 'Mx.' },
                { label: 'Dr.', value: 'Dr.' },
              ]}
              isDisabled={disable || !editing}
            />
          </div>
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="firstname">
          {t('contact.first_name')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="firstname"
                type="text"
                required
                value={fields.firstname.value}
                onChange={updateField}
                invalid={fields.firstname.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText
                hidden={!fields.firstname.error}
                color={fields.firstname.error ? 'danger' : ''}
              >
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.firstname.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="lastname">
          {t('contact.last_name')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="lastname"
                type="text"
                required
                value={fields.lastname.value}
                onChange={updateField}
                invalid={fields.lastname.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText
                hidden={!fields.lastname.error}
                color={fields.lastname.error ? 'danger' : ''}
              >
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.lastname.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="initials">
          {t('contact.initials')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="initials"
                type="text"
                required
                value={fields.initials.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.initials.value}</p>
          )}
        </CCol>
        <CLabel sm="2" col htmlFor="visual">
          {t('contact.visual')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="visual"
                type="text"
                required
                value={fields.visual.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.visual.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="primaryEmail">
          {t('contact.primary_email')}
          <RequiredAsterisk />
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="primaryEmail"
                type="text"
                required
                value={fields.primaryEmail.value}
                onChange={updateField}
                invalid={fields.primaryEmail.error}
                disabled={disable}
                maxLength="50"
              />
              <CFormText
                hidden={!fields.primaryEmail.error}
                color={fields.primaryEmail.error ? 'danger' : ''}
              >
                {t('common.required')}
              </CFormText>
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.primaryEmail.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="secondaryEmail">
          {t('contact.secondary_email')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="secondaryEmail"
                type="text"
                required
                value={fields.secondaryEmail.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.secondaryEmail.value}</p>
          )}
        </CCol>
        <CLabel className="mb-2" sm="2" col htmlFor="accessPIN">
          {t('contact.access_pin')}
        </CLabel>
        <CCol sm="4">
          {editing ? (
            <div>
              <CInput
                id="accessPIN"
                type="text"
                required
                value={fields.accessPIN.value}
                onChange={updateField}
                disabled={disable}
                maxLength="50"
              />
            </div>
          ) : (
            <p className="mt-2 mb-0">{fields.accessPIN.value}</p>
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
        <CLabel className="mb-2" sm="2" col htmlFor="phones">
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
        <CLabel className="mb-2" sm="2" col htmlFor="phones">
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
      </CRow>
      <CFormGroup row className="pb-1">
        <CLabel sm="2" col htmlFor="title">
          {t('entity.entity')}
        </CLabel>
        <CCol sm="4">
          <CButton className="pl-0" color="link" onClick={toggleDropdown} disabled={!editing}>
            {fields.entity.value === '' ? t('entity.need_select_entity') : fields.entityName.value}
          </CButton>
        </CCol>
      </CFormGroup>
      {hideEntities ? null : (
        <CCollapse show={showDropdown}>
          <div className="overflow-auto border mb-3" style={{ height: '200px' }}>
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
          </div>
        </CCollapse>
      )}
    </CForm>
  );
};

EditContactForm.propTypes = {
  t: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldWithKey: PropTypes.func.isRequired,
  entities: PropTypes.instanceOf(Array).isRequired,
  batchSetField: PropTypes.func.isRequired,
  hideEntities: PropTypes.bool,
  editing: PropTypes.bool.isRequired,
};

EditContactForm.defaultProps = {
  hideEntities: false,
};

export default EditContactForm;
