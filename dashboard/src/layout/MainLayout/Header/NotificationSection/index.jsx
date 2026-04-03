import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import { Badge } from '@mui/material';


// assets
import { IconBell } from '@tabler/icons-react';


// ==============================|| NOTIFICATION ||============================== //

export default function NotificationSection() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/notify`, {
        method: 'GET'
      });
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleRead = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/mark-seen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'All notifications marked as read');
      } else {
        throw new Error(data.message || `Error ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      alert(`Failed to mark notifications as read: ${error.message}`);
    }
  };


  useEffect(() => {
    fetchNotifications();
  }, []);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    fetchNotifications();
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // const handleChange = (event) => {
  //   event?.target.value && setValue(event?.target.value);
  // };

  return (
    <>
      <Box sx={{ ml: 2 }}>
        <Badge badgeContent={notifications.length} invisible={notifications.length === 0} color="error">

          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              bgcolor: 'secondary.light',
              color: 'secondary.dark',
              '&[aria-controls="menu-list-grow"],&:hover': {
                bgcolor: 'secondary.dark',
                color: '#FFFFFF'
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [downMD ? 5 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid size={12}>
                        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 2 }}>
                          <Grid>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">Today Notification</Typography>
                              <Chip size="small" label={notifications.length} sx={{ color: 'background.default', bgcolor: 'warning.dark' }} />
                            </Stack>
                          </Grid>
                          <Grid>
                            <Typography onClick={handleRead} component={Link} to="#" variant="subtitle2" color="error">
                              Mark as all read
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={12}>
                        <Box
                          sx={{
                            height: '100%',
                            maxHeight: 'calc(100vh - 205px)',
                            overflowX: 'hidden',
                            '&::-webkit-scrollbar': { width: 5 }
                          }}
                        >
                          {notifications?.length > 0 ? (
                            <NotificationList notifications={notifications} />
                          ) : (
                            <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
                              No unseen notifications
                            </Typography>
                          )}
                        </Box>

                      </Grid>
                    </Grid>

                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
