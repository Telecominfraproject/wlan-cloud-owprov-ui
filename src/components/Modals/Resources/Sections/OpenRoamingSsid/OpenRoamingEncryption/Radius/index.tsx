import React, { useMemo } from 'react';
import RadiusForm from './Radius';
import useFastField from 'hooks/useFastField';

type Props = { editing: boolean; namePrefix: string; isPasspoint?: boolean };

const OpenRoamingRadius = ({ editing, namePrefix, isPasspoint }: Props) => {
  const { value: accounting, onChange: setAccounting } = useFastField({ name: `${namePrefix}.accounting` });

  const onEnabledAccountingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAccounting({
        host: '192.168.178.192',
        port: 1813,
        secret: 'YOUR_SECRET',
      });
    } else {
      setAccounting(undefined);
    }
  };

  const isAccountingEnabled = useMemo(() => accounting !== undefined, [accounting !== undefined]);

  return (
    <RadiusForm
      editing={editing}
      onAccountingChange={onEnabledAccountingChange}
      isAccountingEnabled={isAccountingEnabled}
      namePrefix={namePrefix}
      isPasspoint={isPasspoint}
    />
  );
};

export default React.memo(OpenRoamingRadius);
