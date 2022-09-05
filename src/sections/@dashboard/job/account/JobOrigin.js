// Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// React
import { useCallback, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
// @mui
import { Card, Container, Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Delete from '@mui/icons-material/Delete';
// form
import { useForm } from 'react-hook-form';
// components
import { RHFUploadAvatar, FormProvider } from '../../../../components/hook-form';
// MongoDB Realm
import { updateJobWithObId } from '../../../../utils/realm';

// ----------------------------------------------------------------------

JobOrigin.propTypes = {
  job: PropTypes.object,
};

export default function JobOrigin({ job }) {
  const [hasImage, setHasImage] = useState(true);
  console.log(job.origin);
  console.log(hasImage);
  const test =
    job.origin === undefined ||
    'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png';
  console.log(test);

  useEffect(() => {
    if (
      job.origin === undefined ||
      job.origin ===
        'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png'
    ) {
      setHasImage(false);
    }
  }, [job]);

  const storage = getStorage();
  const storageRef = ref(storage, `${job.number}/origin`);

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    origin:
      job?.origin ||
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      updateJobWithObId({ origin: data.origin }, job._id).then((res) => {
        console.log(res);
        enqueueSnackbar('Update success!');
      });
      console.log('this is the data');
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = (origin) => {
    setValue(
      origin,
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png'
    );
    setHasImage(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        uploadBytes(storageRef, file).then(() => {
          getDownloadURL(storageRef).then((url) => {
            setValue('origin', url);
            job.origin = url;
            setHasImage(true);
          });
        });
      }
    },
    [setValue, storageRef, job]
  );

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card>
              {hasImage ? (
                <img src={getValues('origin')} alt="this is the origin of the job" />
              ) : (
                <RHFUploadAvatar name="origin" maxSize={3145728} onDrop={handleDrop} />
              )}
            </Card>
            <Button variant="contained" onClick={() => handleDelete('origin')}>
              <Delete />
            </Button>
          </Grid>
        </Grid>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}
