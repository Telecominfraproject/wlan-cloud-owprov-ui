import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { compactDate } from 'utils/dateFormatting';
import DataTable from 'components/DataTable';

const propTypes = {
  certificates: PropTypes.arrayOf(
    PropTypes.shape({
      expiresOn: PropTypes.number.isRequired,
      filename: PropTypes.string.isRequired,
    }),
  ),
};

const defaultProps = {
  certificates: [],
};

const SystemCertificatesTable = ({ certificates }) => {
  const { t } = useTranslation();

  const memoizedExpiry = useCallback((cell) => compactDate(cell.row.values.expiresOn), []);

  const columns = React.useMemo(
    () => [
      {
        id: 'expiresOn',
        Header: t('certificates.expires_on'),
        Footer: '',
        accessor: 'expiresOn',
        Cell: ({ cell }) => memoizedExpiry(cell),
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        hasPopover: true,
      },
      {
        id: 'filename',
        Header: t('certificates.filename'),
        Footer: '',
        accessor: 'filename',
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={certificates}
      obj={t('certificates.title')}
      hideControls
      sortBy={[
        {
          id: 'started',
          desc: true,
        },
      ]}
    />
  );
};

SystemCertificatesTable.propTypes = propTypes;
SystemCertificatesTable.defaultProps = defaultProps;
export default SystemCertificatesTable;
