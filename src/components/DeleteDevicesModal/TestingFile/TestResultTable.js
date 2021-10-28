import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CDataTable } from '@coreui/react';

const TestResultTable = ({ devices, assigned }) => {
  const { t } = useTranslation();

  const columns = assigned
    ? [
        { key: 'SerialNumber', label: t('common.serial_number'), _style: { width: '33%' } },
        { key: 'entity', label: t('entity.entity'), _style: { width: '34%' } },
        { key: 'venue', label: t('inventory.venue'), _style: { width: '33%' } },
      ]
    : [
        { key: 'SerialNumber', label: t('common.serial_number'), _style: { width: '20%' } },
        { key: 'Name', label: t('user.name'), _style: { width: '20%' } },
        { key: 'Description', label: t('user.description'), _style: { width: '20%' } },
        { key: 'DeviceType', label: t('firmware.device_type'), _style: { width: '20%' } },
        { key: 'NoteText', label: t('inventory.note_text'), _style: { width: '20%' } },
      ];

  return (
    <CDataTable
      addTableClasses="ignore-overflow table-sm"
      items={devices}
      fields={columns}
      hover
      border
    />
  );
};

TestResultTable.propTypes = {
  devices: PropTypes.instanceOf(Array),
  assigned: PropTypes.bool,
};

TestResultTable.defaultProps = {
  devices: [],
  assigned: false,
};

export default TestResultTable;
