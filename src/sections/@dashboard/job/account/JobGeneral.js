// MongoDB
import * as Realm from 'realm-web';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

JobGeneral.propTypes = {
  job: PropTypes.object,
};

export default function JobGeneral({ job }) {
  const { enqueueSnackbar } = useSnackbar();

  const stages = ['lead', 'inspect', 'schedule', 'commence', 'completed', 'followup', 'missed'];

  const UpdateJobSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: job?.name || '',
    id: job?._id || '',
    number: job?.number || '',
    email: job?.email || '',
    mobile: job?.mobile || '',
    stage: job?.stage || '',
    address: job?.address || '',
    notes: job?.notes || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateJobSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    async function saveData() {
      // add your Realm App Id to the .env.local file
      const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        return await user.functions.updateJob(job._id, data);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    try {
      saveData()
        .then((res) => {
          console.log(res);
        })
        .then(() => {
          enqueueSnackbar('Create success!');
        });
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     if (file) {
  //       setValue(
  //         'photoURL',
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file),
  //         })
  //       );
  //     }
  //   },
  //   [setValue]
  // );
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            rowGap: 3,
            columnGap: 2,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <RHFTextField name="name" label="Name" />
          <RHFTextField name="number" label="Number" />
          <RHFTextField name="email" label="Email Address" />

          <RHFTextField name="mobile" label="Mobile" />
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
        </Stack>
      </Card>
    </FormProvider>
  );
}
