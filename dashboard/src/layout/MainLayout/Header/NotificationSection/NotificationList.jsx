import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';
import { useNavigate } from 'react-router';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: alpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList({ notifications }) {
  const containerSX = { pl: 7 };
  const navigate = useNavigate();

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      {notifications.map((notif, index) => (
        <ListItemWrapper key={index}>
          <ListItem
            alignItems="center"
            disablePadding
            secondaryAction={
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                <Typography variant="caption">
                  {new Date(notif.time).toLocaleTimeString()}
                </Typography>
              </Stack>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{
                color: notif.type === 'order' ? 'primary.dark' : 'success.dark',
                bgcolor: notif.type === 'order' ? 'primary.light' : 'success.light'
              }}>
                {notif.type === 'permission' ? <IconMailbox size="20px" stroke={1.5} /> : <IconBuildingStore size="20px" stroke={1.5} />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="subtitle1">{notif.name}</Typography>} />
          </ListItem>

          <Stack spacing={2} sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{notif.message}</Typography>

            {/* Conditional UI based on notification type */}
            {notif.type === 'permission' && (
              <Chip label="Permission Alert" color="error" size="small" sx={{ width: 'min-content' }} />
            )}
            {notif.type === 'order' && (
              <Button onClick={() => { navigate('/admin/all-order') }} variant="contained" endIcon={<IconBrandTelegram stroke={1.5} size={20} />} sx={{ width: 'min-content' }}>
                View
              </Button>
            )}
          </Stack>
        </ListItemWrapper>
      ))}
    </List>
  );
};

ListItemWrapper.propTypes = { children: PropTypes.node };
