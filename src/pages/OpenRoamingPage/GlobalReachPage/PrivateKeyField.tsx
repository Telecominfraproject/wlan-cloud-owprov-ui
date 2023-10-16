import * as React from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FileInputButton from 'components/Buttons/FileInputButton';
import useFastField from 'hooks/useFastField';

type Props = {
  isDisabled?: boolean;
};

const PrivateKeyField = ({ isDisabled }: Props) => {
  const { t } = useTranslation();
  const [refreshId, setRefreshId] = React.useState(uuid());
  const privateKey = useFastField<string>({ name: 'privateKey' });

  React.useEffect(() => {
    setRefreshId(uuid());
  }, [privateKey.value]);

  return (
    <FormControl id="privateKey" isRequired isInvalid={privateKey.isError} isDisabled={isDisabled}>
      <FormLabel>{t('roaming.private_key')}</FormLabel>
      <FileInputButton
        value={privateKey.value}
        setValue={privateKey.onChange}
        refreshId={refreshId}
        accept=".pem"
        isStringFile
      />
      <FormErrorMessage>{privateKey.error}</FormErrorMessage>
    </FormControl>
  );
};

export default PrivateKeyField;
