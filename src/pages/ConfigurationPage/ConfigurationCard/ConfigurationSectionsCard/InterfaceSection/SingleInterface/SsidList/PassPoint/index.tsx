import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useFastField from 'hooks/useFastField';
import { INTERFACE_SSID_PASS_POINT_SCHEMA } from '../../../interfacesConstants';
import PassPointForm from './Form';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
  radiusPrefix: string;
};

const PassPointConfig = ({ isDisabled, namePrefix, radiusPrefix }: Props) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: namePrefix });
  const { value: radius } = useFastField({ name: radiusPrefix });

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
        if (radius) {
          // onRadiusChange(DEFAULT_PASSPOINT_RADIUS);
        }
        onChange(INTERFACE_SSID_PASS_POINT_SCHEMA(t, true).cast());
      }
    },
    [onChange, radius],
  );

  return <PassPointForm isDisabled={isDisabled} namePrefix={namePrefix} isEnabled={isEnabled} onToggle={onToggle} />;
};

export default React.memo(PassPointConfig);
