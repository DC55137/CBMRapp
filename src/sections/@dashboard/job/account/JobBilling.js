import PropTypes from 'prop-types';
// @mui
import { Container } from '@mui/material';
//
import JobBillingInvoiceHistory from './JobBillingInvoiceHistory';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
  invoices: PropTypes.array,
  job: PropTypes.object,
};

export default function AccountBilling({ invoices, job }) {
  return (
    <Container>
      <JobBillingInvoiceHistory invoices={invoices} job={job} />
    </Container>
  );
}
