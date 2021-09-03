import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CDataTable } from '@coreui/react';

const DeviceImportPreviewTable = ({ devices, countToShow }) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'SerialNumber', label: t('common.serial_number'), _style: { width: '20%' } },
    { key: 'Name', label: t('user.name'), _style: { width: '20%' } },
    { key: 'Description', label: t('user.description'), _style: { width: '20%' } },
    { key: 'DeviceType', label: t('firmware.device_type'), _style: { width: '20%' } },
    { key: 'NoteText', label: t('inventory.note_text'), _style: { width: '20%' } },
  ];

  return (
    <CDataTable
      addTableClasses="ignore-overflow"
      items={devices.slice(0, countToShow)}
      fields={columns}
      hover
      border
    />
  );
};

DeviceImportPreviewTable.propTypes = {
  devices: PropTypes.instanceOf(Array),
  countToShow: PropTypes.number.isRequired,
};

DeviceImportPreviewTable.defaultProps = {
  devices: [],
};

export default DeviceImportPreviewTable;
