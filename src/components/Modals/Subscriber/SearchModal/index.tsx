import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CloseButton from 'components/Buttons/CloseButton';
import ModalHeader from 'components/Modals/ModalHeader';
import SubscriberSearch from 'components/SearchBars/SubscriberSearch';
import { MagnifyingGlass } from 'phosphor-react';
import { Subscriber } from 'models/Subscriber';
import SubscriberSearchDisplayTable from './Table';

interface Props {
  operatorId: string;
}

const SubscriberSearchModal: React.FC<Props> = ({ operatorId }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [results, setResults] = useState<Subscriber[]>([]);

  return (
    <>
      <Button alignItems="center" colorScheme="blue" rightIcon={<MagnifyingGlass />} onClick={onOpen} ml={2}>
        {t('common.search')}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth={{ sm: '90%', md: '900px', lg: '1000px', xl: '80%' }}>
          <ModalHeader
            title={`${t('common.search')} ${t('subscribers.other')}`}
            right={<CloseButton ml={2} onClick={onClose} />}
          />
          <ModalBody>
            <Flex>
              <SubscriberSearch operatorId={operatorId} setResults={setResults} />
            </Flex>
            <SubscriberSearchDisplayTable subscribers={results} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubscriberSearchModal;
