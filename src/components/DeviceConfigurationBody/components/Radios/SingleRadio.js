import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CButtonClose } from '@coreui/react';
import {
  ConfigurationElement,
  ConfigurationStringField,
  ConfigurationSelect,
  ConfigurationIntField,
  ConfigurationToggle,
} from 'ucentral-libs';
import ChannelPicker from './ChannelPicker';
import ChannelWidth from './ChannelWidth';

const SingleRadio = ({ fields, updateWithId, updateField, deleteRadio, index }) => {
  const [idStart] = useState(`radios[${index}]`);

  return (
    <div>
      <CRow>
        <CCol>
          <ConfigurationElement
            header={
              <div className="py-1 pb-0 mb-0">
                <h6 className="mt-1 float-left">{`${index} (${fields.radios[index].band.value})`}</h6>
                <div className="text-right">
                  <CButtonClose onClick={() => deleteRadio(index)} style={{ color: 'white' }} />
                </div>
              </div>
            }
            enabled
          >
            <CRow>
              <CCol xl="6" xxl="4">
                <ConfigurationSelect
                  id={`${idStart}.band`}
                  label="band"
                  field={fields.radios[index].band}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled
                  width="120px"
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ChannelPicker
                  id={`${idStart}.channel`}
                  label="channel"
                  field={fields.radios[index].channel}
                  updateField={updateField}
                  band={fields.radios[index].band.value}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ChannelWidth
                  id={`${idStart}.channel-width`}
                  label="channel-width"
                  field={fields.radios[index]['channel-width']}
                  updateField={updateField}
                  band={fields.radios[index].band.value}
                  channel={fields.radios[index].channel.value}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationSelect
                  id={`${idStart}.bandwidth`}
                  label="bandwidth"
                  field={fields.radios[index].bandwidth}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  width="100px"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationStringField
                  id={`${idStart}.country`}
                  label="country"
                  field={fields.radios[index].country}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Required"
                  width="100px"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationSelect
                  id={`${idStart}.channel-mode`}
                  label="channel-mode"
                  field={fields.radios[index]['channel-mode']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  width="250px"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationSelect
                  id={`${idStart}.require-mode`}
                  label="require-mode"
                  field={fields.radios[index]['require-mode']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  width="250px"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationSelect
                  id={`${idStart}.mimo`}
                  label="mimo"
                  field={fields.radios[index].mimo}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  width="100px"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationIntField
                  id={`${idStart}.tx-power`}
                  label="tx-power"
                  field={fields.radios[index]['tx-power']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationToggle
                  id={`${idStart}.legacy-rates`}
                  label="legacy-rates"
                  field={fields.radios[index]['legacy-rates']}
                  updateField={updateField}
                  firstCol="3"
                  secondCol="9"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationIntField
                  id={`${idStart}.beacon-interval`}
                  label="beacon-interval"
                  field={fields.radios[index]['beacon-interval']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationIntField
                  id={`${idStart}.dtim-period`}
                  label="dtim-period"
                  field={fields.radios[index]['dtim-period']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationIntField
                  id={`${idStart}.maximum-clients`}
                  label="maximum-clients"
                  field={fields.radios[index]['maximum-clients']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Error!!!!"
                  disabled={false}
                />
              </CCol>
              <CCol xl="6" xxl="4">
                <ConfigurationStringField
                  id={`${idStart}.hostapd-iface-raw`}
                  label="hostapd-iface-raw"
                  field={fields.radios[index]['hostapd-iface-raw']}
                  updateField={updateWithId}
                  firstCol="3"
                  secondCol="9"
                  errorMessage="Required"
                  disabled={false}
                />
              </CCol>
            </CRow>
            {fields.radios[index].rates.enabled ? (
              <div>
                <h5>Rates</h5>
                <CRow>
                  <CCol xl="6" xxl="4">
                    <ConfigurationSelect
                      id={`${idStart}.rates.beacon`}
                      label="beacon"
                      field={fields.radios[index].rates.beacon}
                      updateField={updateField}
                      firstCol="3"
                      secondCol="9"
                      width="100px"
                      disabled={false}
                    />
                  </CCol>
                  <CCol xl="6" xxl="4">
                    <ConfigurationSelect
                      id={`${idStart}.rates.multicast`}
                      label="multicast"
                      field={fields.radios[index].rates.multicast}
                      updateField={updateField}
                      firstCol="3"
                      secondCol="9"
                      width="100px"
                      disabled={false}
                    />
                  </CCol>
                </CRow>
              </div>
            ) : null}
            {fields.radios[index]['channel-mode'].value === 'HE' ? (
              <div>
                <h5>HE Options</h5>
                <CRow>
                  <CCol xl="6" xxl="4">
                    <ConfigurationToggle
                      id={`${idStart}.he.multiple-bssid`}
                      label="multiple-bssid"
                      field={fields.radios[index].he['multiple-bssid']}
                      updateField={updateField}
                      firstCol="3"
                      secondCol="9"
                      disabled={false}
                    />
                  </CCol>
                  <CCol xl="6" xxl="4">
                    <ConfigurationToggle
                      id={`${idStart}.he.ema`}
                      label="ema"
                      field={fields.radios[index].he.ema}
                      updateField={updateField}
                      firstCol="3"
                      secondCol="9"
                      disabled={false}
                    />
                  </CCol>
                  <CCol xl="6" xxl="4">
                    <ConfigurationIntField
                      id={`${idStart}.he.bss-color`}
                      label="bss-color"
                      field={fields.radios[index].he['bss-color']}
                      updateField={updateWithId}
                      firstCol="3"
                      secondCol="9"
                      errorMessage="Error!!!!"
                      disabled={false}
                    />
                  </CCol>
                </CRow>
              </div>
            ) : null}
          </ConfigurationElement>
        </CCol>
      </CRow>
    </div>
  );
};

SingleRadio.propTypes = {
  fields: PropTypes.instanceOf(Object).isRequired,
  updateWithId: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  deleteRadio: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default SingleRadio;
