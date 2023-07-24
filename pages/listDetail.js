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
  FormControlLabel,
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
import hostname from "../utils/hostname";
import LoadingModal from "../theme/LoadingModal";
import Chart from 'chart.js/auto';
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { CopyToClipboard } from "react-copy-to-clipboard"
import Image from 'next/image';

function listDetail() {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rowData, setRowData] = useState({})
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState([])
  const [dataGame, setDataGame] = useState([])
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

  const getDataGame = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/member/getGame`,
        data: {
          "game_name": rowData.game_name || 'Cannabis',
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
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log('dataGame', dataGame)

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


  const columnsMember = [
    {
      title: '',
      dataIndex: 'game_img',
      align: 'left',
      width: 250,
      render: (item, data) => (
        <>
          <Image
            src={item}
            width={250}
            height={170}
            alt="Picture of the author"
          />
        </>
      ),


    },
    {
      title: 'เกม',
      dataIndex: 'game_name',
      align: 'left',
      width: 250,
      render: (item, data) => (
        <CopyToClipboard text={item}>
          <div style={{ "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } } }} >
            <Button
              sx={{ fontSize: "14px", p: 0, color: "blue" }}
              onClick={handleClickSnackbar}
            >
              {item}
            </Button>
          </div>
        </CopyToClipboard>
      ),
      ...getColumnSearchProps('game_name'),

    },
    {
      dataIndex: "game_type",
      title: "ประเภท",
      align: "left",
      width: 150,
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
      ...getColumnSearchProps('game_type'),
    },
    {
      dataIndex: "count",
      title: "จำนวนการเล่น",
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
      dataIndex: "sumAmountGame",
      title: "จำนวนการเดิมพันทั้งหมด",
      align: "center",
      width: 100,
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
      dataIndex: "sumResultGame",
      title: "ผลลัพธ์การเดิมพัน์",
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
      dataIndex: "sumTotal",
      title: "ผลต่างเดิมพัน",
      align: "center",
      width: 160,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "game_status",
      title: "สถานะ",
      align: "center",
      width: 160,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "create_at",
      title: "วันที่อัปโหลดเกม",
      align: "center",
      width: 160,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "game_url",
      title: "Demo",
      align: "center",
      render: (item, data) => (
        <>
          <a target='_blank' href={item}>Link Demo</a>
        </>
      ),
    },
  ]

  useEffect(() => {
    // getChart()
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
              <MenuItem value="Data 2 Dog game 2023">Data 2 Dog game 2023</MenuItem>
              <MenuItem value="Cannabis">Cannabis Slot</MenuItem>
              <MenuItem value="TheWitcher3">TheWitcher3</MenuItem>
              <MenuItem value="CSGO">CSGO</MenuItem>
            </TextField>
            <Button
              variant="contained"
              style={{ marginRight: "8px", marginTop: "8px", width: 300 }}
              color="primary"
              size="large"
              type="submit"
              onClick={() => {
                // getChart()
                getDataGame()
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
            <Grid container sx={{ bg: "pink" }}>
              <Grid item xs={6} sx={{ mt: '7%' }}>
                <Image
                  src={dataGame[0]?.game_img}
                  width={401}
                  height={236}
                  alt="Cannabis Slot IMG"
                />
              </Grid>
              <Grid item xs={6} sx={{ mt: '7%' }}>
                <Typography variant='h6' sx={{ mt: 1 }}>ชื่อเกม : {dataGame[0]?.game_name}</Typography>
                <Typography variant='h6' sx={{ mt: 1 }}>ประเภท : {dataGame[0]?.game_type}</Typography>
                <Typography variant='h6' sx={{ mt: 1 }}>วันที่อัปโหลดเกม : {dataGame[0]?.create_at}</Typography>
                <Typography variant='h6' sx={{ mt: 1 }}>สถานะ : {dataGame[0]?.game_status}</Typography>
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
                    <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>{dataGame[0]?.count} </Typography>
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
              columns={columnsMember}
              dataSource={dataGame}
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
