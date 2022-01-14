import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CDataTable, CButton, CPopover } from '@coreui/react';
import { cilZoomIn } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';

const parseDbm = (value) => {
  if (!value) return '-';
  if (value > -150 && value < 100) return value;
  return (4294967295 - value) * -1;
};

const getConnection = (t, data) => {
  if (data.extraData.connectionInfo) {
    return data.extraData.connectionInfo.connected
      ? t('common.connected')
      : t('common.not_connected');
  }
  return 'N/A';
};

const getHealth = (t, data) => {
  if (data.extraData.healthCheckInfo && data.extraData.healthCheckInfo.recorded > 0) {
    return `${data.extraData.healthCheckInfo.sanity}%`;
  }
  return 'N/A';
};

const parseAssoc = (data) => {
  const associations = [];

  if (!data.extraData.statsInfo) return null;

  for (const deviceInterface of data.extraData.statsInfo?.interfaces ?? []) {
    if ('counters' in deviceInterface && 'ssids' in deviceInterface) {
      for (const ssid of deviceInterface.ssids) {
        // Information common between all associations
        const radioInfo = {
          found: false,
        };

        if (ssid.phy !== undefined) {
          radioInfo.radio = data.extraData.statsInfo.radios.findIndex(
            (element) => element.phy === ssid.phy,
          );
          radioInfo.found = radioInfo.radio !== undefined;
          radioInfo.radioIndex = radioInfo.radio;
          radioInfo.type =
            data.extraData.statsInfo.radios[radioInfo.radio].channel < 16 ? '2G' : '5G';
        }

        if (!radioInfo.found && ssid.radio !== undefined) {
          const radioArray = ssid.radio.$ref.split('/');
          const radioIndex = radioArray !== undefined ? radioArray[radioArray.length - 1] : '-';
          radioInfo.found = data.extraData.statsInfo.radios[radioIndex] !== undefined;
          radioInfo.radio = radioIndex;
          radioInfo.radioIndex = radioIndex;
        }

        if (!radioInfo.found) {
          radioInfo.radio = '-';
        }

        // console.log(radioInfo);

        if ('associations' in ssid) {
          for (const association of ssid.associations) {
            const assoc = {
              radio: radioInfo,
              bssid: association.bssid,
              ssid: ssid.ssid,
              rssi: association.rssi ? parseDbm(association.rssi) : '-',
            };
            associations.push(assoc);
          }
        }
      }
    }
  }
  return associations;
};

const DeviceTooltip = ({ data }) => {
  const { t } = useTranslation();
  const [associations] = useState(parseAssoc(data));
  const [gwUi] = useState(localStorage.getItem('owgw-ui'));

  const columns = [
    { key: 'radio', label: 'R', _style: { width: '1%' } },
    { key: 'bssid', label: 'BSSID', _style: { width: '1%' } },
    { key: 'ssid', label: 'SSID' },
    { key: 'rssi', label: 'RSSI', _style: { width: '1%' } },
  ];

  const getAssociations = () => {
    if (!associations) return null;

    return associations.length === 0 ? (
      <h6 className="mt-2">No Associations</h6>
    ) : (
      <>
        <h6 className="mt-2">Associations</h6>
        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
          <CDataTable
            style={{ width: '500px' }}
            addTableClasses="table-sm"
            items={associations}
            fields={columns}
            hover
            border
            noItemsViewSlot={<h5>No Associations</h5>}
            scopedSlots={{
              radio: (item) => <td className="align-middle p-1">{item.radio.type}</td>,
              bssid: (item) => <td className="align-middle p-1">{item.bssid}</td>,
              ssid: (item) => <td className="align-middle p-1">{item.ssid}</td>,
              rssi: (item) => <td className="align-middle p-1">{item.rssi}</td>,
            }}
          />
        </div>
      </>
    );
  };

  return (
    <ReactTooltip
      className={`map-tooltip ${associations?.length > 0 ? 'device-tooltip' : ''}`}
      id={data.tooltipId}
      effect="solid"
      globalEventOff="click"
      clickable
      border
      arrowColor="white"
      delayHide={100}
    >
      <div>
        <h5 className="mb-1">
          <u>
            {data.entityName}
            {data.extraData?.deviceInfo?.deviceType
              ? `, ${data.extraData?.deviceInfo?.deviceType}`
              : ''}
          </u>
          <CPopover content={t('inventory.view_in_gateway')}>
            <CButton
              color="primary"
              variant="outline"
              shape="square"
              size="sm"
              className="ml-2"
              onClick={() => window.open(`${gwUi}/#/devices/${data.entityName}`, '_blank')}
              disabled={!gwUi || gwUi === ''}
              style={{ width: '33px', height: '30px' }}
            >
              <CIcon content={cilZoomIn} />
            </CButton>
          </CPopover>
        </h5>
        {data.extraData.tagInfo && data.extraData.tagInfo.description.trim().length > 0 ? (
          <h6 className="font-italic">{data.extraData.tagInfo?.description}</h6>
        ) : null}
        <CRow>
          <CCol>
            {t('common.status')}: {getConnection(t, data)}
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            {t('health.title')}: {getHealth(t, data)}
          </CCol>
        </CRow>
        {getAssociations()}
      </div>
    </ReactTooltip>
  );
};

DeviceTooltip.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(DeviceTooltip);
