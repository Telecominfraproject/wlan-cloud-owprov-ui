import React from 'react';
import { CRow, CCol, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useTranslation } from 'react-i18next';
import { cilTrash } from '@coreui/icons';
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
  deleteConfig,
  baseFields,
  updateBaseWithId,
  fields,
  updateWithId,
  updateField,
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
          <h5 className="float-left pt-2">Services Section</h5>
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
          <General
            fields={baseFields}
            updateWithId={updateBaseWithId}
            subFields={fields}
            onSubChange={onSubChange}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol hidden={!fields.lldp.enabled} xl="6" xxl="4">
          <LLdp fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.ssh.enabled} xl="6" xxl="4">
          <Ssh fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields['quality-of-service'].enabled} xl="6" xxl="4">
          <QualityOfService fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.rtty.enabled} xl="6" xxl="4">
          <Rtty fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.ntp.enabled} xl="6" xxl="4">
          <Ntp fields={fields} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.mdns.enabled} xl="6" xxl="4">
          <Mdns fields={fields} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.log.enabled} xl="6" xxl="4">
          <Log fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.http.enabled} xl="6" xxl="4">
          <Http fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.igmp.enabled} xl="6" xxl="4">
          <Igmp fields={fields} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields['facebook-wifi'].enabled} xl="6" xxl="4">
          <FacebookWifi fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields.ieee8021x.enabled} xl="6" xxl="4">
          <Ieee8021x fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields['online-check'].enabled} xl="6" xxl="4">
          <OnlineCheck fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields['open-flow'].enabled} xl="6" xxl="4">
          <OpenFlow fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields['wifi-steering'].enabled} xl="6" xxl="4">
          <WifiSteering fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
        <CCol hidden={!fields['airtime-policies'].enabled} xl="6" xxl="4">
          <AirtimePolicies fields={fields} updateWithId={updateWithId} updateField={updateField} />
        </CCol>
      </CRow>
    </div>
  );
};

Services.propTypes = {
  creating: PropTypes.bool,
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
