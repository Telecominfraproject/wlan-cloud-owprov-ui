import * as React from 'react';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import CreateConfigurationOverrideForm from './CreateForm';
import { useAuth } from 'contexts/AuthProvider';
import { ConfigurationOverride } from 'hooks/Network/ConfigurationOverride';
import useFastField from 'hooks/useFastField';

type Props = {
  isDisabled?: boolean;
};
const AddConfigurationOverrideButton = ({ isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const { value, onChange } = useFastField<ConfigurationOverride[] | undefined>({ name: 'overrides' });

  const overrides: ConfigurationOverride[] = value || [];

  const onAddOverride = React.useCallback(
    (newOverride: ConfigurationOverride) => {
      if (user) {
        onChange([...overrides, newOverride]);
        onClose();
      }
    },
    [overrides, user],
  );

  const alreadyCreatedNames = React.useMemo(() => {
    if (user?.userRole) {
      return overrides.filter(({ source }) => source === user.userRole).map(({ parameterName }) => parameterName);
    }

    return [];
  }, [user?.userRole, overrides]);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          colorScheme="blue"
          type="button"
          onClick={onOpen}
          isDisabled={isDisabled}
          rightIcon={<Plus size={20} />}
        >
          {t('common.create')}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="400px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          {t('crud.create')} {t('overrides.one')}
        </PopoverHeader>
        <CreateConfigurationOverrideForm
          userRole={user?.userRole ?? ''}
          onAdd={onAddOverride}
          onClose={onClose}
          alreadyCreatedNames={alreadyCreatedNames}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AddConfigurationOverrideButton;
