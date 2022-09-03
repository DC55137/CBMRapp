// React
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as Realm from 'realm-web';
import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Button, TableContainer, Tabs, Tab, TablePagination } from '@mui/material';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// Components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// -------------------------TABS---------------------------------------------

import { categoryTags } from './categoryTags';

const CATEGORY_TABS = categoryTags;

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [Jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const { jobs, isLoading, filteredJobs } = useSelector((state) => state.job);
  // console.log(jobs);
  // console.log(filteredJobs);

  // useEffect(async () => {
  //   dispatch(getJobs());
  //   setTimeout(() => {
  //     console.log(filteredJobs);
  //     console.log(jobs);
  //   }, 0);
  // }, [dispatch]);

  async function fetchData() {
    const app = new Realm.App({ id: process.env.NEXT_PUBLIC_REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const allJobs = await user.functions.getAllJobs();
      setJobs(() => allJobs);
      setFilteredJobs(allJobs);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // add your Realm App Id to the .env.local file
    fetchData();
  }, []);

  const [userList, setUserList] = useState(_userList);

  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [currentTab, setCurrentTab] = useState();

  const handleChangeCategory = (e, value) => {
    setCurrentTab(value);
    setFilteredJobs(Jobs.filter((job) => job.stage === value));
    setPage(0);
    console.log(filteredJobs);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    const deleteUser = userList.filter((user) => user.id !== userId);
    setSelected([]);
    setUserList(deleteUser);
  };
  return (
    <Page title="The starting point for your next project">
      <ContentStyle></ContentStyle>
    </Page>
  );
}
