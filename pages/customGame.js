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
    Dialog,
    DialogTitle,
    DialogContent,
    MenuItem,
    DialogActions,
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
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from "sweetalert2";
import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';

function customGame() {
    const router = useRouter();
    const searchInput = useRef(null);
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [gameList, setGameList] = useState([])
    const [openDialogAdd, setOpenDialogAdd] = useState(false)
    const [openDialogEdit, setOpenDialogEdit] = useState(false)

    const [logo, setLogo] = useState([])
    const [render, setRender] = useState(false)
    const [rowData, setRowData] = useState()


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

    const handleChangeData = async (e) => {
        setRowData({ ...rowData, [e.target.name]: e.target.value });

    };


    const columnsGame = [
        {
            title: 'No',
            dataIndex: 'no',
            align: 'center',
            width: 80,
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
        // {
        //     dataIndex: "game_img",
        //     title: "Logo",
        //     align: "left",
        //     width: 200,
        //     sorter: (record1, record2) => record1.credit - record2.credit,
        //     render: (item) => (
        //         <Grid item xs={3} sx={{ mt: 1 }}>
        //             <Image
        //                 src={item}
        //                 alt="logo"
        //                 width={150}
        //                 height={80}
        //             />
        //         </Grid>
        //     ),
        //     ...getColumnSearchProps('fullname'),
        // },
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
            width: 140,
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
            title: "Detail",
            align: "center",
            width: 80,
            render: (item, data) => (
                <>
                    <IconButton
                        onClick={async () => {
                            router.push(`/listDetail?game_name=${data.game_name}`);
                        }}
                    >
                        <PageviewIcon color="primary" />
                    </IconButton>
                </>
            ),
        },
        {
            title: "Edit",
            align: "center",
            width: 80,
            render: (item, data) => (
                <>
                    <IconButton
                        onClick={async () => {
                            setRowData(data)
                            // logo.push({
                            //     img_url: data.game_img,
                            //     type: "logo",
                            //     // file: file
                            // })
                            setLogo([{
                                img_url: data.game_img,
                                type: "logo",
                                // file: file
                            }])
                            setRender(!render)
                            setOpenDialogEdit(true)

                        }}
                    >
                        <EditIcon color="primary" />
                    </IconButton>
                </>
            ),
        },
    ]

    const uploadLogo = async (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            logo.push({
                img_url: reader.result,
                type: "logo",
                file: file
            })
            setRender(!render)

        };
        reader.readAsDataURL(file);
    };


    const createGame = async (type) => {
        setLoading(true);
        try {
            const tempLogo = logo.filter(item => !item.uuid)
            if (tempLogo) {
                for (const item of tempLogo) {
                    const formData = new FormData();
                    formData.append("upload", item.file);
                    formData.append("game_name", rowData.game_name);
                    formData.append("game_status", rowData.game_status);
                    formData.append("game_type", rowData.game_type);
                    formData.append("game_url", rowData.game_url);
                    let res = await axios({
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("TOKEN"),
                        },
                        method: "post",
                        url: `${hostname}/game/createGame`,
                        data: formData,
                    });

                    if (res.data.message === "success") {
                        setOpenDialogAdd(false)
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Create game success",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }

                }
            }
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
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }

    }

    const editGame = async (type) => {
        setLoading(true);
        try {
            const tempLogo = logo.filter(item => !item.uuid)
            if (tempLogo) {
                for (const item of tempLogo) {
                    const formData = new FormData();
                    formData.append("upload", item.file);
                    formData.append("game_name", rowData.game_name);
                    formData.append("game_status", rowData.game_status);
                    formData.append("game_type", rowData.game_type);
                    formData.append("game_url", rowData.game_url);
                    formData.append("uuid", rowData.uuid);

                    let res = await axios({
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("TOKEN"),
                        },
                        method: "post",
                        url: `${hostname}/game/updateGame`,
                        data: formData,
                    });

                    if (res.data.message === "success") {
                        setOpenDialogEdit(false)
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Update game success",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }

                }
            }
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
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }

    }

    useEffect(() => {
        getGameList()
    }, [])

    return (
        <Layout>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container justifyContent='space-between'>
                    <Typography variant="h5" sx={{ mb: 2 }}>จัดการเกมส์</Typography>
                    <Button
                        variant="contained"
                        style={{ marginRight: "8px", marginTop: "8px", width: 200 }}
                        color="primary"
                        size="large"
                        type="submit"
                        onClick={() => {
                            setRowData({})
                            setLogo([])
                            setOpenDialogAdd(true)
                        }}
                    >
                        <SportsEsportsIcon fontSize="large" />
                        <Typography sx={{ color: '#ffff', ml: 1 }}> Add game</Typography>
                    </Button>
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

            <Dialog
                open={openDialogAdd}
                onClose={() => setOpenDialogAdd(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ mt: 1 }} > <SportsEsportsIcon color="primary" fontSize="large" /> Add game </DialogTitle>

                <DialogContent>
                    <Grid container justifyContent="center">
                        <Grid container spacing={2} >
                            <Grid container item xs={6}>
                                <Typography>Game name *</Typography>
                                <TextField
                                    name="game_name"
                                    type="text"
                                    value={rowData?.game_name || ""}
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                />
                            </Grid>

                            <Grid container item xs={6}>
                                <Typography>Game type *</Typography>
                                <TextField
                                    name="game_type"
                                    type="text"
                                    value={rowData?.game_type || ""}
                                    select
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                >
                                    <MenuItem selected disabled value>
                                        select game type
                                    </MenuItem>
                                    <MenuItem value="slot">Slot</MenuItem>
                                    <MenuItem value="plinko">Plinko</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid container item xs={6}>
                                <Typography>Game Link *</Typography>
                                <TextField
                                    name="game_url"
                                    type="text"
                                    value={rowData?.game_url || ""}
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                />
                            </Grid>

                            <Grid container item xs={6}>
                                <Typography>Status *</Typography>
                                <TextField
                                    name="game_status"
                                    type="text"
                                    value={rowData?.game_status || ""}
                                    select
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                >
                                    <MenuItem selected disabled value>
                                        select game type
                                    </MenuItem>
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} container sx={{ mb: 2 }}>
                                <Typography >Game Logo * </Typography>
                                <Typography sx={{ color: '#41A3E3', ml: 1 }}> (ขนาดรูป 371 x 206 pixels)</Typography>
                                <TextField
                                    required
                                    sx={{ bgcolor: "white" }}
                                    fullWidth
                                    size="large"
                                    type="file"
                                    onChange={() => {

                                        uploadLogo()
                                    }}
                                />
                            </Grid>
                            {logo.length !== 0 ? <Grid item xs={12} container>
                                <Grid container sx={{ pl: 2, mb: 1, borderRadius: '10px' }}>
                                    {logo.map((item, index) => (
                                        <>
                                            <img src={item.img_url} width={371} height={206} />
                                            <IconButton sx={{ mb: 22, ml: 2, mr: 2, bgcolor: '#41A3E3', color: '#eee', boxShadow: '2px 2px 10px #C3C1C1' }}
                                                onClick={() => {
                                                    logo.splice(index, 1)
                                                    setRender(!render)
                                                }} >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    ))}

                                </Grid>

                            </Grid> : ''}

                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{ mr: 2, mb: 2, mt: -2 }}
                        color="primary"
                        size="large"
                        type="submit"
                        onClick={() => {
                            createGame("logo")
                        }}
                    >
                        <SportsEsportsIcon fontSize="large" />
                        <Typography sx={{ color: '#ffff', ml: 1 }}>Create game</Typography>
                    </Button>

                </DialogActions>
            </Dialog>


            <Dialog
                open={openDialogEdit}
                onClose={() => setOpenDialogEdit(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ mt: 1 }} > <EditIcon color="primary" fontSize="large" /> Edit game </DialogTitle>

                <DialogContent>
                    <Grid container justifyContent="center">
                        <Grid container spacing={2} >
                            <Grid container item xs={6}>
                                <Typography>Game name *</Typography>
                                <TextField
                                    name="game_name"
                                    type="text"
                                    value={rowData?.game_name || ""}
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                />
                            </Grid>

                            <Grid container item xs={6}>
                                <Typography>Game type *</Typography>
                                <TextField
                                    name="game_type"
                                    type="text"
                                    value={rowData?.game_type || ""}
                                    select
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                >
                                    <MenuItem selected disabled value>
                                        select game type
                                    </MenuItem>
                                    <MenuItem value="slot">Slot</MenuItem>
                                    <MenuItem value="plinko">Plinko</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid container item xs={6}>
                                <Typography>Game Link *</Typography>
                                <TextField
                                    name="game_url"
                                    type="text"
                                    value={rowData?.game_url || ""}
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                />
                            </Grid>

                            <Grid container item xs={6}>
                                <Typography>Status *</Typography>
                                <TextField
                                    name="game_status"
                                    type="text"
                                    value={rowData?.game_status || ""}
                                    select
                                    fullWidth
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ bgcolor: "white" }}
                                >
                                    <MenuItem selected disabled value>
                                        select game type
                                    </MenuItem>
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} container sx={{ mb: 2 }}>
                                <Typography >Game Logo * </Typography>
                                <Typography sx={{ color: '#41A3E3', ml: 1 }}> (ขนาดรูป 371 x 206 pixels)</Typography>
                                <TextField
                                    required
                                    sx={{ bgcolor: "white" }}
                                    fullWidth
                                    size="large"
                                    type="file"
                                    onChange={uploadLogo}
                                />
                            </Grid>
                            {logo.length !== 0 ? <Grid item xs={12} container>
                                <Grid container sx={{ pl: 2, mb: 1, borderRadius: '10px' }}>
                                    {logo.map((item, index) => (
                                        <>
                                            <img src={item.img_url} width={371} height={206} />
                                            <IconButton sx={{ mb: 22, ml: 2, mr: 2, bgcolor: '#41A3E3', color: '#eee', boxShadow: '2px 2px 10px #C3C1C1' }}
                                                onClick={() => {
                                                    logo.splice(index, 1)
                                                    setRender(!render)
                                                }} >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    ))}

                                </Grid>

                            </Grid> : ''}

                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{ mr: 2, mb: 2, mt: -2 }}
                        color="primary"
                        size="large"
                        type="submit"
                        onClick={() => {
                            editGame("logo")
                        }}
                    >
                        <EditIcon fontSize="large" />
                        <Typography sx={{ color: '#ffff', ml: 1 }}>Edit game</Typography>
                    </Button>

                </DialogActions>
            </Dialog>



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
