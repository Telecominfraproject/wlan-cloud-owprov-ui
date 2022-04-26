import { IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { Translate } from 'phosphor-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => () => i18n.changeLanguage(language);
  return (
    <Menu>
      <Tooltip label={t('common.language')}>
        <MenuButton
          background="transparent"
          as={IconButton}
          aria-label="Commands"
          icon={<Translate size={24} />}
          size="sm"
        />
      </Tooltip>
      <MenuList>
        <MenuItem onClick={changeLanguage('de')}>Deutsche</MenuItem>
        <MenuItem onClick={changeLanguage('es')}>Español</MenuItem>
        <MenuItem onClick={changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={changeLanguage('fr')}>Français</MenuItem>
        <MenuItem onClick={changeLanguage('pt')}>Portugues</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
