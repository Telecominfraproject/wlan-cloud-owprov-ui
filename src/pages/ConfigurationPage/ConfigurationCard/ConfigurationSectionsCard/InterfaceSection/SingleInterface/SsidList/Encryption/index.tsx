import React, { useCallback, useMemo } from 'react';
import useFastField from 'hooks/useFastField';
import { useTranslation } from 'react-i18next';
import {
  ENCRYPTION_PROTOS_REQUIRE_IEEE,
  ENCRYPTION_PROTOS_REQUIRE_KEY,
  ENCRYPTION_PROTOS_REQUIRE_RADIUS,
  INTERFACE_SSID_RADIUS_SCHEMA,
  NO_MULTI_PROTOS,
} from '../../../interfacesConstants';
import EncryptionForm from './Encryption';

const Encryption = ({
  editing,
  ssidName,
  namePrefix,
  radiusPrefix,
  isPasspoint,
}: {
  editing: boolean;
  namePrefix: string;
  radiusPrefix: string;
  ssidName: string;
  isPasspoint?: boolean;
}) => {
  const { t } = useTranslation();
  const { value: encryptionValue, onChange: onEncryptionChange } = useFastField({ name: namePrefix });
  const { value: radiusValue, onChange: onRadiusChange } = useFastField({ name: radiusPrefix });
  const { onChange: onMultiPskChange } = useFastField({ name: `${ssidName}.multi-psk` });

  const onProtoChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newEncryption: { proto: string; key?: string; ieee80211w?: string } = {
        proto: e.target.value,
      };
      if (e.target.value === 'none') {
        onEncryptionChange({ proto: 'none' });
        onRadiusChange(undefined);
      } else {
        if (NO_MULTI_PROTOS.includes(e.target.value)) onMultiPskChange(undefined);
        if (ENCRYPTION_PROTOS_REQUIRE_KEY.includes(e.target.value)) newEncryption.key = 'YOUR_SECRET';
        if (ENCRYPTION_PROTOS_REQUIRE_IEEE.includes(e.target.value)) newEncryption.ieee80211w = 'required';
        onEncryptionChange(newEncryption);
        if (ENCRYPTION_PROTOS_REQUIRE_RADIUS.includes(e.target.value)) {
          /*
          if (isPasspoint) {
            onRadiusChange(DEFAULT_PASSPOINT_RADIUS);
          } else {
            onRadiusChange(INTERFACE_SSID_RADIUS_SCHEMA(t, true).cast());
          } */
          onRadiusChange(INTERFACE_SSID_RADIUS_SCHEMA(t, true).cast());
        } else {
          onRadiusChange(undefined);
        }
      }
    },
    [isPasspoint],
  );

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
      isPasspoint={isPasspoint}
    />
  );
};

export default React.memo(Encryption);
