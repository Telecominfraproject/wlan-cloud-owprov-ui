import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, IconButton, Menu, MenuButton, MenuItem, MenuList, useBreakpoint } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import { FunnelSimple } from 'phosphor-react';
import { Column } from 'models/Table';

interface Props {
  preference: string;
  columns: Column[];
  hiddenColumns: string[];
  setHiddenColumns: (str: string[]) => void;
}

const ColumnPicker: React.FC<Props> = ({ preference, columns, hiddenColumns, setHiddenColumns }) => {
  const { t } = useTranslation();
  const { getPref, setPref } = useAuth();
  const breakpoint = useBreakpoint();

  const handleColumnClick = (id: string) => {
    let newHidden = [];
    if (hiddenColumns.find((hidden) => hidden === id)) newHidden = [...hiddenColumns.filter((hidden) => hidden !== id)];
    else newHidden = [...hiddenColumns, id];
    setPref({ preference, value: newHidden.join(',') });
    setHiddenColumns(newHidden);
  };

  useEffect(() => {
    const savedPrefs = getPref(preference);
    setHiddenColumns(savedPrefs ? savedPrefs.split(',') : []);
  }, []);

  if (breakpoint === 'base' || breakpoint === 'sm') {
    return (
      <Menu closeOnSelect={false}>
        <MenuButton as={IconButton} icon={<FunnelSimple />} />
        <MenuList maxH="200px" overflowY="auto">
          {columns.map((column) => (
            <MenuItem key={uuid()} isDisabled={column.alwaysShow} onClick={() => handleColumnClick(column.id)}>
              <Checkbox
                defaultChecked={!hiddenColumns.find((hidden) => hidden === column.id)}
                isDisabled={column.alwaysShow}
              >
                {column.Header}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} rightIcon={<FunnelSimple />} minWidth="120px">
        {t('common.columns')}
      </MenuButton>
      <MenuList maxH="200px" overflowY="auto">
        {columns.map((column) => (
          <MenuItem key={uuid()} isDisabled={column.alwaysShow} onClick={() => handleColumnClick(column.id)}>
            <Checkbox
              defaultChecked={!hiddenColumns.find((hidden) => hidden === column.id)}
              isDisabled={column.alwaysShow}
            >
              {column.Header}
            </Checkbox>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ColumnPicker;
