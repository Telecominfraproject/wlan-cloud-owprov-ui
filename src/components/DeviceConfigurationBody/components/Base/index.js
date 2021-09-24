import React from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CButtonToolbar, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilSync, cilTrash } from '@coreui/icons';
import { ConfigurationStringField, ConfigurationIntField } from 'ucentral-libs';
import { useTranslation } from 'react-i18next';

const Base = ({ creating, fields, updateWithId, save, refresh, canSave, deleteConfig }) => {
  const { t } = useTranslation();

  return (
    <div className="border-bottom mb-2">
      <CRow className="pb-3">
        <CCol>
          <h5 className="float-left pt-2">General Information</h5>
          <div className="float-right">
            <CButtonToolbar
              role="group"
              className="justify-content-center"
              style={{ width: '150px' }}
            >
              <CPopover content={t('common.save')}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={save}
                  className="mx-1"
                  disabled={!canSave}
                >
                  <CIcon name="cil-save" content={cilSave} />
                </CButton>
              </CPopover>
              {'  '}
              <CPopover content={creating ? t('factory_reset.reset') : t('common.delete')}>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={deleteConfig}
                  className="mx-1"
                  disabled={creating}
                >
                  <CIcon name="cil-trash" content={cilTrash} />
                </CButton>
              </CPopover>
              {'  '}
              <CPopover content={t('common.refresh')}>
                <CButton
                  disabled={creating}
                  color="primary"
                  variant="outline"
                  onClick={refresh}
                  className="mx-1"
                >
                  <CIcon content={cilSync} />
                </CButton>
              </CPopover>
            </CButtonToolbar>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <ConfigurationStringField
            id="name"
            label="name"
            field={fields.name}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Required"
            disabled={false}
          />
        </CCol>
        <CCol>
          <ConfigurationStringField
            id="description"
            label="description"
            field={fields.description}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Error!!!!"
            disabled={false}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">
          <ConfigurationIntField
            id="weight"
            label="weight"
            field={fields.weight}
            updateField={updateWithId}
            firstCol="3"
            secondCol="9"
            errorMessage="Error!!!!"
            disabled={false}
          />
        </CCol>
        <CCol />
      </CRow>
    </div>
  );
};

Base.propTypes = {
  creating: PropTypes.bool,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  canSave: PropTypes.bool.isRequired,
  deleteConfig: PropTypes.func.isRequired,
};

Base.defaultProps = {
  creating: false,
};

export default Base;
