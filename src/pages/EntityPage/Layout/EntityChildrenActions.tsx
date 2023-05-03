import React from 'react';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Entity } from 'models/Entity';

type Props = {
  entity: Entity;
  isVenue: boolean;
};

const EntityChildrenActions = ({ entity, isVenue }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToPage = () => navigate(isVenue ? `/venue/${entity.id}` : `/entity/${entity.id}`);

  return (
    <Flex>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label={t('common.view_details')}
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleGoToPage}
        />
      </Tooltip>
    </Flex>
  );
};

export default EntityChildrenActions;
