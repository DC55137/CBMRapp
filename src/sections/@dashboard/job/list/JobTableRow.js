import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  Link,
  MenuItem,
  IconButton,
  Container,
  Button,
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
// components

import { fDateTimeSuffix } from '../../../../utils/formatTime';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { cancelJob, drawingMeasureUpQuote, leadMessage, onlineMeasureUpQuote } from './messages';
import { emailMessage } from './emailMessage';

// ----------------------------------------------------------------------

JobTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function JobTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const { enqueueSnackbar } = useSnackbar();
  const { name, address, mobile, email, number, stage, date, images, notes, _id } = row;
  const nameNoSpace = name.replace(/\s+/g, '');
  const location = `/Users/cbroofing/Library/Mobile Documents/com~apple~CloudDocs/Documents/CBRoofing/Jobs/all/${number}-${nameNoSpace}`;
  const jobFolder = `${number}-${nameNoSpace}`;
  const value = `Job Number - ${number} 
${name}
${address}
${email}
${mobile}`;

  // Messages
  const lead = leadMessage(row);
  const cancel = cancelJob(row);
  const onlineQuote = onlineMeasureUpQuote(row);
  const DrawingsQuote = drawingMeasureUpQuote(row);
  const emailQuote = emailMessage(row);

  // States

  const [showImages, setShowImages] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value);
    enqueueSnackbar(`Copied "${value}"`);
  };
  const handleCopyEmail = (value) => {
    navigator.clipboard.writeText(value);
    enqueueSnackbar(`Copied email`);
  };

  const handleCopyFolder = (value) => {
    navigator.clipboard.writeText(jobFolder);
    enqueueSnackbar(`Copied "${jobFolder}"`);
  };

  const handleShowImages = () => {
    setShowNotes(false);
    setShowMessages(false);
    setShowImages(!showImages);
  };
  const handleShowNotes = () => {
    setShowImages(false);
    setShowMessages(false);
    setShowNotes(!showNotes);
  };
  const handleShowMessages = () => {
    setShowImages(false);
    setShowNotes(false);
    setShowMessages(!showMessages);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
          <IconButton onClick={() => handleCopyValue(value)}>
            <Iconify icon={'eva:copy-fill'} width={24} height={24} />
          </IconButton>

          <IconButton onClick={handleShowImages}>
            <Iconify icon={'bi:images'} width={24} height={24} />
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <IconButton onClick={handleShowNotes}>
            <Iconify icon={'cil:notes'} width={24} height={24} />
          </IconButton>

          <IconButton onClick={() => handleCopyValue(location)}>
            <Iconify icon={'akar-icons:folder'} width={24} height={24} />
          </IconButton>
          <IconButton onClick={handleCopyFolder}>
            <Iconify icon={'akar-icons:folder-add'} width={24} height={24} />
          </IconButton>
        </TableCell>

        <TableCell padding="checkbox">
          <IconButton onClick={handleShowMessages}>
            <Iconify icon={'typcn:messages'} width={24} height={24} />
          </IconButton>
        </TableCell>

        <TableCell>
          {/* <Link variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}> */}
          <a style={{ color: 'grey' }} href={`/job/${_id}`}>
            {number} - {stage}
          </a>
          {/* </Link> */}
          <Typography
            variant="subtitle2"
            onClick={() => handleCopyValue(name)}
            sx={{ whiteSpace: 'pre-line', cursor: 'pointer' }}
          >
            {name.length < 20 ? `${name}` : `${name.substring(0, 20)}...`}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Typography onClick={() => handleCopyValue(address)} sx={{ whiteSpace: 'pre-line', cursor: 'pointer' }}>
            {address}
          </Typography>
        </TableCell>

        <TableCell sx={{ cursor: 'pointer' }} align="left" onClick={() => handleCopyValue(mobile)}>
          {mobile}
        </TableCell>

        <TableCell align="left">
          <Typography sx={{ cursor: 'pointer' }} onClick={() => handleCopyValue(email)}>
            {email}
          </Typography>
          <Typography
            align="right"
            variant="subtitle2"
            onClick={() => handleCopyValue(fDateTimeSuffix(date))}
            sx={{ whiteSpace: 'pre-line' }}
          >
            Received - {fDateTimeSuffix(date)}
          </Typography>
        </TableCell>
      </TableRow>
      {showImages && (
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell />
          {images.slice(0, 3).map((item, index) => (
            <TableCell key={index}>
              {item === '' ? (
                <p>no image</p>
              ) : (
                <img src={item} srcSet={item} alt={item} loading="lazy" style={{ minWidth: '150px' }} />
              )}
            </TableCell>
          ))}
        </TableRow>
      )}
      {showNotes && (
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell />
          Notes:
          <TableCell>{notes}</TableCell>
        </TableRow>
      )}
      {showMessages && (
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell>
            <Button onClick={() => handleCopyValue(lead)}>HPG Lead</Button>
          </TableCell>
          <TableCell>
            <Button onClick={() => handleCopyValue(cancel)}>Cancel</Button>
            <Button onClick={() => handleCopyValue(onlineQuote)}>Sent QGl Qu</Button>
            <Button onClick={() => handleCopyValue(DrawingsQuote)}>Sent Dr Qu</Button>
            <Button onClick={() => handleCopyEmail(emailQuote)}>email Qu</Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
