import React from 'react';
import { CRow, CCol, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import Statistics from './Statistics';
import Health from './Health';
import WifiFrames from './WifiFrames';
import DhcpSnooping from './DhcpSnooping';
import General from '../General';

const Metrics = ({
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
  disabled,
}) => {
  const { t } = useTranslation();

  const onSubChange = (v) => {
    for (const [key, field] of Object.entries(fields)) {
      if (key !== 'enabled') {
        const foundIndex = v.findIndex((i) => i.value === key);
        const found = foundIndex >= 0;
        if (field.enabled !== found) updateField(key, { enabled: found });
      }
    }
  };

  return (
    <div className="px-4">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Metrics Section</h5>
          <div className="float-right">
            <CPopover content={t('common.delete')}>
              <CButton
                color="primary"
                variant="outline"
                onClick={deleteConfig}
                className="ml-1"
                disabled={disabled}
              >
                <CIcon content={cilTrash} />
              </CButton>
            </CPopover>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <General
            fields={baseFields}
            updateWithId={updateBaseWithId}
            subFields={fields}
            onSubChange={onSubChange}
            disabled={disabled}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xl="6" xxl="4" hidden={!fields.statistics.enabled}>
          <Statistics
            fields={fields}
            updateWithId={updateWithId}
            updateField={updateField}
            disabled={disabled}
          />
        </CCol>
        <CCol xl="6" xxl="4" hidden={!fields['dhcp-snooping'].enabled}>
          <DhcpSnooping fields={fields} updateField={updateField} disabled={disabled} />
        </CCol>
        <CCol xl="6" xxl="4" hidden={!fields.health.enabled}>
          <Health
            fields={fields}
            updateWithId={updateWithId}
            updateField={updateField}
            disabled={disabled}
          />
        </CCol>
        <CCol xl="6" xxl="4" hidden={!fields['wifi-frames'].enabled}>
          <WifiFrames fields={fields} updateField={updateField} disabled={disabled} />
        </CCol>
      </CRow>
    </div>
  );
};

Metrics.propTypes = {
  deleteConfig: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Metrics;
