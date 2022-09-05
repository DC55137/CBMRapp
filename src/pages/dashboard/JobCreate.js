// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections

import JobNewForm from '../../sections/@dashboard/job/account/JobNewForm';

// ----------------------------------------------------------------------

export default function JobCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Job: Create a new job">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Create a new job'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: 'New user' },
          ]}
        />

        <JobNewForm />
      </Container>
    </Page>
  );
}
