import * as React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

export type ShownLogsDropdownProps = {
  availableLogTypes: { id: number; helper?: string }[];
  hiddenLogIds: number[];
  setHiddenLogIds: (ids: number[]) => void;
  helperLabels?: { [key: number]: string };
};

export const ShownLogsDropdown = ({
  availableLogTypes,
  hiddenLogIds,
  setHiddenLogIds,
  helperLabels,
}: ShownLogsDropdownProps) => {
  const { t } = useTranslation();

  const isActive = (id: number) => !hiddenLogIds.includes(id);
  const onToggle = (id: number) => () => {
    if (isActive(id)) {
      setHiddenLogIds([...hiddenLogIds, id]);
    } else {
      setHiddenLogIds(hiddenLogIds.filter((hid) => hid !== id));
    }
  };
  const label = (id: number, helper?: string) => {
    if (helperLabels && helperLabels[id] !== undefined) {
      return helperLabels[id];
    }
    return helper ?? id;
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isDisabled={availableLogTypes.length === 0}>
        {t('logs.receiving_types')} ({availableLogTypes.length - hiddenLogIds.length})
      </MenuButton>
      <MenuList>
        {availableLogTypes.map((logType) => (
          <MenuItem key={uuid()} onClick={onToggle(logType.id)} isFocusable={false}>
            <Checkbox isChecked={isActive(logType.id)}>{label(logType.id, logType.helper)}</Checkbox>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
