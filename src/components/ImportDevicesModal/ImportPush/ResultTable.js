import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CDataTable } from '@coreui/react';

const ResultTable = ({ devices, error }) => {
  const { t } = useTranslation();

  const columns = error
    ? [
        { key: 'SerialNumber', label: t('common.serial_number'), _style: { width: '20%' } },
        { key: 'error', label: t('common.error'), _style: { width: '80%' } },
      ]
    : [
        { key: 'SerialNumber', label: t('common.serial_number'), _style: { width: '20%' } },
        { key: 'Name', label: t('user.name'), _style: { width: '20%' } },
        { key: 'Description', label: t('user.description'), _style: { width: '20%' } },
        { key: 'DeviceType', label: t('firmware.device_type'), _style: { width: '20%' } },
        { key: 'NoteText', label: t('inventory.note_text'), _style: { width: '20%' } },
      ];

  return (
    <CDataTable addTableClasses="ignore-overflow" items={devices} fields={columns} hover border />
  );
};

ResultTable.propTypes = {
  devices: PropTypes.instanceOf(Array),
  error: PropTypes.bool,
};

ResultTable.defaultProps = {
  devices: [],
  error: false,
};

export default ResultTable;
