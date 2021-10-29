import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CDataTable } from '@coreui/react';

const DeviceDeletePreviewTable = ({ devices, countToShow }) => {
  const { t } = useTranslation();

  const columns = [{ key: 'SerialNumber', label: t('common.serial_number') }];

  return (
    <CDataTable
      addTableClasses="ignore-overflow table-sm"
      items={devices.slice(0, countToShow)}
      fields={columns}
      hover
      border
    />
  );
};

DeviceDeletePreviewTable.propTypes = {
  devices: PropTypes.instanceOf(Array),
  countToShow: PropTypes.number.isRequired,
};

DeviceDeletePreviewTable.defaultProps = {
  devices: [],
};

export default DeviceDeletePreviewTable;
