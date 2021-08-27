/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import {
  CSidebar,
  CCreateElement,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarNav,
  CButton,
  CCollapse,
} from '@coreui/react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { set as lodashSet, get as lodashGet } from 'lodash';
import { useToast, useAuth, useEntityBrowser } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';
import SidebarDropdown from './SidebarDropdown';
import SidebarChildless from './SidebarChildless';

const navbarOption = (name, uuid, selectEntity, children, childrenIds, path) => {
  let tag = 'SidebarChildless';
  if (children) tag = 'SidebarDropdown';

  return {
    key: uuid,
    uuid,
    _tag: tag,
    name,
    path,
    onClick: () => selectEntity(uuid, name, childrenIds, path),
    _children: children,
  };
};

const EntityBrowser = ({ setEntity }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { setSelectedEntity } = useEntityBrowser();
  const { addToast } = useToast();
  const [show, setShow] = useState(false);
  const [entities, setEntities] = useState([]);
  const [entityToRetrieve, setEntityToRetrieve] = useState(null);
  const [parentsWithChildrenLoaded, setParentsWithChildrenLoaded] = useState([]);

  const selectEntity = (uuid, name, childrenIds, path) => {
    // If we have not yet gotten the information of this entity's children, we get them now
    if (childrenIds) {
      setEntityToRetrieve({ childrenIds, path, uuid });
    }
    setSelectedEntity({
      uuid,
      name,
      childrenIds,
      path,
    });
    setEntity({
      uuid,
      name,
      childrenIds,
      path,
    });
  };

  const getEntity = async (id) => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity/${id}`, options)
      .then((response) => response.data)
      .catch(() => {
        throw new Error('Error while fetching entities');
      });
  };

  const getEntityChildren = async (parent) => {
    const loadedParents = parentsWithChildrenLoaded;
    const basePath = `${parent.path}._children.`;
    const parentInfo = lodashGet(entities, parent.path);
    setParentsWithChildrenLoaded([]);

    // Getting the information of each child
    const promises = [];
    for (const id of parent.childrenIds) {
      promises.push(getEntity(id));
    }

    try {
      const results = await Promise.all(promises);
      const newOptions = results.map((result, resultIndex) => {
        if (result.children.length === 0) {
          return navbarOption(
            result.name,
            result.id,
            selectEntity,
            undefined,
            undefined,
            `${basePath}[${resultIndex}]`,
          );
        }
        const grandChildrenIds = result.children;
        let nestedOptions = result.children.map((nested, index) =>
          navbarOption(
            '',
            nested,
            selectEntity,
            undefined,
            undefined,
            `${basePath}${resultIndex}.[${index}]`,
          ),
        );

        // If there is a child of this function's 'parent' parameter for which we already loaded children, we keep the old values
        if (parentsWithChildrenLoaded.includes(result.id)) {
          const oldInformation = parentInfo._children.find((e) => e.uuid === result.id);
          if (oldInformation) {
            nestedOptions = oldInformation._children;
          }
        }

        return navbarOption(
          result.name,
          result.id,
          selectEntity,
          nestedOptions,
          grandChildrenIds,
          `${basePath}[${resultIndex}]`,
        );
      });
      const newEntities = entities;
      lodashSet(newEntities, `${parent.path}._children`, newOptions);

      setEntities([...newEntities]);
      setParentsWithChildrenLoaded([...loadedParents, parent.uuid]);
    } catch (e) {
      throw new Error('Error while fetching children');
    }
  };

  const getRoot = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity/0000-0000-0000`, options)
      .then((response) => {
        const rootChildren = response.data.children.map((nested, index) =>
          navbarOption('', nested, selectEntity, undefined, undefined, `[0]._children.[${index}]`),
        );

        setEntities([
          navbarOption(
            response.data.name,
            '0000-0000-0000',
            selectEntity,
            rootChildren,
            response.data.children,
            '[0]',
          ),
        ]);
      })
      .catch((e) => {
        // If the root does not exist, trigger the root creation process
        if (
          e.response &&
          e.response.data.ErrorCode !== undefined &&
          e.response.data.ErrorCode === 404
        ) {
          // setRootEntityMissing(true);
        } else {
          addToast({
            title: t('common.error'),
            body: t('entity.error_fetching'),
            color: 'danger',
            autohide: true,
          });
        }
      });
  };

  const refresh = () => {
    setEntities([]);
    setParentsWithChildrenLoaded([]);
    getRoot();
  };

  const toggleShow = () => {
    if (!show) refresh();
    setShow(!show);
  };

  useEffect(() => {
    setEntities([]);
    setParentsWithChildrenLoaded([]);
    getRoot();
  }, []);

  useEffect(() => {
    if (entityToRetrieve && !parentsWithChildrenLoaded.includes(entityToRetrieve.uuid))
      getEntityChildren(entityToRetrieve);
  }, [entityToRetrieve]);

  return (
    <div>
      <CCollapse show={show}>
        <CSidebar
          show
          dropdownMode="noAction"
          style={{ position: 'unset', margin: 'unset', flex: 'unset', width: '100%' }}
        >
          <CSidebarNav>
            <CCreateElement
              items={entities}
              components={{
                SidebarChildless,
                SidebarDropdown,
                CButton,
                CSidebarNavDivider,
                CSidebarNavDropdown,
                CSidebarNavItem,
                CSidebarNavTitle,
              }}
            />
          </CSidebarNav>
        </CSidebar>
      </CCollapse>
      <div className="text-center py-2">
        <CButton color="primary" onClick={toggleShow}>
          {show ? (
            <>
              Hide Entities
              <CIcon size="sm" name="cil-arrow-top" content={cilArrowTop} />
            </>
          ) : (
            <>
              Browse Entities
              <CIcon size="sm" name="cil-arrow-bottom" content={cilArrowBottom} />
            </>
          )}
        </CButton>
      </div>
    </div>
  );
};

EntityBrowser.propTypes = {
  setEntity: PropTypes.func.isRequired,
};

export default EntityBrowser;
