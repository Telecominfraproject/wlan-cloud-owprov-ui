import React from 'react';
import { CRow, CCol, CButton, CPopover, CFormGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import {
  ConfigurationStringField,
  ConfigurationElement,
  ConfigurationToggle,
  ConfigurationSelect,
} from 'ucentral-libs';
import General from '../General';

const Unit = ({
  creating,
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
}) => {
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Unit Section</h5>
          <div className="float-right">
            <CPopover content={creating ? t('factory_reset.reset') : t('common.delete')}>
              <CButton
                color="primary"
                variant="outline"
                onClick={deleteConfig}
                className="ml-1"
                disabled={creating}
              >
                <CIcon name="cil-trash" content={cilTrash} />
              </CButton>
            </CPopover>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <General fields={baseFields} updateWithId={updateBaseWithId} />
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
                      <h6 className="mt-1 pr-5">Unit</h6>
                    </CFormGroup>
                  }
                  enabled
                >
                  <CRow>
                    <CCol>
                      <ConfigurationStringField
                        id="name"
                        label="name"
                        field={fields.name}
                        updateField={updateWithId}
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationStringField
                        id="location"
                        label="location"
                        field={fields.location}
                        updateField={updateWithId}
                        firstCol="3"
                        secondCol="9"
                        errorMessage="Error!!!!"
                        disabled={false}
                      />
                      <ConfigurationSelect
                        id="timezone"
                        label="timezone"
                        field={fields.timezone}
                        updateField={updateField}
                        firstCol="3"
                        secondCol="9"
                        disabled={false}
                      />
                      <ConfigurationToggle
                        id="leds-active"
                        label="leds-active"
                        field={fields['leds-active']}
                        updateField={updateField}
                        firstCol="3"
                        secondCol="9"
                        disabled={false}
                      />
                      <ConfigurationToggle
                        id="random-password"
                        label="random-password"
                        field={fields['random-password']}
                        updateField={updateField}
                        firstCol="3"
                        secondCol="9"
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

Unit.propTypes = {
  creating: PropTypes.bool,
  deleteConfig: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

Unit.defaultProps = {
  creating: false,
};
export default Unit;
