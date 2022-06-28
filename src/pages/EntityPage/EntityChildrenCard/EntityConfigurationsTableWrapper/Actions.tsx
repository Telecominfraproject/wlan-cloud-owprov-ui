import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { ArrowSquareOut } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import DeleteConfigurationButton from 'components/Tables/ConfigurationTable/DeleteConfigurationButton';
import { Configuration } from 'models/Configuration';

type Props = {
  cell: {
    original: Configuration;
  };
};

const Actions = ({ cell: { original: configuration } }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToPage = () => navigate(`/configuration/${configuration.id}`);

  return (
    <Flex>
      <DeleteConfigurationButton configuration={configuration} />
      <Tooltip hasArrow label={t('venues.go_to_page')} placement="top">
        <IconButton
          aria-label={t('venues.go_to_page')}
          ml={2}
          colorScheme="blue"
          icon={<ArrowSquareOut size={20} />}
          size="sm"
          onClick={handleGoToPage}
        />
      </Tooltip>
    </Flex>
  );
};

export default Actions;
