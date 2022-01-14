import React from 'react';
import PropTypes from 'prop-types';
import { CButton, CPopover, CLabel, CCardHeader, CButtonToolbar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilAlignCenter,
  cilLibraryAdd,
  cilPencil,
  cilPlus,
  cilSave,
  cilSync,
  cilTrash,
  cilX,
} from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const TreeHeader = ({
  myMaps,
  othersMaps,
  chooseMap,
  treeInfo,
  toggleDuplicateModal,
  resetLayout,
  isDefault,
  toggleDefault,
  refreshTree,
  toggleDelete,
  toggleEditing,
  startDuplicateFromNode,
  mode,
  saveMap,
}) => {
  const { t } = useTranslation();

  return (
    <CCardHeader className="dark-header">
      <div className="text-value-lg float-left">{t('entity.entire_tree')}</div>
      <div className="text-right float-right">
        <CButtonToolbar role="group" className="justify-content-end">
          {isDefault ? (
            <CPopover content="Make this map not your default">
              <CButton className="mr-2 p-1" color="light" onClick={toggleDefault}>
                Default Map
                <CIcon className="ml-1" content={cilX} />
              </CButton>
            </CPopover>
          ) : (
            <CButton className="mr-2 p-1" color="info" onClick={toggleDefault}>
              Set as Default
            </CButton>
          )}
          <CLabel className="mr-2 pt-2" htmlFor="deviceType">
            {t('common.current')}
          </CLabel>
          <div style={{ width: '300px', zIndex: '1028' }} className="text-dark text-left">
            <Select
              name="TreeMaps"
              options={[
                { label: 'Auto-Map', value: '' },
                {
                  label: 'My Maps',
                  options: myMaps.map((m) => ({ value: m.id, label: m.name })),
                },
                {
                  label: 'Maps Created By Others',
                  options: othersMaps.map((m) => ({ value: m.id, label: m.name })),
                },
              ]}
              onChange={(c) => chooseMap(c.value)}
              value={{ value: treeInfo.id, label: treeInfo.name }}
              formatGroupLabel={formatGroupLabel}
            />
          </div>
          <CPopover content={t('entity.duplicate_from_node')}>
            <CButton
              color="info"
              className="ml-2"
              onClick={startDuplicateFromNode}
              disabled={mode !== 'view'}
            >
              <CIcon content={cilLibraryAdd} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.duplicate')}>
            <CButton
              color="info"
              className="ml-2"
              onClick={toggleDuplicateModal}
              disabled={mode !== 'view'}
            >
              <CIcon content={cilPlus} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.save')}>
            <CButton
              color="info"
              className="ml-2"
              onClick={saveMap}
              disabled={treeInfo.id === '' || mode !== 'edit'}
            >
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content="Automatically Align Map">
            <CButton color="info" className="ml-2" onClick={resetLayout} disabled={mode !== 'edit'}>
              <CIcon content={cilAlignCenter} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.edit')}>
            <CButton
              color="light"
              className="ml-2"
              onClick={toggleEditing}
              disabled={treeInfo.id === '' || mode !== 'view'}
            >
              <CIcon content={cilPencil} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.stop_editing')}>
            <CButton
              color="light"
              className="ml-2"
              onClick={toggleEditing}
              disabled={treeInfo.id === '' || mode === 'view'}
            >
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.refresh')}>
            <CButton color="info" className="ml-2" onClick={refreshTree} disabled={mode !== 'view'}>
              <CIcon content={cilSync} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.delete')}>
            <CButton
              color="danger"
              className="ml-2"
              onClick={toggleDelete}
              disabled={treeInfo.id === ''}
            >
              <CIcon content={cilTrash} />
            </CButton>
          </CPopover>
        </CButtonToolbar>
      </div>
    </CCardHeader>
  );
};

TreeHeader.propTypes = {
  myMaps: PropTypes.instanceOf(Array).isRequired,
  othersMaps: PropTypes.instanceOf(Array).isRequired,
  chooseMap: PropTypes.func.isRequired,
  treeInfo: PropTypes.instanceOf(Object).isRequired,
  toggleDuplicateModal: PropTypes.func.isRequired,
  resetLayout: PropTypes.func.isRequired,
  isDefault: PropTypes.bool.isRequired,
  toggleDefault: PropTypes.func.isRequired,
  refreshTree: PropTypes.func.isRequired,
  toggleDelete: PropTypes.func.isRequired,
  toggleEditing: PropTypes.func.isRequired,
  startDuplicateFromNode: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  saveMap: PropTypes.func.isRequired,
};
export default TreeHeader;
