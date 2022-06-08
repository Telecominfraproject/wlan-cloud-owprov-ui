import React, { useCallback, useMemo } from 'react';
import useFastField from 'hooks/useFastField';
import { useTranslation } from 'react-i18next';
import CaptiveForm from './Captive';
import { INTERFACE_CAPTIVE_SCHEMA } from '../../interfacesConstants';

const Captive: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: `configuration[${index}].captive` });

  const { isActive } = useMemo(
    () => ({
      isActive: value !== undefined,
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange(INTERFACE_CAPTIVE_SCHEMA(t, true).cast());
      }
    },
    [onChange],
  );

  return <CaptiveForm editing={editing} index={index} isActive={isActive} onToggle={onToggle} />;
};

export default React.memo(Captive);
