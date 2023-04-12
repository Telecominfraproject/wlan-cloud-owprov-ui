import * as React from 'react';
import { Heading, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CreateEntityModal from '../CreateEntityModal';
import EntityChildrenActions from './EntityChildrenActions';
import Card from 'components/Card';
import CardHeader from 'components/Card/CardHeader';
import EntityTable from 'components/Tables/EntityTable';
import { useGetEntity } from 'hooks/Network/Entity';
import { Entity } from 'models/Entity';

type Props = {
  id: string;
};

const EntityChildren = ({ id }: Props) => {
  const { t } = useTranslation();
  const getEntity = useGetEntity({ id });
  const actions = React.useCallback(
    (cell: { row: { original: Entity } }) => <EntityChildrenActions entity={cell.row.original} isVenue />,
    [],
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md" my="auto">
          {t('entities.sub_other')}
        </Heading>
        <Spacer />
        <CreateEntityModal parentId={getEntity.data?.id ?? ''} />
      </CardHeader>
      <EntityTable select={getEntity.data?.children ?? []} actions={actions} />
    </Card>
  );
};

export default EntityChildren;
