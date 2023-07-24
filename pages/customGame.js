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
    IconButton,
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";
import axios from "axios";
import hostname from "../utils/hostname";
import LoadingModal from "../theme/LoadingModal";
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useRouter } from "next/router";
import Image from "next/image";

function customGame() {
    const router = useRouter();
    const searchInput = useRef(null);
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: moment().format("YYYY-MM-DD 00:00"),
        end: moment().format("YYYY-MM-DD 23:59"),
    });
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [gameList, setGameList] = useState([])

    const getGameList = async (type, start, end) => {
        setLoading(true);
        try {
            let res = await axios({
                headers: { Authorization: "Bearer " + localStorage.getItem("access_token"), },
                method: "get",
                url: `${hostname}/game/getGameList`,
            });
            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD-MM-YYYY HH:mm")
                item.update_at = moment(item.update_at).format("DD-MM-YYYY HH:mm")

                // item.fullname = item.fname + ' ' + item.lname
            });
            setGameList(resData);
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


    const columnsGame = [
        {
            title: 'No',
            dataIndex: 'no',
            align: 'center',
            sorter: (record1, record2) => record1.no - record2.no,
            render: (item, data) => (
                <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >{item}</Typography>
            )
        },
        {
            title: 'Game Type',
            dataIndex: 'game_type',
            align: 'center',
            width: 150,
            render: (item, data) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
            ...getColumnSearchProps('game_type'),

        },
        {
            title: 'Game Name',
            dataIndex: 'game_name',
            align: 'left',
            width: 150,
            render: (item, data) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
            ...getColumnSearchProps('game_name'),

        },
        {
            dataIndex: "game_img",
            title: "Logo",
            align: "left",
            width: 200,
            sorter: (record1, record2) => record1.credit - record2.credit,
            render: (item) => (
                <Grid item xs={3} sx={{ mt: 1 }}>
                    <Image
                        src={item}
                        alt="logo"
                        width={50}
                        height={50}
                    />
                </Grid>
            ),
            ...getColumnSearchProps('fullname'),
        },
        {
            title: 'link',
            dataIndex: 'game_url',
            align: 'left',
            width: 250,
            render: (item, data) => (
                <>
                    <a
                        onClick={() => {
                            window.open(item, "_blank");
                        }}
                        style={{
                            // "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } },
                            fontSize: '14px'
                        }}
                    >{item}</a>
                </>

            ),
            ...getColumnSearchProps('game_url'),

        },
        {
            title: 'Create At',
            dataIndex: 'create_at',
            align: 'center',
            width: 150,
            render: (item, data) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
            ...getColumnSearchProps('create_at'),

        },
        {
            title: 'Update At',
            dataIndex: 'update_at',
            align: 'center',
            width: 150,
            render: (item, data) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
            ...getColumnSearchProps('update_at'),

        },

        {
            title: 'Game Status',
            dataIndex: 'game_status',
            align: 'left',
            width: 100,
            render: (item, data) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
            ...getColumnSearchProps('game_status'),

        },

        {
            dataIndex: "bet_detail",
            title: "รายละเอียดการเดิมพัน",
            align: "center",
            render: (item, data) => (
                <>
                    <IconButton
                        onClick={async () => {
                            router.push(`/listTransactionByUsername?username=${data.username}`)
                        }}
                    >
                        <ManageSearchIcon color="primary" />
                    </IconButton>
                </>
            ),
        },
    ]

    useEffect(() => {
        getGameList()
    }, [])

    return (
        <Layout>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>จัดการเกมส์</Typography>
                <Grid container>
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
                            style={{ marginRight: "8px", marginTop: "8px", width: 300 }}
                            color="primary"
                            size="large"
                            type="submit"
                            onClick={() => {
                                getGameList();
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
                        </Button>

                        {/* <Button
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
            </Button> */}

                    </Grid>
                </Grid>
            </Paper>

            <Grid style={{ marginTop: "20px" }}>
                <Table
                    columns={columnsGame}
                    dataSource={gameList}
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


            <LoadingModal open={loading} />
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Copy success !
                </Alert>
            </Snackbar>
        </Layout>
    )
}

export default customGame
