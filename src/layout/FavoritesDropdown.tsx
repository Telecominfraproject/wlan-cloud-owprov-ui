import * as React from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from 'contexts/FavoritesProvider';
import { useGetEntities } from 'hooks/Network/Entity';
import { useGetVenues } from 'hooks/Network/Venues';

const FavoritesDropdown = () => {
  const context = useFavorites();
  const getEntities = useGetEntities();
  const getVenues = useGetVenues();
  const navigate = useNavigate();

  const allFavorites = React.useMemo(() => {
    if (!context.entityFavorites.favorites) return [];
    if (!getEntities.data || !getVenues.data) return [];

    const availableFavorites: {
      label: string;
      destinationPath: string;
    }[] = [];

    for (const favorite of context.entityFavorites.favorites) {
      if (favorite.type === 'entity') {
        const found = getEntities.data.find((entity) => entity.id === favorite.id);

        if (found) {
          availableFavorites.push({
            label: found.name,
            destinationPath: `entity/${found.id}`,
          });
        }
      } else {
        const found = getVenues.data.find((venue) => venue.id === favorite.id);

        if (found) {
          availableFavorites.push({
            label: found.name,
            destinationPath: `venue/${found.id}`,
          });
        }
      }
    }

    return availableFavorites.sort((a, b) => a.label.localeCompare(b.label));
  }, [context.entityFavorites.favorites, getEntities.data, getVenues.data]);

  const navigateTo = (destinationPath: string) => () => {
    navigate(destinationPath);
  };

  return (
    <Menu>
      <Tooltip label={allFavorites.length === 0 ? 'No Favorites' : 'Favorites'}>
        <MenuButton
          background="transparent"
          variant="ghost"
          as={IconButton}
          aria-label="Commands"
          icon={<StarIcon boxSize={5} />}
          size="sm"
          isDisabled={allFavorites.length === 0}
        />
      </Tooltip>
      <MenuList>
        {allFavorites.map((favorite) => (
          <MenuItem key={favorite.destinationPath} onClick={navigateTo(favorite.destinationPath)}>
            {favorite.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default FavoritesDropdown;
