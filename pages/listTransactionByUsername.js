import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Layout from "../theme/Layout";
import {
    Paper,
    Button,
    Grid,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
    FormGroup,
    IconButton,
    MenuItem,
} from "@mui/material";
import { Table, Input, Space, } from 'antd';
import moment from "moment";
import axios from "axios";
import hostname from "../utils/hostname";
import SearchIcon from '@mui/icons-material/Search';
import LoadingModal from "../theme/LoadingModal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

function listTransactionByusername() {
    const router = useRouter();
    const { usernameParam } = router.query
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: moment().format("2023-06-01 00:00"),
        end: moment().format("YYYY-MM-DD 23:59"),
    });
    const searchInput = useRef(null);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [open, setOpen] = useState(false)
    const [report, setReport] = useState([])
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("")
    const [chart, setChart] = useState([])
    const [dataGame, setDataGame] = useState([])
    const [gameList, setGameList] = useState([])
    const [gameTypes, setGameTypes] = useState({})
    const [setsubTypeCheck, setSetsubTypeCheck] = useState({})
    const [username_second, setUsername_second] = useState('')

    const getReport = async (usernameParam , type,start,end) => {
        console.log('usernameParam', usernameParam)

        setLoading(true);

        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/member/getMemberTransaction`,
                data: {
                    "start_date": type === undefined ? selectedDateRange.start : start,
                    "end_date": type === undefined ? selectedDateRange.end : end,
                    "username": usernameParam ? usernameParam : username
                }
            });

            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format('DD/MM/YYYY hh:mm')
                item.update_at = moment(item.update_at).format('DD/MM/YYYY hh:mm')
                item.prefix = item.prefix === null ? "-" : item.prefix
                item.bet_detail = item.bet_detail === "" ? "-" : item.bet_detail

            });

            setReport(resData);
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
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
            // setGameList(resData)

            let gameTypes = [];
            let dataGameType = resData.filter((item) => {
                if (!gameTypes.includes(item.game_type)) {
                    gameTypes.push(item.game_type);
                    return true
                }
                return false
            });
            setGameList(dataGameType)
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeData = async (e) => {
        // setRowData({ ...rowData, [e.target.name]: e.target.value });
        setGameTypes({ ...gameTypes, type: e.target.value })
        let dataType = []
        let subType = gameList.filter(item => item.game_type === e.target.value)
        console.log('subType', subType)

    };

    const handleChange = (event) => {
        setSetsubTypeCheck({ ...setsubTypeCheck, [event.target.name]: event.target.checked, });
    };
    console.log('setsubTypeCheck', setsubTypeCheck)

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
                        <Typography sx={{ fontSize: "14px" }}>{data.create_at}</Typography>
                        <Typography sx={{ fontSize: "12px" }}>{data.uuid}</Typography>
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
                    <Typography sx={{ fontSize: "14px" }}>Fast Spin : {data.fastSpin}</Typography>
                    <Typography sx={{ fontSize: "14px" }}>Free Spin Add : {data.freeSpinAdd}</Typography>
                    <Typography sx={{ fontSize: "14px" }}>Free Spin Left : {data.freeSpinLeft}</Typography>
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
                <Typography sx={{ fontSize: "14px" }}>{item}</Typography>
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
        if (usernameParam) {
            getReport(usernameParam)
            setUsername_second(usernameParam)
        }
        getGameList()

    }, [usernameParam])

    return (
        <Layout>
            <Paper>
                <Grid container sx={{ p: 2 }}>
                    <Grid item={true} xs={12} >
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
                            name="username"
                            type="text"
                            value={username || ""}
                            label="ค้นหาโดยใช้ Username"
                            placeholder="ค้นหาโดยใช้ Username"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 2, mt: 1 }}
                        />
                        <Button
                            variant="contained"
                            style={{ marginRight: "8px", marginTop: "8px", width: 150 }}
                            color="primary"
                            size="large"
                            type="submit"
                            onClick={() => {
                                getReport();
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
                        </Button>
                        {/* เมื่อวาน */}
                        <Button
                            variant="contained"
                            style={{
                                marginRight: "8px",
                                marginTop: "8px",
                                backgroundColor: "#FFB946",
                            }}
                            size="large"
                            onClick={async () => {
                                let start = moment()
                                    .subtract(1, "days")
                                    .format("YYYY-MM-DD 00:00");
                                let end = moment()
                                    .subtract(1, "days")
                                    .format("YYYY-MM-DD 23:59");
                                getReport("yesterday", start, end);
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>เมื่อวาน</Typography>
                        </Button>
                        {/* วันนี้ */}
                        <Button
                            variant="contained"
                            style={{
                                marginRight: "8px",
                                marginTop: "8px",
                                backgroundColor: "#129A50",
                            }}
                            size="large"
                            onClick={async () => {
                                let start = moment().format("YYYY-MM-DD 00:00");
                                let end = moment().format("YYYY-MM-DD 23:59");
                                getReport("today", start, end);
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>วันนี้</Typography>
                        </Button>

                    </Grid>
                </Grid>
                <Grid container sx={{ p: 2 }}>
                    <Grid item={true} xs={12}>
                        <Typography>Game Type :</Typography>
                        <TextField
                            name="username"
                            type="text"
                            select
                            label='เลือกประเภท'
                            onChange={(e) => handleChangeData(e)}
                            variant="outlined"
                            value={gameTypes.type || ""}
                            size="small"
                            sx={{ mr: 2, mt: 1, width: 200 }}
                        >
                            <MenuItem selected disabled>
                                เลือกเกม
                            </MenuItem>
                            {
                                gameList.map((item => (
                                    <MenuItem value={item.game_type}>{item.game_type}</MenuItem>
                                )))
                            }

                        </TextField>
                        <FormControl
                            // component="fieldset"
                            variant="outlined"
                            sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}
                        >
                            <FormGroup sx={{textAlign: 'left'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={setsubTypeCheck?.grap || ""}
                                        />
                                    }
                                    value={setsubTypeCheck.preference?.grap}
                                    label="กราฟ"
                                    onChange={handleChange}
                                    name="grap"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={setsubTypeCheck?.grap || ""}
                                        />
                                    }
                                    value={setsubTypeCheck.preference?.grap}
                                    label="กราฟ"
                                    onChange={handleChange}
                                    name="grap"
                                />
                            </FormGroup>
                        </FormControl>

                    </Grid>
                </Grid>
                <Grid style={{ marginTop: "20px" }}>
                    <Table
                        columns={columns}
                        dataSource={report}
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
                        summary={(pageData) => {
                            let totalCredit = 0;
                            let totalBefore = 0;
                            let totalAfter = 0;
                            let totalSumCredit = ''
                            let totalSumCreditBefore = ''
                            let totalSumCreditAfter = ''
                            let totalWin = 0
                            let totalBetAmount = 0


                            pageData.forEach(({ winTotal, betAmount, credit_after, sumCredit, sumCreditBefore, sumCreditAfter }) => {
                                totalWin += parseInt(winTotal);
                                totalBetAmount += parseInt(betAmount);
                                totalAfter += parseInt(credit_after);
                                totalSumCredit = sumCredit
                                totalSumCreditBefore = sumCreditBefore
                                totalSumCreditAfter = sumCreditAfter

                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} > ยอดรวม </Typography> </Table.Summary.Cell>
                                        <Table.Summary.Cell />
                                        <Table.Summary.Cell />
                                        <Table.Summary.Cell />
                                        <Table.Summary.Cell >
                                            <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >
                                                {Intl.NumberFormat("TH").format(parseInt(totalWin))}
                                            </Typography>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell />
                                        <Table.Summary.Cell />
                                        <Table.Summary.Cell >
                                            <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >
                                                {Intl.NumberFormat("TH").format(parseInt(totalWin))}
                                            </Typography>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell />
                                        <Table.Summary.Cell />
                                    </Table.Summary.Row>

                                </>
                            );
                        }}
                    />
                </Grid>
            </Paper>

            <LoadingModal open={loading} />
        </Layout>
    )
}

export default listTransactionByusername