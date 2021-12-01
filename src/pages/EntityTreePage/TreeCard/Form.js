import React from 'react';
import { useTranslation } from 'react-i18next';
import { CRow, CCol, CInput, CInvalidFeedback, CLabel, CSelect } from '@coreui/react';
import PropTypes from 'prop-types';

const TreeForm = ({ user, users, mode, treeInfo, setTreeInfo }) => {
  const { t } = useTranslation();

  return (
    <>
      <CRow className="my-2" hidden={mode !== 'edit'}>
        <CLabel col sm="2" md="2" xl="1" htmlFor="owner">
          {t('common.creator')}
        </CLabel>
        <CCol sm="4" md="4" xl="5" className="pt-2">
          {users.find((u) => u.Id === treeInfo.creator)?.email}
        </CCol>
        <CLabel col sm="2" md="2" xl="1" htmlFor="visibility">
          <div>{t('common.visibility')}:</div>
        </CLabel>
        <CCol sm="4" md="4" xl="5">
          <CSelect
            custom
            id="visibility"
            type="text"
            required
            value={treeInfo.visibility}
            onChange={(e) => setTreeInfo({ ...treeInfo, visibility: e.target.value })}
            disabled={treeInfo.creator !== user.Id}
            style={{ width: '100px' }}
            maxLength="50"
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </CSelect>
        </CCol>
      </CRow>
      <CRow className="my-2" hidden={mode !== 'edit'}>
        <CLabel col sm="2" md="2" xl="1" htmlFor="name">
          {t('user.name')}
        </CLabel>
        <CCol sm="4" md="4" xl="5">
          <CInput
            id="name"
            type="text"
            required
            value={treeInfo.name}
            onChange={(e) => setTreeInfo({ ...treeInfo, name: e.target.value })}
            invalid={treeInfo.name.length === 0}
            disabled={false}
            maxLength="50"
          />
          <CInvalidFeedback>{t('common.required')}</CInvalidFeedback>
        </CCol>
        <CLabel col sm="2" md="2" xl="1" htmlFor="description">
          {t('user.description')}
        </CLabel>
        <CCol sm="4" md="4" xl="5">
          <CInput
            id="name"
            type="description"
            required
            value={treeInfo.description}
            onChange={(e) => setTreeInfo({ ...treeInfo, description: e.target.value })}
            disabled={false}
            maxLength="50"
          />
        </CCol>
      </CRow>
    </>
  );
};

TreeForm.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
  users: PropTypes.instanceOf(Array).isRequired,
  mode: PropTypes.string.isRequired,
  treeInfo: PropTypes.instanceOf(Object).isRequired,
  setTreeInfo: PropTypes.func.isRequired,
};

export default TreeForm;
