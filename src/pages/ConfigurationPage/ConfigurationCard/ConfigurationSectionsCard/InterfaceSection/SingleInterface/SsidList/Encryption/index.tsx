import React, { useCallback, useMemo } from 'react';
import useFastField from 'hooks/useFastField';
import { useTranslation } from 'react-i18next';
import {
  ENCRYPTION_PROTOS_REQUIRE_IEEE,
  ENCRYPTION_PROTOS_REQUIRE_KEY,
  ENCRYPTION_PROTOS_REQUIRE_RADIUS,
  INTERFACE_SSID_RADIUS_SCHEMA,
} from '../../../interfacesConstants';
import EncryptionForm from './Encryption';

const Encryption: React.FC<{ editing: boolean; namePrefix: string; radiusPrefix: string }> = ({
  editing,
  namePrefix,
  radiusPrefix,
}) => {
  const { t } = useTranslation();
  const { value: encryptionValue, onChange: onEncryptionChange } = useFastField({ name: namePrefix });
  const { value: radiusValue, onChange: onRadiusChange } = useFastField({ name: radiusPrefix });

  const onProtoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEncryption: { proto: string; key?: string; ieee80211w?: string } = {
      proto: e.target.value,
    };
    if (e.target.value === 'none') {
      onEncryptionChange({ proto: 'none' });
      onRadiusChange(undefined);
    } else {
      if (ENCRYPTION_PROTOS_REQUIRE_KEY.includes(e.target.value)) newEncryption.key = 'YOUR_SECRET';
      if (ENCRYPTION_PROTOS_REQUIRE_IEEE.includes(e.target.value)) newEncryption.ieee80211w = 'YOUR_SECRET';
      onEncryptionChange(newEncryption);
      if (ENCRYPTION_PROTOS_REQUIRE_RADIUS.includes(e.target.value))
        onRadiusChange(INTERFACE_SSID_RADIUS_SCHEMA(t, true).cast());
      else {
        onRadiusChange(undefined);
      }
    }
  }, []);

  const { isKeyNeeded, needIeee, isUsingRadius } = useMemo(
    () => ({
      isKeyNeeded: ENCRYPTION_PROTOS_REQUIRE_KEY.includes(encryptionValue?.proto ?? ''),
      needIeee: ENCRYPTION_PROTOS_REQUIRE_IEEE.includes(encryptionValue?.proto ?? ''),
      isUsingRadius:
        ENCRYPTION_PROTOS_REQUIRE_RADIUS.includes(encryptionValue?.proto ?? '') || radiusValue !== undefined,
    }),
    [encryptionValue?.proto, radiusValue !== undefined],
  );

  return (
    <EncryptionForm
      editing={editing}
      namePrefix={namePrefix}
      radiusPrefix={radiusPrefix}
      onProtoChange={onProtoChange}
      needIeee={needIeee}
      isKeyNeeded={isKeyNeeded}
      isUsingRadius={isUsingRadius}
    />
  );
};

export default React.memo(Encryption);
