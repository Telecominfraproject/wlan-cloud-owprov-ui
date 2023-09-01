import * as React from 'react';
import { useFavorites } from 'contexts/FavoritesProvider';

export type UseEntityFavoriteProps = {
  id: string;
  type: 'venue' | 'entity';
};

export const useEntityFavorite = ({ id, type }: UseEntityFavoriteProps) => {
  const favoriteContext = useFavorites();
  const [isLoading, setIsLoading] = React.useState(false);

  const isFavorite = favoriteContext.entityFavorites.favorites.some(({ id: entityId }) => entityId === id);

  const onFavoriteClick = async () => {
    setIsLoading(true);
    if (isFavorite) {
      await favoriteContext.entityFavorites.remove({ id, type });
    } else {
      await favoriteContext.entityFavorites.add({ id, type });
    }
    setIsLoading(false);
  };

  return {
    isFavorite,
    onFavoriteClick,
    isLoading,
  };
};
