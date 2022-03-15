import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Flex,
  IconButton,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Box,
  Center,
  Spinner,
  Heading,
  useBreakpoint,
} from '@chakra-ui/react';
import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useTable, usePagination, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from 'components/LoadingOverlay';
import SortIcon from './SortIcon';

const propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      Header: PropTypes.string.isRequired,
      Footer: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  count: PropTypes.number,
  setPageInfo: PropTypes.func,
  isLoading: PropTypes.bool,
  obj: PropTypes.string.isRequired,
  sortBy: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      desc: PropTypes.bool.isRequired,
    }),
  ),
  hiddenColumns: PropTypes.arrayOf(PropTypes.string),
  hideControls: PropTypes.bool,
  minHeight: PropTypes.string,
  fullScreen: PropTypes.bool,
  isManual: PropTypes.bool,
};

const defaultProps = {
  count: null,
  setPageInfo: null,
  isLoading: false,
  minHeight: null,
  fullScreen: false,
  sortBy: [],
  hiddenColumns: [],
  hideControls: false,
  isManual: false,
};

const DataTable = ({
  columns,
  data,
  isLoading,
  obj,
  minHeight,
  fullScreen,
  sortBy,
  hiddenColumns,
  hideControls,
  count,
  setPageInfo,
  isManual,
}) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const textColor = useColorModeValue('gray.700', 'white');
  const [queryPageSize, setQueryPageSize] = useState(10);

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setHiddenColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { sortBy, pagination: !hideControls },
      manualPagination: isManual,
      pageCount: isManual ? Math.ceil(count / queryPageSize) : null,
    },
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    if (setPageInfo && pageIndex !== undefined)
      setPageInfo({ index: pageIndex, limit: queryPageSize });
  }, [queryPageSize, pageIndex]);

  useEffect(() => {
    setQueryPageSize(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setHiddenColumns(hiddenColumns);
  }, [hiddenColumns]);

  // If this is a manual DataTable, with a page index that is higher than 0 and higher than the max possible page, we send to index 0
  useEffect(() => {
    if (
      isManual &&
      data &&
      isManual &&
      pageIndex > 0 &&
      Math.ceil(count / queryPageSize) - 1 < pageIndex
    ) {
      gotoPage(0);
      setPageInfo({ index: 0, limit: queryPageSize });
    }
  }, [count, queryPageSize, page, data]);

  const computedMinHeight = () => {
    if (fullScreen) return { base: 'calc(100vh - 360px)', md: 'calc(100vh - 288px)' };
    return minHeight;
  };

  if (isLoading && data.length === 0) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }
  // Render the UI for your table
  return (
    <>
      <Box minHeight={computedMinHeight()} position="relative">
        <LoadingOverlay isLoading={isManual && isLoading}>
          <Table {...getTableProps()} size="small" textColor={textColor} w="100%">
            <Thead fontSize="14px">
              {headerGroups.map((group) => (
                <Tr {...group.getHeaderGroupProps()} key={createUuid()}>
                  {group.headers.map((column) => (
                    <Th
                      key={createUuid()}
                      color="gray.400"
                      {...column.getHeaderProps()}
                      minWidth={column.customMinWidth ?? null}
                      maxWidth={column.customMaxWidth ?? null}
                      width={column.customWidth ?? null}
                    >
                      <div
                        {...column.getSortByToggleProps()}
                        style={{ alignContent: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}
                      >
                        {column.render('Header')}
                        <SortIcon
                          isSorted={column.isSorted}
                          isSortedDesc={column.isSortedDesc}
                          canSort={column.canSort}
                        />
                      </div>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            {data.length > 0 && (
              <Tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={createUuid()}>
                      {row.cells.map((cell) => (
                        <Td
                          key={createUuid()}
                          px={1}
                          minWidth={cell.column.customMinWidth ?? null}
                          maxWidth={cell.column.customMaxWidth ?? null}
                          width={cell.column.customWidth ?? null}
                          textOverflow="ellipsis"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          fontSize="14px"
                          textAlign={cell.column.isCentered ? 'center' : null}
                          fontFamily={cell.column.isMonospace ? 'monospace' : null}
                        >
                          {cell.render('Cell')}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
              </Tbody>
            )}
          </Table>
          {!isLoading && data.length === 0 && (
            <Center>
              <Heading pt={12}>{t('common.no_obj_found', { obj })}</Heading>
            </Center>
          )}
        </LoadingOverlay>
      </Box>
      {!hideControls && (
        <Flex justifyContent="space-between" m={4} alignItems="center">
          <Flex>
            <Tooltip label={t('table.first_page')}>
              <IconButton
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label={t('table.previous_page')}>
              <IconButton
                onClick={previousPage}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems="center">
            {breakpoint !== 'base' && (
              <>
                <Text flexShrink="0" mr={8}>
                  {t('table.page')}{' '}
                  <Text fontWeight="bold" as="span">
                    {pageIndex + 1}
                  </Text>{' '}
                  {t('common.of')}{' '}
                  <Text fontWeight="bold" as="span">
                    {pageOptions.length}
                  </Text>
                </Text>
                <Text flexShrink="0">{t('table.go_to_page')}</Text>{' '}
                <NumberInput
                  ml={2}
                  mr={8}
                  w={28}
                  min={1}
                  max={pageOptions.length}
                  onChange={(value) => {
                    const newPage = value ? value - 1 : 0;
                    gotoPage(newPage);
                  }}
                  defaultValue={pageIndex + 1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </>
            )}
            <Select
              w={32}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((opt) => (
                <option key={createUuid()} value={opt}>
                  {t('common.show')} {opt}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex>
            <Tooltip label={t('table.next_page')}>
              <IconButton
                onClick={nextPage}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label={t('table.last_page')}>
              <IconButton
                onClick={() => gotoPage(pageCount - 1)}
                isDisabled={!canNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </>
  );
};

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
