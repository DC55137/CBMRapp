import { capitalCase } from 'change-case';
// React
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// MongoDB
import * as Realm from 'realm-web';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { AccountGeneral } from '../../sections/@dashboard/user/account';

// sections
import {
  JobGeneral,
  JobBilling,
  JobSocialLinks,
  JobNotifications,
  JobImages,
  JobQuote,
  JobOrigin,
} from '../../sections/@dashboard/job/account';

// ----------------------------------------------------------------------

export default function JobDetails() {
  const [job, setJob] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      // add your Realm App Id to the .env.local file
      const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        return await user.functions.getOneJob(id);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    fetchData()
      .then((res) => {
        setJob(res);
        console.log(res);
      })
      .then(() => {
        setTimeout(setIsLoading(false), 0);
      });
  }, [id]);

  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('general');

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral job={job} />,
    },
    {
      value: 'origin',
      icon: <Iconify icon={'gis:flag-start-b-o'} width={20} height={20} />,
      component: <JobOrigin job={job} />,
    },
    {
      value: 'images',
      icon: <Iconify icon={'akar-icons:image'} width={20} height={20} />,
      component: <JobImages job={job} />,
    },
    {
      value: 'quote/invoice',
      icon: <Iconify icon={'ic:outline-price-change'} width={20} height={20} />,
      component: <JobQuote job={job} />,
    },
    {
      value: 'billing',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <JobBilling cards={_userPayment} addressBook={_userAddressBook} invoices={_userInvoices} job={job} />,
    },
  ];

  return (
    <Page title="Jobs: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: `${job.name} - ${job.number}` }]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />
        {!isLoading ? (
          ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </Page>
  );
}
