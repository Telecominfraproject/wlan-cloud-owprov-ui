import React from 'react';
import { CRow, CCol, CButtonToolbar, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilSave, cilSync, cilTrash } from '@coreui/icons';
import PropTypes from 'prop-types';
import General from '../General';
import LLdp from './Lldp';
import Mdns from './Mdns';
import Ssh from './Ssh';
import Ntp from './Ntp';
import Rtty from './Rtty';
import Log from './Log';
import Http from './Http';
import Igmp from './Igmp';
import Ieee8021x from './Ieee8021x';
import OnlineCheck from './OnlineCheck';
import OpenFlow from './OpenFlow';
import WifiSteering from './WifiSteering';
import QualityOfService from './QualityOfService';
import FacebookWifi from './FacebookWifi';
import AirtimePolicies from './AirtimePolicies';

const Services = ({
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
    <div className="px-4">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Services Section</h5>
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
          <LLdp fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <Ssh fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <Ntp fields={fields} updateField={updateField} />
          <Mdns fields={fields} updateField={updateField} />
          <QualityOfService fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol xl="6" xxl="4">
          <Rtty fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <Log fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <Http fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <Igmp fields={fields} updateField={updateField} />
          <FacebookWifi fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol xl="6" xxl="4">
          <Ieee8021x fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <OnlineCheck fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <OpenFlow fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <WifiSteering fields={fields} updateWithId={updateWithId} updateField={updateField} />
          <AirtimePolicies fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
      </CRow>
    </div>
  );
};

Services.propTypes = {
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

Services.defaultProps = {
  creating: false,
};

export default Services;
