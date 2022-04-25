import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Subscriber } from 'models/Subscriber';
import { MagnifyingGlass } from 'phosphor-react';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  subscribers: Subscriber[];
}

const SubscriberSearchDisplayTable: React.FC<Props> = ({ subscribers }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToClick = (id: string) => navigate(`/subscriber/${id}`);

  const actions = useCallback(
    (cell) => (
      <Flex>
        <Tooltip hasArrow label={t('table.go_to_page')} placement="top">
          <IconButton
            aria-label="Go to page"
            ml={2}
            colorScheme="blue"
            icon={<MagnifyingGlass size={20} />}
            size="sm"
            onClick={() => handleGoToClick(cell.row.original.id)}
          />
        </Tooltip>
      </Flex>
    ),
    [],
  );
  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'email',
        Header: t('common.email'),
        Footer: '',
        accessor: 'email',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'country',
        Header: t('locations.country'),
        Footer: '',
        accessor: 'country',
        customWidth: '100px',
      },
      {
        id: 'locale',
        Header: t('common.locale'),
        Footer: '',
        accessor: 'locale',
        customWidth: '100px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'id',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }: { cell: unknown }) => actions(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ],
    [],
  );

  return <DataTable columns={columns} data={subscribers} obj={t('subscribers.other')} minHeight="400px" />;
};

export default SubscriberSearchDisplayTable;
