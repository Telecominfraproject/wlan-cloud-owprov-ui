import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { Contact } from 'models/Contact';

interface Props {
  cell: {
    original: Contact;
  };
  claimContact: (contactId: string) => void;
  isDisabled: boolean;
}

const Actions: React.FC<Props> = ({ cell: { original: contact }, claimContact, isDisabled }) => {
  const { t } = useTranslation();
  const handleOpenEdit = () => claimContact(contact.id);

  return (
    <Flex>
      <Tooltip hasArrow label={t('venues.use_this_contact')} placement="top">
        <IconButton
          aria-label="Use this contact"
          ml={2}
          colorScheme="blue"
          icon={<Plus size={20} />}
          size="sm"
          isDisabled={isDisabled}
          onClick={handleOpenEdit}
        />
      </Tooltip>
    </Flex>
  );
};

export default Actions;
