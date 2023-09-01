import React from 'react';
import { useAuth } from 'contexts/AuthProvider';

const SETTING_NAME = 'global.favorites';

export type EntityFavorite = {
  id: string;
  type: 'venue' | 'entity';
};

export type SettingValue = {
  entityFavorites: EntityFavorite[];
};

export interface FavoritesProviderReturn {
  entityFavorites: {
    favorites: EntityFavorite[];
    add: (entityFavorite: EntityFavorite) => Promise<void>;
    remove: (entityFavorite: EntityFavorite) => Promise<void>;
  };
}

const FavoritesContext = React.createContext<FavoritesProviderReturn>({
  entityFavorites: {
    favorites: [],
    add: async () => {},
    remove: async () => {},
  },
});

export const FavoritesProvider = ({ children }: { children: React.ReactElement }) => {
  const authContext = useAuth();
  const [favorites, setFavorites] = React.useState<SettingValue>({
    entityFavorites: [],
  });

  const fetchSetting = () => {
    const newFavorites = authContext.getPref(SETTING_NAME);

    if (newFavorites) {
      try {
        setFavorites(JSON.parse(newFavorites));
      } catch (e) {
        authContext.deletePref(SETTING_NAME);
        setFavorites({ entityFavorites: [] });
      }
    }
  };

  const addEntityFavorite = async (entityFavorite: EntityFavorite) => {
    const newEntityFavorites = [...favorites.entityFavorites, entityFavorite];

    setFavorites({ entityFavorites: newEntityFavorites });
    await authContext.setPref({
      preference: SETTING_NAME,
      value: JSON.stringify({ entityFavorites: newEntityFavorites }),
    });
  };

  const removeEntityFavorite = async (entityFavorite: EntityFavorite) => {
    const newEntityFavorites = favorites.entityFavorites.filter(
      (favorite) => favorite.id !== entityFavorite.id || favorite.type !== entityFavorite.type,
    );

    setFavorites({ entityFavorites: newEntityFavorites });
    await authContext.setPref({
      preference: SETTING_NAME,
      value: JSON.stringify({ entityFavorites: newEntityFavorites }),
    });
  };

  const value = React.useMemo(
    () => ({
      entityFavorites: {
        favorites: favorites.entityFavorites,
        add: addEntityFavorite,
        remove: removeEntityFavorite,
      },
    }),
    [favorites.entityFavorites],
  );

  React.useEffect(() => {
    if (authContext.isUserLoaded) {
      fetchSetting();
    }
  }, [authContext.isUserLoaded]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites: () => FavoritesProviderReturn = () => React.useContext(FavoritesContext);
