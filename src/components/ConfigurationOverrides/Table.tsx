import * as React from 'react';
import { Flex, Heading, HStack, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AddConfigurationOverrideButton from './AddButton';
import useConfigurationOverridesTable from './useConfigurationOverridesTable';
import ColumnPicker from 'components/ColumnPicker';
import DataTable from 'components/DataTable';
import { Column } from 'models/Table';

type Props = {
  serialNumber: string;
  isDisabled?: boolean;
};

const ConfigurationOverridesTable = ({ serialNumber, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { overrides, columns, hiddenColumns } = useConfigurationOverridesTable({ serialNumber, isDisabled });

  return (
    <>
      <Flex mb={2}>
        <Heading size="sm" my="auto">
          {t('overrides.other')} ({overrides.length})
        </Heading>
        <Spacer />
        <HStack spacing={2}>
          <AddConfigurationOverrideButton isDisabled={isDisabled} />
          <ColumnPicker
            columns={columns as Column<unknown>[]}
            hiddenColumns={hiddenColumns[0]}
            setHiddenColumns={hiddenColumns[1]}
            preference="configurationOverrides.deviceModal.table.hiddenColumns"
          />
        </HStack>
      </Flex>
      <DataTable
        columns={columns as Column<object>[]}
        saveSettingsId="configurationOverrides.deviceModal.table"
        data={overrides}
        obj={t('overrides.other')}
        sortBy={[{ id: 'source', desc: false }]}
        minHeight="400px"
        hiddenColumns={hiddenColumns[0]}
      />
    </>
  );
};

export default ConfigurationOverridesTable;
