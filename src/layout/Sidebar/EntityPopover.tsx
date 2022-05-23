import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Center,
  Heading,
  IconButton,
  ListItem,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  Portal,
  Spacer,
  Spinner,
  UnorderedList,
  useBreakpoint,
} from '@chakra-ui/react';
import useGetEntityTree from 'hooks/Network/EntityTree';
import { useNavigate } from 'react-router-dom';
import { TreeStructure, Buildings, X } from 'phosphor-react';
import { FocusableElement } from '@chakra-ui/utils';

interface Tree {
  uuid: string;
  name: string;
  type: string;
  children?: Tree[];
  venues?: Tree[];
}

const renderList = (tree: Tree | Tree[], depth: number, goTo: (uuid: string, type: string) => void) => {
  if (!Array.isArray(tree)) {
    if (tree.children && tree.children.length > 0) {
      return (
        <UnorderedList ml={depth} styleType="none">
          <ListItem>
            <Button
              colorScheme="blue"
              variant="link"
              onClick={() => goTo(tree.uuid, tree.type)}
              leftIcon={tree.type === 'entity' ? <TreeStructure size={16} /> : <Buildings size={16} />}
            >
              {tree.name}
            </Button>
            <UnorderedList styleType="none">{renderList(tree.children, depth + 2, goTo)}</UnorderedList>
          </ListItem>
        </UnorderedList>
      );
    }
    return (
      <UnorderedList ml={depth}>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="link"
            onClick={() => goTo(tree.uuid, tree.type)}
            leftIcon={tree.type === 'entity' ? <TreeStructure size={16} /> : <Buildings size={16} />}
          >
            {tree.name}
          </Button>
        </ListItem>
      </UnorderedList>
    );
  }

  return tree.map((obj) => {
    const childrenLength = obj?.children?.length ?? 0;
    const venuesLength = obj?.venues?.length ?? 0;

    if (childrenLength === 0 && venuesLength === 0)
      return (
        <ListItem key={uuid()}>
          <Button
            colorScheme="blue"
            variant="link"
            onClick={() => goTo(obj.uuid, obj.type)}
            leftIcon={obj.type === 'entity' ? <TreeStructure size={16} /> : <Buildings size={16} />}
          >
            {obj.name}
          </Button>
        </ListItem>
      );

    return (
      <ListItem key={uuid()}>
        <Button
          colorScheme="blue"
          variant="link"
          onClick={() => goTo(obj.uuid, obj.type)}
          leftIcon={obj.type === 'entity' ? <TreeStructure size={16} /> : <Buildings size={16} />}
        >
          {obj.name}
        </Button>
        <UnorderedList ml={depth} styleType="none">
          {childrenLength > 0 ? renderList(obj.children ?? [], depth + 2, goTo) : null}
          {venuesLength > 0 ? renderList(obj.venues ?? [], depth + 2, goTo) : null}
        </UnorderedList>
      </ListItem>
    );
  });
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  toggleSidebar: () => void;
}
const EntityPopover: React.FC<Props> = ({ isOpen, onClose, children, toggleSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const [closeOnBlur, setCloseOnBlur] = useState(false);
  const { data: tree, isFetching } = useGetEntityTree();
  const initRef = React.useRef<HTMLButtonElement>();

  const goTo = useCallback(
    (id, type) => {
      navigate(`/${type}/${id}`);
      if (breakpoint === 'base') toggleSidebar();
    },
    [breakpoint],
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setCloseOnBlur(true);
      }, 200);
    } else {
      setCloseOnBlur(false);
    }
  }, [isOpen]);

  return (
    <Popover
      offset={[140, -100]}
      isLazy
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={closeOnBlur}
      initialFocusRef={initRef as React.RefObject<FocusableElement>}
    >
      <PopoverAnchor>{children}</PopoverAnchor>
      {breakpoint === 'base' ? (
        <PopoverContent maxW={{ base: 'calc(60vw)' }}>
          <PopoverHeader fontWeight="semibold" display="flex" alignItems="center">
            <Heading size="md">{t('entities.title')}</Heading>
            <Spacer />
            <IconButton
              aria-label="Close"
              ref={initRef as React.RefObject<HTMLButtonElement>}
              colorScheme="gray"
              onClick={onClose}
              icon={<X size={20} />}
              ms="auto"
            />
          </PopoverHeader>
          <PopoverArrow />
          <PopoverBody overflowX="auto" overflowY="auto" maxH="80vh">
            {tree && !isFetching ? (
              renderList(tree, 0, goTo)
            ) : (
              <Center>
                <Spinner size="lg" />
              </Center>
            )}
          </PopoverBody>
        </PopoverContent>
      ) : (
        <Portal>
          <PopoverContent>
            <PopoverHeader fontWeight="semibold" display="flex" alignItems="center">
              <Heading size="md">{t('entities.title')}</Heading>
              <Spacer />
              <IconButton
                aria-label="Close"
                ref={initRef as React.RefObject<HTMLButtonElement>}
                colorScheme="gray"
                onClick={onClose}
                icon={<X size={20} />}
                ms="auto"
              />
            </PopoverHeader>
            <PopoverArrow />
            <PopoverBody overflowY="auto" maxH="80vh">
              {tree && !isFetching ? (
                renderList(tree, 0, goTo)
              ) : (
                <Center>
                  <Spinner size="lg" />
                </Center>
              )}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
};

export default EntityPopover;
