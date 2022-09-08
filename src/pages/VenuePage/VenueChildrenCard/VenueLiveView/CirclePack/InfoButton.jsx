import {
  Box,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { useCircleGraph } from 'contexts/CircleGraphProvider';
import { Question } from 'phosphor-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CirclePackInfoButton = () => {
  const { t } = useTranslation();
  const { popoverRef } = useCircleGraph();

  return (
    <Box textAlign="right" position="absolute" right={8} zIndex="1000">
      <Popover isLazy trigger="hover" placement="auto">
        <PopoverTrigger>
          <IconButton ml={2} icon={<Question size={32} />} size="sm" colorScheme="blue" />
        </PopoverTrigger>
        <Portal containerRef={popoverRef}>
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
        </Portal>
      </Popover>
    </Box>
  );
};

export default React.memo(CirclePackInfoButton);
