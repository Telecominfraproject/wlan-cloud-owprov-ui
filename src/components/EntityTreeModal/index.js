import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton, CPopover } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import { useHistory } from 'react-router-dom';
import { useAuth, EntityTree } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import createLayoutedElements from './dagreAdapter';
import { entityStyle, node, venueStyle, worldStyle } from './nodes';

const iterateThroughTree = (el) => {
  let newArray = [];

  if (el.type === 'entity') {
    newArray.push({
      id: `${el.type}/${el.uuid}`,
      data: { label: node(el) },
      position: { x: 0, y: 200 },
      type: 'default',
      style: el.uuid === '0000-0000-0000' ? worldStyle : entityStyle,
    });

    // Creating edges for children and venues
    for (const child of el.children) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrowclosed',
      });
    }
    for (const child of el.venues) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrowclosed',
      });
    }

    // Creating children/venue elements
    let childrenArray = [];
    for (const child of el.children) {
      childrenArray = childrenArray.concat(iterateThroughTree(child));
    }
    for (const child of el.venues) {
      childrenArray = childrenArray.concat(iterateThroughTree(child));
    }
    newArray = newArray.concat(childrenArray);
  } else {
    newArray.push({
      id: `${el.type}/${el.uuid}`,
      data: { label: node(el) },
      position: { x: 0, y: 200 },
      type: 'default',
      style: venueStyle,
    });

    for (const child of el.children) {
      newArray.push({
        id: `edge/${el.uuid}/${child.uuid}`,
        source: `${el.type}/${el.uuid}`,
        target: `${child.type}/${child.uuid}`,
        arrowHeadType: 'arrowclosed',
      });
    }

    for (const child of el.children) {
      newArray = newArray.concat(iterateThroughTree(child));
    }
  }

  return newArray;
};

const EntityTreeModal = ({ show, toggle }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { endpoints, currentToken } = useAuth();
  const [tree, setTree] = useState([]);

  const parseData = (data) => {
    const newTree = iterateThroughTree(data, history);
    setTree(newTree);
  };

  const getTree = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity?getTree=true`, options)
      .then((response) => {
        parseData(response.data);
      })
      .catch(() => {
        // throw new Error('Error while fetching entity for edit');
      });
  };

  useEffect(() => {
    if (show) getTree();
  }, [show]);

  return (
    <CModal size="xl" show={show} onClose={toggle}>
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('entity.entire_tree')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <EntityTree
          show={show}
          elements={createLayoutedElements(tree, 220, 40)}
          setElements={setTree}
          history={history}
          toggle={toggle}
        />
      </CModalBody>
    </CModal>
  );
};

EntityTreeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default EntityTreeModal;
