import * as React from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { Buildings } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CreateVenueModal from 'components/Tables/VenueTable/CreateVenueModal';
import { useGetSelectVenues, useGetVenue } from 'hooks/Network/Venues';
import { Entity } from 'models/Entity';

type Props = {
  id: string;
};

const VenueDropdown = ({ id }: Props) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const getVenue = useGetVenue({ id });
  const getChildren = useGetSelectVenues({ select: getVenue.data?.children ?? [] });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const goToVenue = (venueId: string) => () => navigate(`/venue/${venueId}`);

  const amount = getVenue.data?.children.length ?? 0;

  const isCompact = breakpoint === 'base' || breakpoint === 'sm';

  return (
    <>
      <Menu>
        <Tooltip label={`${t('venues.sub_other')} (${amount})`}>
          {isCompact ? (
            <MenuButton
              as={IconButton}
              icon={<Buildings size={20} />}
              aria-label={`${t('venues.sub_other')} (${amount})`}
              colorScheme="purple"
              isDisabled={!getVenue.data}
            />
          ) : (
            <MenuButton
              as={Button}
              aria-label={`${t('venues.sub_other')} (${amount})`}
              colorScheme="purple"
              isDisabled={!getVenue.data}
            >{`${t('venues.sub_other')} (${amount})`}</MenuButton>
          )}
        </Tooltip>
        <MenuList>
          <MenuItem onClick={onOpen} isDisabled={id === '0000-0000-0000'}>
            {id === '0000-0000-0000' ? t('entities.venues_under_root') : t('common.create')}
          </MenuItem>
          <MenuDivider hidden={amount === 0} />
          {getChildren.data
            ?.sort((a: Entity, b: Entity) => a.name.localeCompare(b.name))
            .map(({ id: venueId, name }: Entity) => (
              <MenuItem key={venueId} onClick={goToVenue(venueId)}>
                {name}
              </MenuItem>
            )) ?? []}
        </MenuList>
      </Menu>
      <CreateVenueModal isOpen={isOpen} onClose={onClose} parentId={id} />
    </>
  );
};

export default VenueDropdown;
