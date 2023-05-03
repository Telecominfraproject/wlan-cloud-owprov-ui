import * as React from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text,
  Textarea,
  useBreakpoint,
  useToast,
} from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import DataTable from 'components/DataTable';
import FormattedDate from 'components/FormattedDate';
import { useGetVenue, useUpdateVenue } from 'hooks/Network/Venues';
import { Note } from 'models/Note';
import { Column } from 'models/Table';

const VenueNotes = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const getVenue = useGetVenue({ id });
  const [newNote, setNewNote] = React.useState('');
  const updateVenue = useUpdateVenue({ id });
  const toast = useToast();
  const breakpoint = useBreakpoint();

  const onNoteChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  }, []);

  const onNoteSubmit = React.useCallback(
    (onClose: () => void) => () => {
      updateVenue.mutateAsync(
        {
          params: { id, notes: [{ note: newNote, created: 0 }] },
        },
        {
          onSuccess: () => {
            toast({
              id: 'entity-update-success',
              title: t('common.success'),
              description: t('venues.update_success'),
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            onClose();
            setNewNote('');
          },
        },
      );
    },
    [newNote],
  );

  const notes = React.useMemo(
    () => getVenue.data?.notes?.sort(({ created: a }, { created: b }) => b - a) ?? [],
    [getVenue.data, getVenue.data?.notes],
  );

  const dateCell = React.useCallback((created: number) => <FormattedDate date={created} />, []);
  const noteCell = React.useCallback(
    (note: string) => (
      <Text w="100%" overflowWrap="break-word" whiteSpace="pre-wrap">
        {note}
      </Text>
    ),
    [],
  );

  const columns: Column<Note>[] = React.useMemo(
    () => [
      {
        id: 'created',
        Header: t('common.date'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }: { cell: { row: { original: { created: number } } } }) => dateCell(cell.row.original.created),
        customWidth: '150px',
      },
      {
        id: 'note',
        Header: t('common.note'),
        Cell: ({ cell }: { cell: { row: { original: { note: string } } } }) => noteCell(cell.row.original.note),
        Footer: '',
        accessor: 'note',
      },
      {
        id: 'by',
        Header: t('common.by'),
        Footer: '',
        accessor: 'createdBy',
        customWidth: '200px',
      },
    ],
    [dateCell],
  );
  return (
    <Card>
      <CardHeader>
        <Heading size="md" my="auto">
          {t('common.notes')}
        </Heading>
        <Spacer />
        <Popover trigger="click" placement="auto">
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  aria-label={`${t('crud.add')} ${t('common.note')}`}
                  icon={<Plus size={20} />}
                  colorScheme="blue"
                />
              </PopoverTrigger>
              <PopoverContent w={breakpoint === 'base' ? 'calc(80vw)' : '500px'}>
                <PopoverArrow />
                <PopoverCloseButton alignContent="center" mt={1} />
                <PopoverHeader display="flex">{t('profile.add_new_note')}</PopoverHeader>
                <PopoverBody>
                  <Box>
                    <Textarea h="100px" placeholder="Your new note" value={newNote} onChange={onNoteChange} />
                  </Box>
                  <Center mt={2}>
                    <Button
                      colorScheme="blue"
                      isDisabled={newNote.length === 0}
                      onClick={onNoteSubmit(onClose)}
                      isLoading={updateVenue.isLoading}
                    >
                      {t('crud.add')}
                    </Button>
                  </Center>
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      </CardHeader>
      <CardBody display="block">
        <Box overflow="auto" h="300px">
          <DataTable
            columns={columns as Column<object>[]}
            data={notes}
            obj={t('common.notes')}
            sortBy={[
              {
                id: 'created',
                desc: true,
              },
            ]}
            minHeight="200px"
            hideControls
            showAllRows
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default VenueNotes;
