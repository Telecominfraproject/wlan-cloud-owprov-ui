import React from 'react';
import {
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';
import { Question } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

const CirclePackInfoButton = () => {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>
        <Tooltip label={t('configurations.explanation')}>
          <IconButton aria-label={t('configurations.explanation')} icon={<Question size={20} />} colorScheme="blue" />
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent w="440px">
        <PopoverArrow />
        <PopoverCloseButton alignContent="center" mt={1} />
        <PopoverHeader display="flex">{t('analytics.live_view_help')}</PopoverHeader>
        <PopoverBody>
          <Heading size="sm">{t('analytics.live_view_explanation_one')}</Heading>
          <Heading size="sm" mt={4}>
            {t('analytics.live_view_explanation_two')}
          </Heading>
          <Heading size="sm">{t('analytics.live_view_explanation_three')}</Heading>
          <Heading size="sm" mt={4}>
            {t('analytics.live_view_explanation_four')}
          </Heading>
          <Heading size="sm" mt={4}>
            {t('analytics.live_view_explanation_five')}
          </Heading>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CirclePackInfoButton;
