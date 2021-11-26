import React from 'react';
import { CForm, CInput, CLabel, CCol, CInvalidFeedback, CRow, CButton, CLink } from '@coreui/react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FormattedDate, SELECT_STYLES } from 'ucentral-libs';

const EditEntityForm = ({
  t,
  disable,
  fields,
  updateField,
  updateFieldDirectly,
  editing,
  toggleAssociate,
  toggleContact,
  toggleIpModal,
  toggleLocation,
}) => (
  <CForm>
    <CRow>
      <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
        <div>{t('user.name')}:</div>
      </CLabel>
      <CCol md="7" lg="4" xl="4" xxl="5">
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
            <CInvalidFeedback>{t('common.required')}</CInvalidFeedback>
          </div>
        ) : (
          <p className="mt-2 mb-0">{fields.name.value}</p>
        )}
      </CCol>
      <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
        <div>{t('user.description')}:</div>
      </CLabel>
      <CCol md="7" lg="4" xl="4" xxl="5">
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
      <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
        <div>RRM:</div>
      </CLabel>
      <CCol md="7" lg="4" xl="4" xxl="5">
        <div style={{ width: '120px' }}>
          <Select
            id="rrm"
            styles={SELECT_STYLES}
            value={{ value: fields.rrm.value, label: fields.rrm.value }}
            onChange={(v) => updateFieldDirectly('rrm', { value: v.value })}
            options={[
              { label: 'on', value: 'on' },
              { label: 'off', value: 'off' },
              { label: 'inherit', value: 'inherit' },
            ]}
            isDisabled={!editing}
          />
        </div>
      </CCol>
      <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
        <div>{t('common.created')}:</div>
      </CLabel>
      <CCol md="7" lg="4" xl="4" xxl="5">
        <div className="mt-2 mb-0">
          <FormattedDate date={fields.created.value} />
        </div>
      </CCol>
      <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="sourceIp">
        <div>{t('entity.ip_detection')}:</div>
      </CLabel>
      <CCol md="7" lg="4" xl="4" xxl="5">
        {editing ? (
          <CButton className="pl-0 text-left" color="link" onClick={toggleIpModal}>
            {fields.sourceIP.value.length === 0
              ? t('entity.add_ips')
              : fields.sourceIP.value.join(', ')}
          </CButton>
        ) : (
          <div className="mt-2 mb-0">
            <p className="mb-0">
              {fields.sourceIP.value.length === 0
                ? t('entity.no_ips')
                : fields.sourceIP.value.join(', ')}
            </p>
          </div>
        )}
      </CCol>
      <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
        <div>{t('common.modified')}:</div>
      </CLabel>
      <CCol md="7" lg="4" xl="4" xxl="5">
        <div className="mt-2 mb-0">
          <FormattedDate date={fields.modified.value} />
        </div>
      </CCol>
      {fields.contact ? (
        <>
          <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
            <div>{t('contact.title')}:</div>
          </CLabel>
          <CCol md="7" lg="4" xl="4" xxl="5">
            {editing ? (
              <CButton className="pl-0 text-left" color="link" onClick={toggleContact}>
                {fields.contact.value === '' ? t('contact.add_contact') : fields.contact.value}
              </CButton>
            ) : (
              <div className="mt-2 mb-0">
                {fields.contact.uuid === '' ? (
                  <p className="mb-0">{t('contact.no_associated_contact')}</p>
                ) : (
                  <CLink
                    className="c-subheader-nav-link"
                    aria-current="page"
                    to={() => `/contacts`}
                  >
                    {fields.contact.value}
                  </CLink>
                )}
              </div>
            )}
          </CCol>
        </>
      ) : null}
      {fields.location ? (
        <>
          <CLabel className="mb-2" md="5" lg="2" xl="2" xxl="1" col htmlFor="name">
            <div>{t('location.title')}:</div>
          </CLabel>
          <CCol md="7" lg="4" xl="4" xxl="5">
            {editing ? (
              <CButton className="pl-0 text-left" color="link" onClick={toggleLocation}>
                {fields.location.value === '' ? t('location.add') : fields.location.value}
              </CButton>
            ) : (
              <div className="mt-2 mb-0">
                {fields.location.uuid === '' ? (
                  <p className="mb-0">{t('location.no_associated')}</p>
                ) : (
                  <CLink
                    className="c-subheader-nav-link"
                    aria-current="page"
                    to={() => `/location`}
                  >
                    {fields.location.value}
                  </CLink>
                )}
              </div>
            )}
          </CCol>
        </>
      ) : null}
      <CLabel className="mb-2" sm="2" col htmlFor="name">
        <div>{t('configuration.configurations')}:</div>
      </CLabel>
      <CCol sm="10">
        {editing ? (
          <CButton className="pl-0 text-left" color="link" onClick={toggleAssociate}>
            {fields.deviceConfiguration.value.length === 0
              ? t('configuration.add_configuration')
              : fields.deviceConfiguration.value.map((c) => c.name).join(', ')}
          </CButton>
        ) : (
          <div className="mt-2 mb-0">
            {fields.deviceConfiguration.value.length === 0 ? (
              <p className="mb-0">{t('configuration.no_associated_config')}</p>
            ) : (
              <p className="mb-0">
                {' '}
                {fields.deviceConfiguration.value.map((c) => c.name).join(', ')}
              </p>
            )}
          </div>
        )}
      </CCol>
    </CRow>
  </CForm>
);

EditEntityForm.propTypes = {
  t: PropTypes.func.isRequired,
  disable: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateField: PropTypes.func.isRequired,
  updateFieldDirectly: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  toggleAssociate: PropTypes.func.isRequired,
  toggleContact: PropTypes.func,
  toggleIpModal: PropTypes.func.isRequired,
  toggleLocation: PropTypes.func,
};

EditEntityForm.defaultProps = {
  toggleContact: null,
  toggleLocation: null,
};
export default EditEntityForm;
