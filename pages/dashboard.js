import React, { useState, useEffect, useRef } from "react";
import Layout from '../theme/Layout'
import {Paper,Button,Grid,Typography, TextField,} from "@mui/material";
import moment from "moment";
import axios from "axios";
import noImg from "../assets/noImgFound.png"
import hostname from "../utils/hostname";
import LoadingModal from "../theme/LoadingModal";
import { Bar, Pie } from "react-chartjs-2";

function dashboard() {
  const [nameDataCount, setNameDataCount] = useState([])
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });

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
          "end_date": selectedDateRange.end,
        }
      });

      let tempAmount = res.data.game_sumamount
      let tempCount = res.data.count_betAmount

      let count_name = tempCount.map(item => item.game_name)
      let count_bet = tempCount.map(item => item.count_betAmount)

      let game_name = tempAmount.map(item => item.game_name)
      let game_bet = tempAmount.map(item => item.total_betAmount)

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

  console.log('ChartData', chartData)

  const data = {
    labels: chartData.game_name,
    datasets: [
      {
        label: 'จำนวนการเดิมพัน',
        data: chartData.game_bet,
        backgroundColor: 'goldenrod',
        borderColor: 'goldenrod',
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
        label: 'จำนวนการกดเล่น',
        data: chartData.count_bet,
        backgroundColor: 'pink',
        borderColor: 'pink',
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
          'red',
          'blue',
          'yellow',
          'green',
          'purple',
          'orange',
        ], 
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    getChart()
  }, [])

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>

        <Grid container spacing={2}>

          <h2>
            เกมมาแรง
            <Typography>{nameDataCount}</Typography>
            {/* <Typography>{chartData?.rankCount}</Typography> */}

          </h2>
          <div>
            <h2>Pie Chart Example</h2>
            <Pie data={dataPie} />
          </div>
          {/* <Grid item xs={6}>

            <Box
              sx={{
                width: '80%',
                p: 1,
                my: 1,
                bgcolor: 'goldenrod',
                color: 'grey.800',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              {nameDataCount[0]}
            </Box>
            <Box
              sx={{
                width: '60%',
                p: 1,
                my: 1,
                bgcolor: "pink",
                color: 'grey.800',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
                {nameDataCount[1]}
            </Box>
            <Box
              sx={{
                width: '40%',
                p: 1,
                my: 1,
                bgcolor: 'olive',
                color: 'grey.800',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
               {nameDataCount[2]}
            </Box>
          </Grid> */}

        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div>
              <h2>Chart Bet Rank</h2>
              <Bar data={data} options={options} />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              <h2>Chart Bet Count</h2>
              <Bar data={dataCount} options={optionsCount} />
            </div>
          </Grid>
        </Grid>


        <Typography variant='h5'>รายละเอียดเกม</Typography>
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
      </Paper>


      <LoadingModal open={loading} />
    </Layout>


  )
}

export default dashboard