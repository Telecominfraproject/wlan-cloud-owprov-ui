import React, { useCallback, useMemo } from 'react';
import useFastField from 'hooks/useFastField';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_RATE_LIMIT_SCHEMA } from '../../../interfacesConstants';
import RateLimitForm from './RateLimit';

const RateLimit: React.FC<{ editing: boolean; namePrefix: string }> = ({ editing, namePrefix }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: namePrefix });

  const { isEnabled } = useMemo(
    () => ({
      isEnabled: value !== undefined,
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange(INTERFACE_SSID_RATE_LIMIT_SCHEMA(t, true).cast());
      }
    },
    [onChange],
  );

  return <RateLimitForm editing={editing} namePrefix={namePrefix} isEnabled={isEnabled} onToggle={onToggle} />;
};

export default React.memo(RateLimit);
