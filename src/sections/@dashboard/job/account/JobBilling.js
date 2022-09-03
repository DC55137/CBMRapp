import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Container } from '@mui/material';
//
import AccountBillingAddressBook from './JobBillingAddressBook';
import AccountBillingPaymentMethod from './JobBillingPaymentMethod';
import JobBillingInvoiceHistory from './JobBillingInvoiceHistory';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
  addressBook: PropTypes.array,
  cards: PropTypes.array,
  invoices: PropTypes.array,
};

export default function AccountBilling({ cards, addressBook, invoices, job }) {
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <JobBillingInvoiceHistory invoices={invoices} job={job} />
    </Container>
  );
}
