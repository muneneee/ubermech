import { DirectionDataContext } from '@/context/DirectionDataContext'
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useContext } from 'react'

function DistanceTime() {
  
  const [open, setOpen] = React.useState(false); // State for snackbar visibility

  const {directionData, setDirectionData}=useContext(DirectionDataContext);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  React.useEffect(() => {
    if (directionData?.routes) {
      // Open snackbar when direction data is received
      setOpen(true);
    }
  }, [directionData]); // Update snackbar state based on directionData changes


  const message = directionData?.routes
    ? `Distance: ${(directionData.routes[0].distance * 0.000621371192).toFixed(2)} Miles, Duration: ${(directionData.routes[0].duration / 60).toFixed(2)} Min`
    : ''; // Empty string if no data

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={60000} // Optional: Set auto-hide duration
      onClose={handleClose}
      message={message}
      action={action}
    />
  );
}

export default DistanceTime