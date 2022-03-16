import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { IconButton, Input, InputGroup, InputRightElement, Tooltip } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAuth } from 'contexts/AuthProvider';
import DataTable from 'components/DataTable';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';

const propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      note: PropTypes.string.isRequired,
      created: PropTypes.number.isRequired,
      createdBy: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setNotes: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

const defaultProps = {
  isDisabled: false,
};

const NotesTable = ({ notes, setNotes, isDisabled }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [newNote, setNewNote] = useState('');

  const addNoteToForm = () => {
    const newNotes = [
      ...notes,
      { note: newNote, isNew: true, createdBy: user.email, created: new Date().getTime() / 1000 },
    ];
    setNotes('notes', newNotes);
    setNewNote('');
  };

  const memoizedDate = useCallback((cell) => <FormattedDate date={cell.row.values.created} key={uuid()} />, []);

  const columns = useMemo(
    () => [
      {
        id: 'created',
        Header: t('common.date'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => memoizedDate(cell),
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
    ],
    [],
  );

  return (
    <>
      <InputGroup my={6} hidden={isDisabled}>
        <Input
          borderRadius="15px"
          fontSize="sm"
          type="text"
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={t('common.your_new_note')}
          value={newNote}
        />
        <InputRightElement>
          <Tooltip hasArrow content={t('crud.add')} placement="top">
            <IconButton
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
        data={notes.sort((a, b) => b.created - a.created)}
        obj={t('common.notes')}
        minHeight="200px"
      />
    </>
  );
};

NotesTable.propTypes = propTypes;
NotesTable.defaultProps = defaultProps;
export default NotesTable;
