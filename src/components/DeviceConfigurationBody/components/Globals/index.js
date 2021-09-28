import React from 'react';
import { CRow, CCol, CButtonToolbar, CButton, CPopover, CFormGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilSave, cilSync, cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import { ConfigurationStringField, ConfigurationElement } from 'ucentral-libs';
import General from '../General';

const Globals = ({
  creating,
  save,
  refresh,
  canSave,
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
}) => {
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Globals Section</h5>
          <div className="float-right">
            <CButtonToolbar
              role="group"
              className="justify-content-center"
              style={{ width: '150px' }}
            >
              <CPopover content={t('common.save')}>
                <CButton color="light" onClick={save} className="mx-1" disabled={!canSave}>
                  <CIcon name="cil-save" content={cilSave} />
                </CButton>
              </CPopover>
              {'  '}
              <CPopover content={creating ? t('factory_reset.reset') : t('common.delete')}>
                <CButton color="light" onClick={deleteConfig} className="mx-1" disabled={creating}>
                  <CIcon name="cil-trash" content={cilTrash} />
                </CButton>
              </CPopover>
              {'  '}
              <CPopover content={t('common.refresh')}>
                <CButton disabled={creating} color="light" onClick={refresh} className="mx-1">
                  <CIcon content={cilSync} />
                </CButton>
              </CPopover>
            </CButtonToolbar>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol xl="6" xxl="4">
          <General fields={baseFields} updateWithId={updateBaseWithId} />
        </CCol>
        <CCol xl="6" xxl="4">
          <div>
            <CRow>
              <CCol>
                <ConfigurationElement
                  header={
                    <CFormGroup row className="py-1 pb-0 mb-0">
                      <h6 className="mt-1 pr-5">Globals</h6>
                    </CFormGroup>
                  }
                  enabled
                >
                  <CRow>
                    <CCol>
                      <ConfigurationStringField
                        id="ipv4-network"
                        label="ipv4-network"
                        field={fields['ipv4-network']}
                        updateField={updateWithId}
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationStringField
                        id="ipv6-network"
                        label="ipv6-network"
                        field={fields['ipv6-network']}
                        updateField={updateWithId}
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                    </CCol>
                  </CRow>
                </ConfigurationElement>
              </CCol>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

Globals.propTypes = {
  creating: PropTypes.bool,
  save: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  canSave: PropTypes.bool.isRequired,
  deleteConfig: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
};

Globals.defaultProps = {
  creating: false,
};

export default Globals;
