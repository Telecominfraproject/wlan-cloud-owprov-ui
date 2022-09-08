/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Input, InputGroup, InputRightElement, Tooltip } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Trash } from 'phosphor-react';
import { v4 as uuid } from 'uuid';
import { useAuth } from 'contexts/AuthProvider';
import { Note } from 'models/Note';
import DataTable from 'components/DataTable';
import useFastField from 'hooks/useFastField';
import FormattedDate from 'components/FormattedDate';

export interface NotesFieldProps {
  name?: string;
  isDisabled?: boolean;
  hasDeleteButton?: boolean;
}

const _NotesField: React.FC<NotesFieldProps> = ({ name = 'notes', isDisabled, hasDeleteButton }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { value: notes, onChange: setNotes } = useFastField({ name });
  const [newNote, setNewNote] = useState('');

  const addNoteToForm = () => {
    const newNotes = [
      ...notes,
      {
        note: newNote,
        isNew: true,
        createdBy: user?.email,
        created: Math.floor(new Date().getTime() / 1000),
      },
    ];
    setNotes(newNotes);
    setNewNote('');
  };

  const removeNote = (index: number) => {
    const newArr = [...notes];
    newArr.splice(index, 1);
    setNotes(newArr);
  };

  const memoizedDate = useCallback((cell) => <FormattedDate date={cell.row.values.created} key={uuid()} />, []);

  const removeAction = useCallback(
    (cell) => (
      <Tooltip hasArrow label={t('common.remove')} placement="top">
        <IconButton
          aria-label="Remove Object"
          ml={2}
          colorScheme="red"
          icon={<Trash size={20} />}
          size="sm"
          onClick={() => removeNote(cell.row.index)}
        />
      </Tooltip>
    ),
    [notes],
  );

  const columns = useMemo(() => {
    const cols = [
      {
        id: 'created',
        Header: t('common.date'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }: { cell: unknown }) => memoizedDate(cell),
        customWidth: '150px',
      },
      {
        id: 'note',
        Header: t('common.note'),
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
    ];
    if (hasDeleteButton)
      cols.push({
        id: 'actions',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => removeAction(cell),
      });
    return cols;
  }, [notes]);

  return (
    <>
      <InputGroup mb={6} hidden={isDisabled}>
        <Input
          borderRadius="15px"
          fontSize="sm"
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote(e.target.value)}
          placeholder={t('common.your_new_note')}
          value={newNote}
        />
        <InputRightElement>
          <Tooltip hasArrow label={t('crud.add')} placement="top">
            <IconButton
              aria-label="Add Note"
              colorScheme="blue"
              icon={<AddIcon />}
              onClick={addNoteToForm}
              isDisabled={newNote.length === 0}
            />
          </Tooltip>
        </InputRightElement>
      </InputGroup>
      <DataTable
        columns={columns}
        data={notes.sort((a: Note, b: Note) => b.created - a.created)}
        obj={hasDeleteButton ? undefined : t('common.notes')}
        minHeight="200px"
      />
    </>
  );
};

export const NotesField = React.memo(_NotesField);
