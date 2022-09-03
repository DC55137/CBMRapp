import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { saveData, deleteDocumentIdString } from '../../../../utils/realm';

// ----------------------------------------------------------------------

AccountGeneral.propTypes = {
  job: PropTypes.object,
};

export default function AccountGeneral({ job }) {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const nameNoSpace = job.name.replace(/\s+/g, '');

  const location = `/Users/cbroofing/Library/Mobile Documents/com~apple~CloudDocs/Documents/CBRoofing/Jobs/all/${job.number}-${nameNoSpace}`;

  const stages = ['toAction', 'lead', 'inspect', 'schedule', 'commence', 'completed', 'followup', 'missed'];

  const navigate = useNavigate();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    id: id || '',
    name: job?.name || '',
    email: job?.email || '',
    mobile: job?.mobile || '',
    stage: job?.stage || '',
    address: job?.address || '',
    notes: job?.notes || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      saveData(data)
        .then((res) => {
          console.log(res);
        })
        .then(() => {
          enqueueSnackbar('Update success!');
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteJob = () => {
    if (window.confirm('are you sure you want to delete?')) {
      deleteDocumentIdString(id).then(() => {
        navigate(PATH_DASHBOARD.job.root);
      });
    }
  };

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value);
    enqueueSnackbar(`Copied "${value}"`);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Button onClick={() => handleCopyValue(location)}>File Location</Button>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="email" label="Email Address" />

              <RHFTextField name="mobile" label="Phone Number" />
              <RHFTextField name="address" label="Address" />

              <RHFSelect name="stage" label="Stage" placeholder="Stage">
                {stages.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="notes" multiline rows={10} label="Notes" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
              <Button color="error" variant="contained" onClick={handleDeleteJob}>
                Delete
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
