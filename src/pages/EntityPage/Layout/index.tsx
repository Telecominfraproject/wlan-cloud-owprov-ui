import * as React from 'react';
import Masonry from 'react-masonry-css';
import EntityBehaviorsCard from './BehaviorsCard';
import ConfigurationCard from './ConfigurationCard';
import EntityDetails from './EntityDetails';
import EntityLocationContactsCard from './EntityLocationContactsCard';
import EntityNotes from './EntityNotes';
import EntityInventoryCard from './InventoryCard';

type Props = {
  id: string;
};

const EntityPageLayout = ({ id }: Props) => (
  <Masonry
    breakpointCols={{
      default: 3,
      2200: 2,
      1100: 1,
    }}
    className="my-masonry-grid"
    columnClassName="my-masonry-grid_column"
  >
    <EntityDetails id={id} />
    <EntityBehaviorsCard id={id} />
    <EntityInventoryCard id={id} />
    <ConfigurationCard id={id} />
    <EntityLocationContactsCard id={id} />
    <EntityNotes id={id} />
  </Masonry>
);

export default EntityPageLayout;
