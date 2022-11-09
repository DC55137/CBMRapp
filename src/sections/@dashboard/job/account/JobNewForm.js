import * as Yup from 'yup';
// MongoDB
import * as Realm from 'realm-web';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

JobNewForm.propTypes = {};

export default function JobNewForm() {
  const [highestJobNumber, setHighestJobNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function getNumber() {
      // add your Realm App Id to the .env.local file
      const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        return await user.functions.highNoJob();
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    getNumber()
      .then((res) => {
        setHighestJobNumber(res[0].number + 1);
        console.log(res[0].number);
      })
      .then(() => {
        setTimeout(setIsLoading(false), 0);
      });
  }, []);

  const stages = ['toAction', 'lead', 'inspect', 'schedule', 'commence', 'completed', 'followup', 'missed'];

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: '',
    email: '',
    mobile: '',
    stage: 'lead',
    address: '',
    notes: '',
    images: [],
    date: new Date(),
    invoices: [],
    recordDate: [],
    recordStage: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    async function insertNewJob() {
      // add your Realm App Id to the .env.local file
      const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        return await user.functions.newJob({ ...data, number: highestJobNumber });
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    try {
      insertNewJob()
        .then((res) => {
          console.log(res);
        })
        .then(async () => {
          reset();
          enqueueSnackbar('Create success!');
          navigate(PATH_DASHBOARD.job.root);
        });
    } catch (error) {
      console.error(error);
    }
    console.log(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
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
              {!isLoading ? (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Create Job
                </LoadingButton>
              ) : (
                <p>Loading job Number</p>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
