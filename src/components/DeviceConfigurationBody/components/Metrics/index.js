import React from 'react';
import { CRow, CCol, CButtonToolbar, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilSave, cilSync, cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import Statistics from './Statistics';
import Health from './Health';
import WifiFrames from './WifiFrames';
import DhcpSnooping from './DhcpSnooping';
import General from '../General';

const Metrics = ({
  creating,
  save,
  refresh,
  canSave,
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
}) => {
  const { t } = useTranslation();
  return (
    <div className="px-4" style={{ backgroundColor: '#cfe2ff' }}>
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Metrics Section</h5>
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
          <Statistics fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol xl="6" xxl="4">
          <Health fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <DhcpSnooping fields={fields} updateField={updateField} />
        </CCol>
        <CCol xl="6" xxl="4">
          <WifiFrames fields={fields} updateField={updateField} />
        </CCol>
      </CRow>
    </div>
  );
};

Metrics.propTypes = {
  creating: PropTypes.bool,
  save: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  canSave: PropTypes.bool.isRequired,
  deleteConfig: PropTypes.func.isRequired,
  baseFields: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

Metrics.defaultProps = {
  creating: false,
};

export default Metrics;
