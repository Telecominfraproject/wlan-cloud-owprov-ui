import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpoint,
} from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthProvider';
import { FunnelSimple } from 'phosphor-react';

const propTypes = {
  preference: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      Header: PropTypes.string.isRequired,
    }),
  ).isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setHiddenColumns: PropTypes.func.isRequired,
};

const ColumnPicker = ({ preference, columns, hiddenColumns, setHiddenColumns }) => {
  const { t } = useTranslation();
  const { getPref, setPref } = useAuth();
  const breakpoint = useBreakpoint();

  const handleColumnClick = (id) => {
    let newHidden = [];
    if (hiddenColumns.find((hidden) => hidden === id))
      newHidden = [...hiddenColumns.filter((hidden) => hidden !== id)];
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
        <MenuList>
          {columns.map((column) => (
            <MenuItem
              key={createUuid()}
              isDisabled={column.alwaysShow}
              onClick={() => handleColumnClick(column.id)}
            >
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
      <MenuList>
        {columns.map((column) => (
          <MenuItem
            key={createUuid()}
            isDisabled={column.alwaysShow}
            onClick={() => handleColumnClick(column.id)}
          >
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

ColumnPicker.propTypes = propTypes;

export default ColumnPicker;
