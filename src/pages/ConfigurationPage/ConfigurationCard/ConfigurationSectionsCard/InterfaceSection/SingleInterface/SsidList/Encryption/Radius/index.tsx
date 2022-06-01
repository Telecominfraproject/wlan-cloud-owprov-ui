import useFastField from 'hooks/useFastField';
import React, { useMemo } from 'react';
import RadiusForm from './Radius';

const Radius: React.FC<{ editing: boolean; namePrefix: string }> = ({ editing, namePrefix }) => {
  const { value: customRadius } = useFastField({ name: `${namePrefix}.__variableBlock` });
  const { value: accounting, onChange: setAccounting } = useFastField({ name: `${namePrefix}.accounting` });
  const { value: dynamicAuth, onChange: setDynamicAuth } = useFastField({
    name: `${namePrefix}.dynamic-authorization`,
  });

  const isUsingCustomRadius = useMemo(() => customRadius === undefined, [customRadius]);

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

  const onEnableDynamicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setDynamicAuth({
        host: '192.168.178.192',
        port: 1813,
        secret: 'YOUR_SECRET',
      });
    } else {
      setDynamicAuth(undefined);
    }
  };

  const isDynamicEnabled = useMemo(() => dynamicAuth !== undefined, [dynamicAuth !== undefined]);

  return (
    <RadiusForm
      editing={editing}
      isUsingCustom={isUsingCustomRadius}
      onAccountingChange={onEnabledAccountingChange}
      isAccountingEnabled={isAccountingEnabled}
      onDynamicChange={onEnableDynamicChange}
      isDynamicEnabled={isDynamicEnabled}
      variableBlock={customRadius}
      namePrefix={namePrefix}
    />
  );
};

export default React.memo(Radius);
