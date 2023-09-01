import * as React from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { Box, Tooltip } from '@chakra-ui/react';
import { useEntityFavorite } from 'hooks/useEntityFavorite';

type Props = {
  id: string;
  type: 'venue' | 'entity';
};

const EntityFavoritesButton = ({ id, type }: Props) => {
  const { isFavorite, onFavoriteClick, isLoading } = useEntityFavorite({
    id,
    type,
  });

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onFavoriteClick();
  };

  return (
    <Tooltip label={!isFavorite ? 'Add to favorites' : 'Remove from favorites'}>
      <Box onClick={isLoading ? undefined : onClick} ml={1} mt={-1}>
        <StarIcon color={isFavorite ? 'yellow.300' : 'gray.200'} />
      </Box>
    </Tooltip>
  );
};

export default EntityFavoritesButton;
