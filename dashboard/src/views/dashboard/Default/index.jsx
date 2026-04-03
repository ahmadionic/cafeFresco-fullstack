import { useEffect, useState, useContext } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { useNavigate } from 'react-router-dom';


import { MainContext } from '../../context';
import AccessDenied from '../../Error/AccessDenied'
import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [DashboardApi, setDashboardApi] = useState({})
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { adminRole } = useContext(MainContext);

  if (adminRole?.toLowerCase() !== "admin") {
    return (
      <AccessDenied />
    );
  }


  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Token Expired!");
          setTimeout(() => navigate('/admin/login'), 2000);
          return;
        }
        else if (response.status === 403) {
          navigate('/admin/access-denied');
          return;
        }
        else if (response.status === 404) {
          alert("Please Login Again!");
          setTimeout(() => navigate('/admin/login'), 2000);
        } else if (response.status === 500) {
          throw new Error("Server error, please try again later");
        } else {
          throw new Error(`Unexpected error: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setDashboardApi(data);
    } catch (error) {
      console.error("Dashboard API Error:", error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
    setLoading(false);

  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <EarningCard isLoading={isLoading} totalEarning={DashboardApi.totalEarnings} />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalOrderLineChartCard isLoading={isLoading} monthlyOrder={DashboardApi.totalOrdersThisMonth} yearlyOrder={DashboardApi.totalOrdersThisYear} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeDarkCard isLoading={isLoading} total={DashboardApi.totalCompletedOrders} />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: DashboardApi.totalPendingOrders,
                    label: 'Total Pending Order',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
