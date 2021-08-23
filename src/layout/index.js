import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Footer, PageContainer, ToastProvider, useAuth, useEntity } from 'ucentral-libs';
import routes from 'routes';
import { useHistory } from 'react-router-dom';
import { set as lodashSet, get as lodashGet } from 'lodash';
import axiosInstance from 'utils/axiosInstance';
import Sidebar from './Sidebar';

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

const TheLayout = () => {
  const [showSidebar, setShowSidebar] = useState('responsive');
  const { setEntity } = useEntity();
  const { endpoints, currentToken, user, avatar, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [needCreateRoot, setNeedCreateRoot] = useState(false);
  const [loadedChildren, setLoadedChildren] = useState([]);
  const [lastClicked, setLastClicked] = useState('');
  const [toGet, setToGet] = useState(null);
  const [sidebar, setSidebar] = useState([]);

  const selectEntity = (uuid, name, ids, path) => {
    if (ids) {
      setToGet({
        ids,
        path,
        uuid,
      });
    }
    history.push(`/home/${uuid}`);
    setEntity({
      uuid,
      name,
      ids,
      path,
    });
    setLastClicked(name);
  };

  const getInfo = async (id) => {
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

  const getSidebarOptions = async (ids, parentPath) => {
    const childrenAlreadyLoaded = loadedChildren;
    setLoadedChildren([]);
    const basePath = parentPath === '' ? '' : `${parentPath}._children.`;
    const promises = [];
    for (const id of ids) {
      promises.push(getInfo(id));
    }

    try {
      const parent = lodashGet(sidebar, parentPath);
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
        const childrenIds = [];
        let nestedOptions = result.children.map((nested, index) => {
          childrenIds.push(nested);
          return navbarOption(
            '',
            nested,
            selectEntity,
            undefined,
            undefined,
            `${basePath}${resultIndex}.[${index}]`,
          );
        });
        if (childrenAlreadyLoaded.includes(result.id)) {
          const oldInformation = parent._children.find((entity) => entity.uuid === result.id);
          if (oldInformation) {
            nestedOptions = oldInformation._children;
          }
        }

        return navbarOption(
          result.name,
          result.id,
          selectEntity,
          nestedOptions,
          childrenIds,
          `${basePath}[${resultIndex}]`,
        );
      });

      if (parentPath === '') {
        setSidebar(newOptions);
      } else {
        const newSidebar = sidebar;
        lodashSet(newSidebar, `${parentPath}._children`, newOptions);
        setSidebar([...newSidebar]);
        setLoadedChildren([...childrenAlreadyLoaded, parent.uuid]);
      }
    } catch (e) {
      throw new Error('Error while fetching children');
    }
  };

  const getRoot = () => {
    setNeedCreateRoot(false);
    setSidebar([]);
    setLoadedChildren([]);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owprov}/api/v1/entity/0000-0000-0000`, options)
      .then((response) => {
        const children = response.data.children.map((nested, index) =>
          navbarOption('', nested, selectEntity, undefined, undefined, `[0]._children.[${index}]`),
        );
        setSidebar([
          navbarOption(
            response.data.name,
            '0000-0000-0000',
            selectEntity,
            children,
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
          setNeedCreateRoot(true);
        } else {
          throw new Error('Error while fetching root');
        }
      });
  };

  const refreshEntityChildren = async ({ uuid, path }) => {
    const oldInfo = lodashGet(sidebar, `${path}`);
    const refreshedInfo = await getInfo(uuid);

    // If the button was previously childless, we need to make it be a dropdown
    setLoadedChildren([]);
    if (!oldInfo) {
      getRoot();
    } else {
      // eslint-disable-next-line no-underscore-dangle
      if (oldInfo._tag === 'SidebarChildless' && refreshedInfo.children.length > 0) {
        setSidebar([...lodashSet(sidebar, `${path}`, { ...oldInfo, _tag: 'SidebarDropdown' })]);
      }
      getSidebarOptions(refreshedInfo.children, path);
    }
  };

  const refreshEntity = async (path, newData) => {
    const oldInfo = lodashGet(sidebar, `${path}`);
    setSidebar(lodashSet(sidebar, `${path}`, { ...oldInfo, ...newData }));
  };

  const deleteEntityFromSidebar = async ({ path }) => {
    const splitPath = path.split('.');
    const parentPath = splitPath.slice(0, splitPath.length - 2).join('.');
    const oldInfo = lodashGet(sidebar, `${parentPath}`);
    if (!oldInfo || parentPath === '') {
      getRoot();
    } else {
      const parentInfoFromApi = await getInfo(oldInfo.uuid);
      selectEntity(oldInfo.uuid, oldInfo.name, parentInfoFromApi.children, parentPath);
      if (parentInfoFromApi.children.length === 0) {
        setSidebar(lodashSet(sidebar, `${parentPath}`, { ...oldInfo, _tag: 'SidebarChildless' }));
      } else {
        getSidebarOptions(parentInfoFromApi.children, parentPath);
      }
    }
  };

  useEffect(() => {
    getRoot();
  }, []);

  useEffect(() => {
    if (toGet && !loadedChildren.includes(toGet.uuid)) getSidebarOptions(toGet.ids, toGet.path);
  }, [toGet]);

  return (
    <div className="c-app c-default-layout">
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        logo="assets/OpenWiFi_LogoLockup_WhiteColour.svg"
        options={sidebar}
        redirectTo="/home"
        selected={lastClicked}
        needCreateRoot={needCreateRoot}
        refreshSidebar={getRoot}
        refreshEntity={refreshEntity}
        refreshEntityChildren={refreshEntityChildren}
        deleteEntityFromSidebar={deleteEntityFromSidebar}
      />
      <div className="c-wrapper">
        <Header
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          routes={routes}
          t={t}
          i18n={i18n}
          logout={logout}
          logo="assets/OpenWiFi_LogoLockup_DarkGreyColour.svg"
          authToken={currentToken}
          endpoints={endpoints}
          user={user}
          avatar={avatar}
        />
        <div className="c-body">
          <ToastProvider>
            <PageContainer t={t} routes={routes} redirectTo="/home" />
          </ToastProvider>
        </div>
        <Footer t={t} version="0.8.5" />
      </div>
    </div>
  );
};

export default TheLayout;
