import React from 'react';
import { CRow, CCol, CButton, CPopover, CFormGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import { ConfigurationStringField, ConfigurationElement } from 'ucentral-libs';
import General from '../General';

const Globals = ({
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Globals Section</h5>
          <div className="float-right">
            <CPopover content={t('common.delete')}>
              <CButton
                color="primary"
                variant="outline"
                onClick={deleteConfig}
                className="ml-1"
                disabled={disabled}
              >
                <CIcon name="cil-trash" content={cilTrash} />
              </CButton>
            </CPopover>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <General fields={baseFields} updateWithId={updateBaseWithId} disabled={disabled} />
        </CCol>
      </CRow>
      <CRow>
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
                        disabled={disabled}
                      />
                      <ConfigurationStringField
                        id="ipv6-network"
                        label="ipv6-network"
                        field={fields['ipv6-network']}
                        updateField={updateWithId}
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        disabled={disabled}
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
  deleteConfig: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Globals;
