// Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// React
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
// @mui
import { Card, Container, Grid, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Delete from '@mui/icons-material/Delete';
// form
import { useForm } from 'react-hook-form';
// components
import { RHFUploadAvatar, FormProvider } from '../../../../components/hook-form';
// MongoDB Realm
import { updateJobWithObId } from '../../../../utils/realm';

// ----------------------------------------------------------------------

JobImages.propTypes = {
  job: PropTypes.object,
};

export default function JobImages({ job }) {
  const storage = getStorage();
  const storageRef1 = ref(storage, `${job.number}/name1.png`);
  const storageRef2 = ref(storage, `${job.number}/name2.png`);
  const storageRef3 = ref(storage, `${job.number}/name3.png`);
  const storageRef4 = ref(storage, `${job.number}/name4.png`);

  console.log(`${job._id}`);

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    image1:
      job?.images[1] ||
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png',
    image2:
      job?.images[2] ||
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png',
    image3:
      job?.images[3] ||
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png',
    image4:
      job?.images[4] ||
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      updateJobWithObId({ images: ['', data.image1, data.image2, data.image3, data.image4] }, job._id).then((res) => {
        console.log(res);
      });
      job.images = ['', data.image1, data.image2, data.image3, data.image4];
      console.log('this is the data');
      console.log(data);
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = (image) => {
    setValue(
      image,
      'https://res.cloudinary.com/dddxwdp7v/image/upload/v1662016080/cbroofing/Screen_Shot_2022-09-01_at_5.07.39_pm_nlwlao.png'
    );
  };

  const handleDrop1 = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log(acceptedFiles);
      console.log(file);

      if (file) {
        uploadBytes(storageRef1, file).then(() => {
          console.log('downloaded');
          getDownloadURL(storageRef1).then((url) => {
            setValue('image1', url);
          });
        });
      }
    },
    [setValue, storageRef1]
  );

  const handleDrop2 = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log(acceptedFiles);
      console.log(file);

      if (file) {
        uploadBytes(storageRef2, file).then(() => {
          console.log('downloaded');
          getDownloadURL(storageRef2).then((url) => {
            setValue('image2', url);
          });
        });
      }
    },
    [setValue, storageRef2]
  );
  const handleDrop3 = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        uploadBytes(storageRef3, file).then(() => {
          console.log('downloaded');
          getDownloadURL(storageRef3).then((url) => {
            setValue('image3', url);
          });
        });
      }
    },
    [setValue, storageRef3]
  );
  const handleDrop4 = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        uploadBytes(storageRef4, file).then(() => {
          console.log('downloaded');
          getDownloadURL(storageRef4).then((url) => {
            setValue('image4', url);
          });
        });

        // .then(() => {
        //   setTimeout(() => {
        //     updateJobWithObId({ images: ['', image1, image2, image3, image4] }, job._id);
        //   }, 0);
        // });
      }
    },
    [setValue, storageRef4]
  );

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <RHFUploadAvatar
                name="image1"
                maxSize={3145728}
                onDrop={handleDrop1}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: -5,
                      display: 'block',
                      float: 'right',
                    }}
                  >
                    <Button variant="contained" onClick={() => handleDelete('image1')}>
                      <Delete />
                    </Button>
                  </Typography>
                }
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <RHFUploadAvatar
                name="image2"
                maxSize={3145728}
                onDrop={handleDrop2}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: -5,
                      display: 'block',
                      float: 'right',
                    }}
                  >
                    <Button variant="contained" onClick={() => handleDelete('image2')}>
                      <Delete />
                    </Button>
                  </Typography>
                }
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <RHFUploadAvatar
                name="image3"
                maxSize={3145728}
                onDrop={handleDrop3}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: -5,
                      display: 'block',
                      float: 'right',
                    }}
                  >
                    <Button variant="contained" onClick={() => handleDelete('image3')}>
                      <Delete />
                    </Button>
                  </Typography>
                }
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <RHFUploadAvatar
                name="image4"
                maxSize={3145728}
                onDrop={handleDrop4}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: -5,
                      display: 'block',
                      float: 'right',
                    }}
                  >
                    <Button variant="contained" onClick={() => handleDelete('image4')}>
                      <Delete />
                    </Button>
                  </Typography>
                }
              />
            </Card>
          </Grid>
        </Grid>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}
