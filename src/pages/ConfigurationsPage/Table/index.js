import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, useDisclosure, useToast } from '@chakra-ui/react';
import { useGetConfigurations } from 'hooks/Network/Configurations';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { ArrowsClockwise } from 'phosphor-react';
import ColumnPicker from 'components/ColumnPicker';
import ConfigurationInUseModal from 'components/Modals/ConfigurationInUseModal';
import ConfigurationViewAffectedModal from 'components/Tables/ConfigurationTable/ConfigurationViewAffectedModal';
import CreateConfigurationModal from 'components/Tables/ConfigurationTable/CreateConfigurationModal';
import Actions from './Actions';

const propTypes = {
  title: PropTypes.string,
};

const defaultProps = {
  title: null,
};

const ConfigurationsTable = ({ title }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [config, setConfig] = useState(null);
  const { isOpen: isInUseOpen, onOpen: openInUse, onClose: closeInUse } = useDisclosure();
  const { isOpen: isAffectedOpen, onOpen: openAffected, onClose: closeAffected } = useDisclosure();
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { data: configurations, refetch: refresh, isFetching } = useGetConfigurations({ t, toast });

  const openInUseModal = (newConf) => {
    setConfig(newConf);
    openInUse();
  };
  const openAffectedModal = (newConf) => {
    setConfig(newConf);
    openAffected();
  };

  const memoizedActions = useCallback(
    (cell) => (
      <Actions
        cell={cell.row}
        refreshTable={refresh}
        key={uuid()}
        openInUseModal={openInUseModal}
        openAffectedModal={openAffectedModal}
      />
    ),
    [],
  );
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);
  const memoizedTypes = useCallback((cell) => cell.row.values.deviceTypes.join(', '), []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
        alwaysShow: true,
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => memoizedDate(cell, 'created'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }) => memoizedDate(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'deviceTypes',
        Header: t('configurations.device_types'),
        Footer: '',
        accessor: 'deviceTypes',
        Cell: ({ cell }) => memoizedTypes(cell),
        disableSortBy: true,
        customMaxWidth: '150px',
      },
      {
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => memoizedActions(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, []);

  return (
    <>
      <Card>
        <CardHeader mb="10px">
          <Box>
            <Heading size="md">{title}</Heading>
          </Box>
          <Flex w="100%" flexDirection="row" alignItems="center">
            <Box ms="auto">
              <ColumnPicker
                columns={columns}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
                preference="provisioning.configurationTable.hiddenColumns"
              />
              <CreateConfigurationModal refresh={refresh} />
              <Button
                colorScheme="gray"
                onClick={refresh}
                rightIcon={<ArrowsClockwise />}
                ml={2}
                isLoading={isFetching}
              >
                {t('common.refresh')}
              </Button>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto" w="100%">
            <DataTable
              columns={columns}
              data={configurations ?? []}
              isLoading={isFetching}
              obj={t('configurations.title')}
              hiddenColumns={hiddenColumns}
              fullScreen
            />
          </Box>
        </CardBody>
      </Card>
      <ConfigurationInUseModal isOpen={isInUseOpen} onClose={closeInUse} config={config} />
      <ConfigurationViewAffectedModal isOpen={isAffectedOpen} onClose={closeAffected} config={config} />
    </>
  );
};

ConfigurationsTable.propTypes = propTypes;
ConfigurationsTable.defaultProps = defaultProps;

export default ConfigurationsTable;
