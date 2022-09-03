// React
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// MongoDB
import * as Realm from 'realm-web';

// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Typography,
  MenuItem,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs1';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';

// MongoDB Realm
import { MongoDBFetchData, deleteDocument, updateJobWithObId } from '../../utils/realm';

// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
  TableMoreMenu,
} from '../../components/table';
// sections
import { JobTableRow, JobTableToolbar } from '../../sections/@dashboard/job/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'number', label: 'Client', align: 'left', width: 150, minWidth: 150 },
  { id: 'address', label: 'Address', align: 'left', width: 350, minWidth: 350 },
  { id: 'Mobile', label: 'Mobile', align: 'left', width: 100 },
  { id: 'email', label: 'Email', align: 'left', width: 100 },
];

// ----------------------------------------------------------------------

export default function InvoiceList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenu, setOpenMenuActions] = useState(null);

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'number' });

  const [filterName, setFilterName] = useState('');

  const { currentTab: filterStage, onChangeTab: onfilterStage } = useTabs('lead', setPage);

  useEffect(() => {
    MongoDBFetchData()
      .then((res) => {
        setJobs(res);
      })
      .then(() => setTimeout(setIsLoading(false), 0));
  }, []);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  const handleDeleteRow = (_id) => {
    const deleteRow = jobs.filter((row) => row._id !== _id);
    setSelected([]);
    setJobs(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    if (window.confirm('are you sure you want to delete?')) {
      const notDeletedRows = jobs.filter((row) => !selected.includes(row._id));
      const deletedRows = jobs.filter((row) => selected.includes(row._id));
      setSelected([]);
      if (page * rowsPerPage >= dataFiltered.length) {
        setPage(0);
      }
      setJobs(notDeletedRows);
      deletedRows.forEach((row) => {
        deleteDocument(row._id).then((res) => {
          console.log(res);
        });
        console.log(row._id);
      });
    }
  };

  const handleUpdateRow = (location) => {
    if (window.confirm(`are you sure you want to move to ${location}?`)) {
      const sendRows = jobs.filter((row) => selected.includes(row._id));
      setSelected([]);
      if (page * rowsPerPage >= dataFiltered.length) {
        setPage(0);
      }
      sendRows.forEach((row) => {
        row.stage = location;
        updateJobWithObId({ stage: location }, row._id).then((res) => {
          console.log(res);
        });
        console.log(row._id);
      });
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.job.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.job.view(id));
  };

  const dataFiltered = applySortFilter({
    jobs,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStage,
  });

  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStage);

  const denseHeight = dense ? 56 : 76;

  const getLengthByStatus = (status) => jobs.filter((item) => item.stage === status).length;

  const TABS = [
    { value: 'toAction', label: 'Action', color: 'error', count: getLengthByStatus('toAction') },
    { value: 'lead', label: 'Lead', color: 'warning', count: getLengthByStatus('lead') },
    { value: 'inspect', label: 'Inspect', color: 'warning', count: getLengthByStatus('inspect') },
    { value: 'schedule', label: 'Schedule', color: 'info', count: getLengthByStatus('schedule') },
    { value: 'completed', label: 'Completed', color: 'success', count: getLengthByStatus('completed') },
    { value: 'followup', label: 'FollowUp', color: 'default', count: getLengthByStatus('followup') },
    { value: 'missed', label: 'Missed', color: 'default', count: getLengthByStatus('missed') },
    { value: 'all', label: 'All', color: 'default', count: jobs.length },
  ];

  return (
    <Page title="Jobs: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Jobs List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'jobs' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.job.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Job
            </Button>
          }
        />
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Card>
            {filterName === '' && (
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={filterStage}
                onChange={onfilterStage}
                sx={{ px: 2, bgcolor: 'background.neutral' }}
              >
                {TABS.map((tab) => (
                  <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    icon={<Label color={tab.color}> {tab.count} </Label>}
                    label={tab.label}
                  />
                ))}
              </Tabs>
            )}

            <Divider />

            <JobTableToolbar filterName={filterName} onFilterName={handleFilterName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  // pretty interesting ability. Can do the same action to many jobs. I still don't know how it is initially hidden
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={dataFiltered.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row._id)
                      )
                    }
                    actions={
                      <Stack spacing={1} direction="row">
                        <Tooltip title="Sent">
                          <TableMoreMenu
                            open={openMenu}
                            onOpen={handleOpenMenu}
                            onClose={handleCloseMenu}
                            actions={
                              <>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('toAction');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  toAction
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('lead');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  Lead
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('inspect');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  Inspect
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('schedule');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  Schedule
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('completed');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  Completed
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('followup');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  FollowUp
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    handleUpdateRow('missed');
                                    handleCloseMenu();
                                  }}
                                >
                                  <Iconify icon={'ic:round-send'} />
                                  Missed
                                </MenuItem>
                              </>
                            }
                          />
                        </Tooltip>

                        <Tooltip title="Download">
                          <IconButton color="primary">
                            <Iconify icon={'eva:download-outline'} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                            <Iconify icon={'eva:trash-2-outline'} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        jobs.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <JobTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                      />
                    ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
              />
            </Box>
          </Card>
        )}
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ jobs, comparator, filterName, filterStage }) {
  const stabilizedThis = jobs.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  jobs = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    jobs = jobs.filter(
      (item) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.mobile.replace(/\s/g, '').toLowerCase().indexOf(filterName.replace(/\s/g, '').toLowerCase()) !== -1 ||
        item.address.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
    filterStage = 'all';
  }

  if (filterStage !== 'all') {
    jobs = jobs.filter((item) => item.stage === filterStage);
  }

  return jobs;
}
