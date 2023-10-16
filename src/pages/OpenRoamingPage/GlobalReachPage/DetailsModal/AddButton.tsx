import * as React from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CreateButton from 'components/Buttons/CreateButton';
import { GlobalReachAccount, useCreateGlobalReachCertificate } from 'hooks/Network/GlobalReach';
import { useNotification } from 'hooks/useNotification';

type Props = {
  account: GlobalReachAccount;
};

const CreateGlobalReachCertificateButton = ({ account }: Props) => {
  const { t } = useTranslation();
  const popoverProps = useDisclosure();
  const create = useCreateGlobalReachCertificate();
  const [name, setName] = React.useState('');
  const { successToast, apiErrorToast } = useNotification();

  const handleCreate = () => {
    create.mutate(
      {
        accountId: account.id,
        name,
      },
      {
        onSuccess: () => {
          successToast({
            description: 'Certificate created successfully',
          });
          popoverProps.onClose();
          setName('');
        },
        onError: (e) => {
          apiErrorToast({ e });
        },
      },
    );
  };

  React.useEffect(() => {
    setName('');
  }, [popoverProps.isOpen]);

  return (
    <Popover {...popoverProps} placement="start">
      <PopoverTrigger>
        <Box>
          <CreateButton onClick={popoverProps.onOpen} />
        </Box>
      </PopoverTrigger>
      <PopoverContent w="334px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          {t('crud.create')} {t('certificates.certificate')}
        </PopoverHeader>
        <PopoverBody>
          <Heading size="sm">What should be this certificate&apos;s name?</Heading>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </PopoverBody>
        <PopoverFooter>
          <Center>
            <Button colorScheme="gray" mr="1" onClick={popoverProps.onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              colorScheme="blue"
              ml="1"
              onClick={handleCreate}
              isLoading={create.isLoading}
              isDisabled={name.length < 3}
            >
              {t('common.create')}
            </Button>
          </Center>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default CreateGlobalReachCertificateButton;
