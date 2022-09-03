import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Link, Button, Typography } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

AccountBillingInvoiceHistory.propTypes = {
  job: PropTypes.object,
};

export default function AccountBillingInvoiceHistory({ job }) {
  console.log(job.invoices);
  const invoices = job.invoices.filter((o) => o);
  console.log(invoices);
  return (
    <Stack spacing={3} alignItems="flex-end">
      <Typography variant="subtitle1" sx={{ width: 1 }}>
        Invoice History
      </Typography>

      <Stack spacing={2} sx={{ width: 1 }}>
        {invoices.map((invoice) => (
          <Stack key={invoice._id} direction="row" justifyContent="space-between" sx={{ width: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 160 }}>
              {invoice.name}
            </Typography>
            <Typography variant="body2" sx={{ minWidth: 160 }}>
              {fDate(invoice.date)}
            </Typography>
            <Typography variant="body2">{fCurrency(invoice.amount)}</Typography>
            <Link component={RouterLink} to="#">
              PDF
            </Link>
          </Stack>
        ))}
      </Stack>

      <Typography variant="body2">
        Total Cost <strong>{fCurrency(invoices.reduce((sum, invoice) => sum + invoice.amount, 0))}</strong>
      </Typography>
      {job.price && (
        <Typography variant="body2">
          Revenue <strong>{fCurrency(job.price - invoices.reduce((sum, invoice) => sum + invoice.amount, 0))}</strong>
        </Typography>
      )}
      <Button size="small" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
        All invoices
      </Button>
    </Stack>
  );
}
