import Layout from '../theme/Layout'
import MaterialTable from '@material-table/core'
import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Grid,
    Typography,
    TextField,
    Snackbar,
    Alert,
    Chip,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    MenuItem,
    Table, TableRow, TableHead, TableContainer, TableCell, TableBody,
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

function listDetail() {

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
                    "game_name": rowData.game_name || 'CSGO',
                    "username": username || '',
                    "start_date": selectedDateRange.start,
                    "end_date": selectedDateRange.end,
                }
            });
            let resData = res.data;
            let dataMog = res.data.game

            dataMog.map((item) => {
                item.sumAmountGame = res.data.sumAmountGame
                item.sumResultGame = res.data.sumResultGame
                item.count = res.data.count
            })

            setDataGame(...dataMog)
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
                            <MenuItem value="TheWitcher3">TheWitcher3</MenuItem>
                            <MenuItem value="CSGO">CSGO</MenuItem>
                        </TextField>
                        <TextField
                            name="username"
                            type="text"
                            value={username || ""}
                            label="ค้นหาโดยใช้ Username"
                            placeholder="ค้นหาโดยใช้ Username"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ mx: 2, mt: 1 }}
                        />
                        <Button
                            variant="contained"
                            style={{ marginRight: "8px", marginTop: "8px", width: 300 }}
                            color="primary"
                            size="large"
                            type="submit"
                            onClick={() => {
                                getChart()
                                getDataGame()
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
                        </Button>

                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ p: 3, mt: 2 }}>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center" spacing={2}>
                    <Grid item xs={6}>
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
                    </Grid>
                    <Grid item xs={6}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ fontWeight: 'blod' }}>
                                        <TableCell>เกม</TableCell>
                                        <TableCell align="right">สถานะ</TableCell>
                                        <TableCell align="right">ประเภท</TableCell>
                                        <TableCell align="right">ผลรวมการเดิมพัน</TableCell>
                                        <TableCell align="right">ผลต่างการเดิมพัน</TableCell>
                                        <TableCell align="right">จำนวนครั้งการเดิมพัน</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <>
                                        {
                                            !!dataGame ? <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{dataGame.game_name}</TableCell>
                                                <TableCell align="right">{dataGame.game_status}</TableCell>
                                                <TableCell align="right">{dataGame.game_type}</TableCell>
                                                <TableCell align="right">{dataGame.sumAmountGame}</TableCell>
                                                <TableCell align="right">{dataGame.sumResultGame}</TableCell>
                                                <TableCell align="right">{dataGame.count}</TableCell>
                                            </TableRow>
                                                :
                                                <Typography>กรุณากรอกข้อมูลให้ครบถ้วน</Typography>
                                        }


                                    </>

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

            </Paper>
            <LoadingModal open={loading} />
        </Layout>
    )
}

export default listDetail
