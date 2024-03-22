import * as React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  ListItem,
  Tooltip,
  UnorderedList,
} from '@chakra-ui/react';
import { Trash } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import FileInputButton from 'components/Buttons/FileInputButton';
import useFastField from 'hooks/useFastField';

type Props = {
  name?: string;
  isDisabled?: boolean;
};

const GoogleOrionCaCertificateField = ({ name, isDisabled }: Props) => {
  const { t } = useTranslation();
  const [refreshId, setRefreshId] = React.useState(uuid());
  const field = useFastField<{ value: string; filename: string }[]>({ name: name ?? 'temporaryCerts' });

  const onAdd = (v: string, file?: File) => {
    if (!file) return;

    field.onChange([...field.value, { value: v, filename: file.name }]);
    setRefreshId(uuid());
  };

  const onRemove = (index: number) => {
    field.onChange((field.value as { value: string; filename: string }[]).filter((_, i) => i !== index));
    setRefreshId(uuid());
  };

  return (
    <>
      <FormControl id={name ?? 'temporaryCerts'} isDisabled={isDisabled} w="300px" isRequired isInvalid={field.isError}>
        <FormLabel>
          CA Certificates ({field.value?.length})
          {name ? null : (
            <Tooltip hasArrow label="Upload every file inside the 'cacerts' directory you have obtained from Google">
              <InfoIcon ml={2} mb="2px" />
            </Tooltip>
          )}
        </FormLabel>
        <FileInputButton value="" setValue={onAdd} refreshId={refreshId} accept="" isStringFile />
        <FormErrorMessage>You need to upload at least one file to CA Certs</FormErrorMessage>
      </FormControl>
      <UnorderedList>
        {(field.value as { value: string; filename: string }[]).map((v, i) => (
          <ListItem key={uuid()}>
            {v.filename}
            <Tooltip label={t('common.remove')}>
              <IconButton
                aria-label={t('common.remove')}
                icon={<Trash size={20} />}
                size="sm"
                ml={2}
                colorScheme="red"
                onClick={() => onRemove(i)}
              />
            </Tooltip>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
};

export default GoogleOrionCaCertificateField;
