import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

export default function PopularCard({ isLoading }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [latestSale, setLatestSale] = useState({})
  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchSale = async () => {
    try {

      const response = await fetch(`${BASE_URL}/api/daily-report`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLatestSale(data);

    } catch (error) {
      console.error("Error fetching sales data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchSale();
  }, [])


  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid size={12}>
                <Grid container sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
                  <Grid>
                    <Typography variant="h4">Today Latest Order</Typography>
                  </Grid>
                  <Grid>
                    <IconButton size="small" sx={{ mt: -0.625 }}>
                      <MoreHorizOutlinedIcon
                        fontSize="small"
                        sx={{ cursor: 'pointer' }}
                        aria-controls="menu-popular-card"
                        aria-haspopup="true"
                        onClick={handleClick}
                      />
                    </IconButton>
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem>
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ mt: -1 }}>
                <BajajAreaChartCard totalAmount={latestSale.totalAmount || 0} series={latestSale.series} />
              </Grid>



              {latestSale.latestOrders && latestSale.latestOrders.map((order, index) => (

                <Grid size={12}>
                  <Grid container direction="column">
                    <Grid>
                      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Grid>
                          <Typography variant="subtitle1" color="inherit">
                            {order.userId.name}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-around' }}>
                            <Grid>
                              <Typography variant="subtitle1" color="inherit">
                                ${order.totalAmount}
                              </Typography>
                            </Grid>
                            <Grid>
                              <Typography variant="subtitle2" sx={{ marginLeft: '5px', color: order.paymentStatus == 'paid' ? 'success.dark' : 'orange.dark' }}>
                                {order.paymentStatus}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                        {order.userId.email}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1.5 }} />
                </Grid>
              ))}









            </Grid>

          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = { isLoading: PropTypes.bool };
