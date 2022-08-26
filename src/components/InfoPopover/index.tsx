import * as React from 'react';
import {
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
import { Question } from 'phosphor-react';

export type InfoPopoverProps = {
  title: string;
  popoverContentProps?: React.ComponentProps<typeof PopoverContent>;
  buttonProps?: React.ComponentProps<typeof IconButton>;
  children: React.ReactNode;
};

export const InfoPopover = ({ title, popoverContentProps, buttonProps, children }: InfoPopoverProps) => (
  <Popover isLazy trigger="hover" placement="auto">
    <PopoverTrigger>
      <IconButton
        aria-label="Information Hover"
        icon={<Question size={24} />}
        size="sm"
        colorScheme="blue"
        {...buttonProps}
      />
    </PopoverTrigger>
    <Portal>
      <PopoverContent {...popoverContentProps}>
        <PopoverArrow />
        <PopoverCloseButton alignContent="center" mt={1} />
        <PopoverHeader display="flex">{title}</PopoverHeader>
        <PopoverBody>{children}</PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
);
