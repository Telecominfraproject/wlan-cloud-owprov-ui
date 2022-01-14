import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CDataTable, CPopover, CButton, CAlert } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import DeviceSearchBar from 'components/DeviceSearchBar';
import { useAuth } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import InventoryTable from 'components/InventoryTable';

const SubscriberInventory = ({ serialNumbers, setSerialNumbers, loading, editable }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const [deviceError, setDeviceError] = useState(null);

  const columns = [
    { key: 'serialNumber', label: t('common.serial_number'), _style: { width: '1%' } },
    { key: 'entity' },
    { key: 'venue' },
    { key: 'actions', label: '', _style: { width: '1%' } },
  ];

  const removeSerial = (id) => {
    const newSerials = serialNumbers.filter((device) => device.id !== id);
    setSerialNumbers([...newSerials]);
  };

  const addSerial = (id) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/inventory/${id}?withExtendedInfo=true`, options)
      .then((response) => {
        if (response.data.subscriber === '') {
          setDeviceError(null);
          const newSerials = serialNumbers;
          newSerials.push(response.data);
          setSerialNumbers([...newSerials]);
        } else {
          setDeviceError({
            serialNumber: id,
            subscriber: response.data.subscriber,
            name: response.data.extendedInfo.subscriber.name,
          });
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <div style={{ height: '200px' }} className="overflow-auto">
        <CDataTable
          addTableClasses="table-sm"
          items={serialNumbers}
          fields={editable ? columns : columns.filter((col) => col.key !== 'actions')}
          hover
          border
          loading={loading}
          scopedSlots={{
            serialNumber: (item) => (
              <td className="align-middle text-monospace">{item.serialNumber}</td>
            ),
            entity: (item) => (
              <td className="align-middle">{item.extendedInfo?.entity?.name ?? item.entity}</td>
            ),
            venue: (item) => (
              <td className="align-middle">{item.extendedInfo?.venue?.name ?? item.venue}</td>
            ),
            actions: (item) => (
              <td className="text-center align-middle py-0">
                <CPopover content={t('common.remove_claim')}>
                  <CButton
                    disabled={!editable}
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mx-1"
                    onClick={() => removeSerial(item.id)}
                    style={{ width: '33px', height: '30px' }}
                  >
                    <CIcon content={cilTrash} />
                  </CButton>
                </CPopover>
              </td>
            ),
          }}
        />
      </div>
      {editable && (
        <>
          <p className="font-weight-bold">{t('subscriber.add_device_subscriber_explanation')}</p>
          {deviceError && (
            <CAlert color="danger">
              {t('common.error')}: {`#${deviceError.serialNumber} `}{' '}
              {t('subscriber.is_already_claimed')} {deviceError.name}
            </CAlert>
          )}
          <div style={{ width: '200px', marginBottom: '20px' }}>
            <DeviceSearchBar toggleEditModal={addSerial} />
          </div>
          <InventoryTable
            entityPage={false}
            refreshId={0}
            useUrl={false}
            hideTopBar
            hideSearch
            claimedSerials={serialNumbers.map((device) => device.serialNumber)}
            claim={addSerial}
          />
        </>
      )}
    </>
  );
};

SubscriberInventory.propTypes = {
  serialNumbers: PropTypes.instanceOf(Array).isRequired,
  setSerialNumbers: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
};
export default SubscriberInventory;
