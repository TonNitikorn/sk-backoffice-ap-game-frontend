import React, { useState, useEffect, useRef } from "react";
import Layout from '../theme/Layout'
import {
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent,
  Box,
  Radio,
  IconButton,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import axios from "axios";
import noImg from "../assets/noImgFound.png"
import hostname from "../utils/hostname";
import LoadingModal from "../theme/LoadingModal";
import { Bar, Pie } from "react-chartjs-2";

import Chart from 'chart.js/auto';

function dashboard() {

  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().subtract(7, 'd').format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });

  const [nameDataCount, setNameDataCount] = useState([])

  const getChart = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/dashboard/sumBetAmount`,
        data: {
          "start_date": selectedDateRange.start,
          "end_date": selectedDateRange.end
        }
      });

      let tempAmount = res.data.sumBetAmount
      let tempCount = res.data.count_betAmount

      let count_name = tempCount.map(item => item.game_name)
      let count_bet = tempCount.map(item => item.count_betAmount)

      let game_name = tempAmount.map(item => item.game_name)
      let game_bet = tempAmount.map(item => item.sum_betAmount)



      let dataCount = tempCount.sort((a, b) => b.count_betAmount - a.count_betAmount);
      const rankCount = dataCount.slice(0, 3);

      let data_name_count = rankCount.map(item => item.game_name)
      setNameDataCount(data_name_count)
      setChartData({ game_name, game_bet, count_bet, count_name, rankCount, })
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const data = {
    labels: chartData.game_name,
    datasets: [
      {
        label: 'จำนวนการเดิมพัน',
        data: chartData.game_bet,
        backgroundColor: [
          '#E0DADE',
          '#c9c5a5',
          '#9AA374',
          '#979082',
          '#7d7f63',
          '#64685C',


        ],
        borderColor: '#FFFF',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const dataCount = {
    labels: chartData.count_name,
    datasets: [
      {
        label: 'จำนวนการกดเล่น / ครั้ง',
        data: chartData.count_bet,
        backgroundColor: [
          '#ead7c1',
          '#444b8e',
          '#f6948e',
          '#a84a7f',
          '#2a9d8f',
          '#e9c46a',

        ],
        borderColor: '#FFFF',
        borderWidth: 1,
      },
    ],
  };

  const optionsCount = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  const dataPie = {
    labels: chartData.count_name,
    datasets: [
      {
        label: 'Pie Chart Example',
        data: chartData.count_bet,
        backgroundColor: [
          '#ead7c1',
          '#444b8e',
          '#f6948e',
          '#a84a7f',
          '#2a9d8f',
          '#e9c46a',

        ],
        borderColor: '#FFFF',
        borderWidth: 1,

      },
    ],

  };
  const dataPieCount = {
    labels: chartData.game_name,
    datasets: [
      {
        label: 'Pie Chart Example',
        data: chartData.game_bet,
        backgroundColor: [
          '#E0DADE',
          '#c9c5a5',
          '#9AA374',
          '#979082',
          '#7d7f63',
          '#64685C',


        ],
        borderColor: '#FFFF',
        borderWidth: 1,

      },
    ],

  };

  const dataPieWin = {
    labels: chartData.game_name,
    datasets: [
      {
        label: 'Pie Chart Example',
        data: chartData.game_bet,
        backgroundColor: [
          '#E0DADE',
          '#52bf49',
          '#176d10',
          '#5dc555',
          '#3b9534',
          '#129A50',


        ],
        borderColor: '#FFFF',
        borderWidth: 1,

      },
    ],

  };

  const dataPieLost = {
    labels: chartData.game_name,
    datasets: [
      {
        label: 'Pie Chart Example',
        data: chartData.game_bet,
        backgroundColor: [
          '#E0DADE',
          '#c9c5a5',
          '#9AA374',
          '#979082',
          '#7d7f63',
          '#BB2828',


        ],
        borderColor: '#FFFF',
        borderWidth: 1,

      },
    ],

  };


  const optionsPie = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        // text: 'Chart.js Pie Chart'
      }
    }
  };

  useEffect(() => {
    getChart()
  }, [])

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid container sx={{ mt: 3 }}>
            <Grid item={true} xs={12} sx={{ mb: 3, }}>
              <TextField
                label="เริ่ม"
                style={{
                  marginRight: "8px",
                  marginTop: "8px",
                  backgroundColor: "white",
                  borderRadius: 4,
                }}
                variant="outlined"
                size="small"
                type="datetime-local"
                name="start"
                value={selectedDateRange.start}
                onChange={(e) => {
                  setSelectedDateRange({
                    ...selectedDateRange,
                    [e.target.name]: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="สิ้นสุด"
                style={{
                  marginRight: "8px",
                  marginTop: "8px",
                  color: "white",
                  backgroundColor: "white",
                  borderRadius: 4,
                }}
                variant="outlined"
                size="small"
                type="datetime-local"
                name="end"
                value={selectedDateRange.end}
                onChange={(e) => {
                  setSelectedDateRange({
                    ...selectedDateRange,
                    [e.target.name]: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />

              <Button
                variant="contained"
                sx={{ ml: 2, mt: 1, width: 300 }}
                color="primary"
                size="large"
                type="submit"
                onClick={() => {
                  getChart()
                }}
              >
                <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
              </Button>

            </Grid>
          </Grid>
        </Grid>

        <Grid container >
          <Grid item xs={5} container justifyContent="center" >
            <Box sx={{ width: 400, textAlign: 'start' }}>
              <h2>กราฟแสดงตามจำนวนการเล่น</h2>
              <Pie data={dataPie} options={optionsPie} />
            </Box>
          </Grid>

          <Grid item xs={7}>
            <Box sx={{ width: 600, bgcolor: 'white', ml: 2, mt: 15, textAlign: 'start' }}>
              {/* <h2>Chart Bet Count</h2> */}
              <Bar data={dataCount} options={optionsCount} />
            </Box>
          </Grid>
        </Grid>


        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={6} container justifyContent="center"  >
            <Box sx={{ width: 400, textAlign: 'start', mb: 10 }}>
              <h2>กราฟแสดงการเล่นเกมชนะ</h2>
              <Pie data={dataPieWin} options={optionsPie} />
            </Box>
          </Grid>
          <Grid item xs={6} container justifyContent="center"  >
            <Box sx={{ width: 400, textAlign: 'start', mb: 10 }}>
              <h2>กราฟแสดงการเล่นเกมแพ้</h2>
              <Pie data={dataPieLost} options={optionsPie} />
            </Box>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={5} container justifyContent="center"  >
            <Box sx={{ width: 400, textAlign: 'start', mb: 10 }}>
              <h2>กราฟแสดงตามจำนวนการเดิมพัน</h2>
              <Pie data={dataPieCount} options={optionsPie} />
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box sx={{ width: 600, bgcolor: 'white', ml: 2, mt: 15, textAlign: 'start' }}>
              {/* <h2>Chart Bet Rank</h2> */}
              <Bar data={data} options={options} />
            </Box>
          </Grid>
        </Grid>


      </Paper>


      <LoadingModal open={loading} />
    </Layout>


  )
}

export default dashboard