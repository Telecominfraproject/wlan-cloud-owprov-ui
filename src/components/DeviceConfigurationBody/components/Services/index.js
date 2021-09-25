import React from 'react';
import PropTypes from 'prop-types';
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

const Services = ({ fields, updateWithId, updateField }) => (
  <div>
    <h5>Services Section</h5>
    <LLdp fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <Ssh fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <Ntp fields={fields} updateField={updateField} />
    <Mdns fields={fields} updateField={updateField} />
    <Rtty fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <Log fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <Http fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <Igmp fields={fields} updateField={updateField} />
    <Ieee8021x fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <OnlineCheck fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <OpenFlow fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <WifiSteering fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <QualityOfService fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <FacebookWifi fields={fields} updateWithId={updateWithId} updateField={updateField} />
    <AirtimePolicies fields={fields} updateWithId={updateWithId} updateField={updateField} />
  </div>
);

Services.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default Services;
