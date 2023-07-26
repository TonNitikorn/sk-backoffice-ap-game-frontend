import Layout from '../theme/Layout'
import React, { useState, useEffect, useRef } from "react";
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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  category
} from "chart.js";
import moment from "moment";
import axios from "axios";
import noImg from "../assets/noImgFound.png"
import hostname from "../utils/hostname";
import LoadingModal from "../theme/LoadingModal";
import Chart from 'chart.js/auto';
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { CopyToClipboard } from "react-copy-to-clipboard"
import Image from 'next/image';
import { useRouter } from 'next/router';

function listDetail() {
  const searchInput = useRef(null);
  const router = useRouter();
  const { game_name } = router.query
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rowData, setRowData] = useState({})
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState([])
  const [dataGame, setDataGame] = useState([])
  const [gameList, setGameList] = useState([])
  const [transaction, setTransaction] = useState([])
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });

  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const getChart = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/member/getGameChart`,
        data: {
          "start_date": selectedDateRange.start,
          "end_date": selectedDateRange.end,
          "game_name": rowData.game_name || 'CSGO',
          "username": username,
        }
      });
      let resData = res.data;
      setChart(resData)
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getGameList = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "get",
        url: `${hostname}/game/getGameList`,
      });
      let resData = res.data;
      setGameList(resData)
      setChart(resData)
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataGame = async (game_name) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/member/getGame`,
        data: {
          "game_name": game_name ?  game_name :  rowData.game_name,
          "username": username || '',
          "start_date": selectedDateRange.start,
          "end_date": selectedDateRange.end,
        }
      });

      let resData = res.data.game

      resData.map((item) => {
        item.sumAmountGame = res.data.sumAmountGame
        item.sumResultGame = res.data.sumResultGame
        item.count = res.data.count
        item.sumTotal = res.data.sum
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
      })

      setDataGame(resData)
      getGameList()
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataGameTransaction = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/transaction/get_transaction_by_gamename`,
        data: {
          "game_name": rowData.game_name
        }
      });

      let resData = res.data
      let no = 1
      resData.map((item) => {
        item.no = no++
        item.sumAmountGame = res.data.sumAmountGame
        item.sumResultGame = res.data.sumResultGame
        item.count = res.data.count
        item.sumTotal = res.data.sum
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
      })

      setTransaction(resData)
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };




  const options = {
    responsive: true,
    layout: {
      padding: 5,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'ชั่วโมง',
          color: '#000',
          font: {
            family: 'Times',
            size: 18,
            style: 'normal',
            lineHeight: 1.2
          },
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'เครดิต',
          color: '#000',
          font: {
            family: 'Times',
            size: 18,
            style: 'normal',
            lineHeight: 1.2
          },
        }
      }
    }
  };

  const labels = chart.map((item) => item.hour)

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{
              width: 90,
            }}
          >
            <SearchIcon />
            Search
          </Button>
          {/* <Button
               type="link"
               size="small"
               onClick={() => {
                 confirm({
                   closeDropdown: false,
                 });
                 setSearchText(selectedKeys[0]);
                 setSearchedColumn(dataIndex);
               }}
             >
               Filter
             </Button> */}
          {/* <Button
               type="link"
               size="small"
               onClick={() => {
                 close();
               }}
             >
               close
             </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchIcon
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const handleClickSnackbar = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    setOpen(false);
  };


  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'no',
      align: 'center',
      sorter: (record1, record2) => record1.no - record2.no,
      render: (item, data) => (
        <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >{item}</Typography>
      )
    },

    {
      title: 'ชื่อผู้ใช้',
      dataIndex: 'username',
      render: (item, data) => (
        <CopyToClipboard text={item}>
          <div style={{ "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } } }} >
            <Button
              sx={{ fontSize: "14px", p: 0, color: "blue", }}
              onClick={handleClickSnackbar}
            >
              {item}
            </Button>
            <Typography>{data.create_at}</Typography>
            <Typography>{data.uuid}</Typography>
          </div>
        </CopyToClipboard>
      ),
      ...getColumnSearchProps('username'),

    },
    {
      dataIndex: "game_name",
      title: "เกม",
      align: "center",
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
      ...getColumnSearchProps('game_name'),
    },
    {
      dataIndex: "รายละเอียด",
      title: "รายละเอียดการเดิมพัน",
      align: "right",
      render: (item, data) => (
        <>
          <Typography>Fast Spin : {data.fastSpin}</Typography>
          <Typography>Free Spin Add : {data.freeSpinAdd}</Typography>
          <Typography>Free Spin Left : {data.freeSpinLeft}</Typography>
        </>

      ),
    },
    {
      dataIndex: "betAmount",
      title: "จำนวนเดิมพัน",
      align: "center",
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "creditBefore",
      title: "เครดิตก่อน bet",
      align: "center",
      ...getColumnSearchProps('creditBefore'),
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
      ),
    },
    {
      dataIndex: "creditAfter",
      title: "เครดิตหลัง bet",
      align: "center",
      ...getColumnSearchProps('creditAfter'),
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
      ),
    },
    {
      dataIndex: "winTotal",
      title: "ผลลัพธ์",
      align: "center",
      ...getColumnSearchProps('winTotal'),
      render: (item) => (
        <Typography>{item}</Typography>
      ),
    },
    {
      dataIndex: "bet_status",
      title: "สถานะการเดิมพัน",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },


    {
      dataIndex: "bet_detail",
      title: "รายละเอียด",
      align: "center",
      render: (item) => (
        <>
          <IconButton
          //   onClick={async () => {
          //     router.push(`/listTransactionByUsername?username=${data.username}`)
          //     }}
          >
            <ManageSearchIcon color="primary" />
          </IconButton>
        </>
      ),
    },
  ]

  useEffect(() => {
    // getChart()
    

    if (game_name) {
      getDataGame(game_name)
      getGameList()
      getDataGameTransaction()
    }
    
    getGameList()
  }, [])

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
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
            <TextField
              name="game_name"
              type="text"
              value={rowData.game_name || ""}
              label="เกม"
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ bgcolor: "white", width: 300, mt: 1 }}
              select
            >
              <MenuItem selected disabled>
                เลือกเกม
              </MenuItem>
              {
                gameList.map((item => (
                  <MenuItem value={item.game_name}>{item.game_name}</MenuItem>
                )))
              }

            </TextField>
            <Button
              variant="contained"
              sx={{ ml: 2, mt: 1, width: 300 }}
              color="primary"
              size="large"
              type="submit"
              onClick={() => {
                // getChart()
                getDataGame()
                getDataGameTransaction()
              }}
            >
              <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
            </Button>

          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>

        <Grid container>
          <Grid item xs={6}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center" sx={{ bg: "pink" }} >
              <Grid item xs={6} sx={{ mt: '7%', textAlign: 'center' }}>
               
                <img
                  src={dataGame[0]?.game_img ? dataGame[0]?.game_img : noImg}
                  width={371} 
                  height={206}
                  alt="img game"
                />
              </Grid>
              <Grid item xs={6} sx={{ mt: '7%' }}>
                {/* <Typography variant='h6' sx={{ mt: 1 }}>ชื่อเกม : {dataGame[0]?.game_name}</Typography>
                <Typography variant='h6' sx={{ mt: 1 }}>ประเภท : {dataGame[0]?.game_type}</Typography>
                <Typography variant='h6' sx={{ mt: 1 }}>วันที่อัปโหลดเกม : {dataGame[0]?.create_at}</Typography>
                <Typography variant='h6' sx={{ mt: 1 }}>สถานะ : {dataGame[0]?.game_status}</Typography> */}

                <TextField
                  name="game_name"
                  type="text"
                  value={dataGame[0]?.game_name || ""}
                  label="ชื่อเกม"
                  size="medium"
                  variant="standard"
                  sx={{ bgcolor: "white", width: 300, mt: 1 }}
                />

                <TextField
                  name="game_name"
                  type="text"
                  value={dataGame[0]?.game_type || ""}
                  label="ประเภท"
                  size="medium"
                  variant="standard"
                  sx={{ bgcolor: "white", width: 300, mt: 1 }}
                />
                <TextField
                  name="game_name"
                  type="text"
                  value={dataGame[0]?.create_at || ""}
                  label="วันที่อัปโหลดเกม"
                  size="medium"
                  variant="standard"
                  sx={{ bgcolor: "white", width: 300, mt: 1 }}
                />
                <TextField
                  name="game_name"
                  type="text"
                  value={dataGame[0]?.game_status || ""}
                  label="สถานะ"
                  size="lageng"
                  variant="standard"
                  sx={{bgcolor: "white", width: 300, mt: 1}}
                  
                />
                <Typography variant='h6' sx={{ mt: 2 }}><a target='_blank' href={dataGame[0]?.game_url}>Link Demo</a></Typography>



              </Grid>


            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid
              container
              direction="row"
              // justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
              sx={{ mt: 2, mb: 4 }}>
              <Grid item xs={6}>
                <Card sx={{ width: '100%', background: "linear-gradient(#0072B1, #41A3E3)" }}>
                  <CardContent>
                    <Typography variant="h7" sx={{ color: "#eee" }}>จำนวนการเล่น</Typography>
                    <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>{Intl.NumberFormat("THB").format(dataGame[0]?.count)} </Typography>
                    <Grid sx={{ textAlign: 'right' }}>
                      <Button disabled>
                        <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>ครั้ง</Typography>
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ width: '100%', background: "linear-gradient(#0072B1, #41A3E3)" }}>
                  <CardContent>
                    <Typography variant="h7" sx={{ color: '#eee' }}>จำนวนรอบเดิมพันทั้งหมด</Typography>
                    <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}> {dataGame[0]?.sumAmountGame}</Typography>
                    <Grid sx={{ textAlign: 'right' }}>
                      <Button disabled>
                        <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>บาท</Typography>
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ width: '100%', background: "linear-gradient(#c9881e, #ffc463)" }} >
                  <CardContent>
                    <Typography variant="h7" sx={{ color: "#eee" }}>ผลลัพธ์การเดิมพัน</Typography>
                    <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>  {dataGame[0]?.sumResultGame} </Typography>
                    <Grid sx={{ textAlign: 'right' }}>
                      <Button
                        sx={{ color: "#eee" }}
                        onClick={() => filterData('manual')}>
                        <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>บาท</Typography>
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ width: '100%', background: "linear-gradient(#c9881e, #ffc463)" }}>
                  <CardContent>
                    <Typography variant="h7" sx={{ color: "#eee" }}>ผลต่างการเดิมพัน</Typography>
                    <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}> {dataGame[0]?.sumTotal}</Typography>
                    <Grid sx={{ textAlign: 'right' }}>
                      <Button disabled>
                        <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>บาท</Typography>
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>



        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Table
              columns={columns}
              dataSource={transaction}
              onChange={onChange}
              size="small"
              pagination={{
                current: page,
                pageSize: pageSize,
                onChange: (page, pageSize) => {
                  setPage(page)
                  setPageSize(pageSize)
                }
              }}

            />
          </Grid>
          {/* <Grid item xs={6}>
                        <Bar
                            options={options}
                            data={{
                                labels,
                                datasets: [
                                    {
                                        label: "ยอดการถอนรายชั่วโมง",
                                        data: chart.map((item) => item.game_total),
                                        // borderColor: "#129A50",
                                        backgroundColor: [
                                            'rgba(255, 99, 132)',
                                            'rgba(255, 159, 64)',
                                            'rgba(255, 205, 86)',
                                            'rgba(75, 192, 192)',
                                            'rgba(54, 162, 235)',
                                            'rgba(153, 102, 255)',
                                            'rgba(201, 203, 207)'
                                        ],
                                        barThickness: 20,
                                    },
                                ],
                            }} />
                    </Grid> */}
        </Grid>

      </Paper>
      <LoadingModal open={loading} />
    </Layout>
  )
}

export default listDetail
