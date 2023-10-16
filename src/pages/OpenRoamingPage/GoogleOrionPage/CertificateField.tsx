import * as React from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FileInputButton from 'components/Buttons/FileInputButton';
import useFastField from 'hooks/useFastField';

type Props = {
  name?: string;
  isDisabled?: boolean;
};

const GoogleOrionCertificateField = ({ isDisabled, name }: Props) => {
  const { t } = useTranslation();
  const [refreshId, setRefreshId] = React.useState(uuid());
  const certificate = useFastField<string>({ name: name ?? 'certificate' });

  React.useEffect(() => {
    setRefreshId(uuid());
  }, [certificate.value]);

  return (
    <FormControl id="privateKey" isRequired isInvalid={certificate.isError} isDisabled={isDisabled}>
      <FormLabel>{t('certificates.certificate')}</FormLabel>
      <FileInputButton
        value={certificate.value}
        setValue={certificate.onChange}
        refreshId={refreshId}
        accept=".pem"
        isStringFile
      />
      <FormErrorMessage>{certificate.error}</FormErrorMessage>
    </FormControl>
  );
};

export default GoogleOrionCertificateField;
