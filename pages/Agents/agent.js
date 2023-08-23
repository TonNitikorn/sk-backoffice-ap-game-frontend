import React, { useState, useEffect, useRef } from "react";
import Layout from "../../theme/Layout";
import {
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  Snackbar,
  Chip,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Switch,
} from "@mui/material";
import { Table, Input, Space } from "antd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchIcon from "@mui/icons-material/Search";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LoadingModal from "../../theme/LoadingModal";
import axios from "axios";
import hostname from "../../utils/hostname";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import moment from "moment/moment";
import { useRouter } from "next/router";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function agent() {
  const router = useRouter();
  const [statusAgent, setStatusAgent] = useState(true);
  const [openEditData, setOpenEditData] = useState(false);
  const [openAddAgent, setOpenAddAgent] = useState(false);
  const [rowData, setRowData] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [agent, setAgent] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const [open, setOpen] = useState(false);

  const handleClickSnackbar = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1890ff" : undefined,
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

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleChange = (event) => {
    setStatusAgent(event.target.checked);
  };
  const handleChangeData = (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    setOpenEditData(false);
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การกระทำนี้จะไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบทิ้ง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAgent();
        Swal.fire("ลบแล้ว!", "ข้อมูลถูกลบออกแล้ว", "success");
      }
    });
  };

  const getAgentList = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "get",
        url: `${hostname}/agents/getAgent`,
      });
      let resData = res.data;
      let no = 1;
      resData.map((item) => {
        item.no = no++;
        item.create_at = moment(item.create_at).format("DD/MM/YYYY HH:mm");
      });
      setAgent(resData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addAgent = async () => {
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/agents/createAgent`,
        data: {
          prefix: rowData.prefix,
          secret_key: rowData.secret_key,
          ip: rowData.ip,
          currency: rowData.currency,
        },
      });
      setOpenAddAgent(false);
      setRowData({});
      Swal.fire({
        position: "center",
        icon: "success",
        title: "เพิ่มเอเยนต์สำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
      getAgentList();
    } catch (error) {
      console.log(error);
    }
  };

  const updateAgent = async () => {
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/agents/updateAgent`,
        data: {
          uuid: rowData.uuid,
          prefix: rowData.prefix,
          secret_key: rowData.secret_key,
          ip: rowData.ip,
          currency: rowData.currency,
        },
      });
      setOpenEditData(false);
      setRowData({});
      Swal.fire({
        position: "center",
        icon: "success",
        title: "แก้ไขเอเยนต์สำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
      getAgentList();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAgent = async () => {
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/agents/deleteAgent`,
        data: {
          uuid: rowData.uuid,
          prefix: rowData.prefix,
          secret_key: rowData.secret_key,
          ip: rowData.ip,
          currency: rowData.currency,
        },
      });
      setOpenEditData(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบเอเยนต์สำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
      getAgentList();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      align: "center",
      sorter: (record1, record2) => record1.no - record2.no,
      render: (item, data) => (
        <Typography sx={{ fontSize: "14px", textAlign: "center" }}>
          {item}
        </Typography>
      ),
    },
    {
      dataIndex: "status",
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={item === "ACTIVE" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          size="small"
          style={{
            padding: 10,
            backgroundColor: item === "ACTIVE" ? "#129A50" : "#BB2828",
            color: "#eee",
          }}
        />
      ),
      filters: [
        { text: "สำเร็จ", value: "SUCCESS" },
        { text: "ยกเลิก", value: "CANCEL" },
      ],
      onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
    },
    {
      title: "Agent Prefix",
      dataIndex: "prefix",
      render: (item, data) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {item}
        </Typography>
      ),
      ...getColumnSearchProps("prefix"),
    },
    {
      dataIndex: "secret_key",
      title: "secret_key",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {item}
        </Typography>
      ),
    },
    {
      dataIndex: "ip",
      title: "IP",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {item}
        </Typography>
      ),
    },
    {
      dataIndex: "currency",
      title: "Currency",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {item}
        </Typography>
      ),
    },
    {
      title: "แก้ไข",
      align: "center",
      maxWidth: "60px",
      render: (item, data) => {
        return (
          <>
            <IconButton
              onClick={async () => {
                setRowData(data);
                setOpenEditData({ open: true, data: data });
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getAgentList();
  }, []);

  return (
    <Layout>
      <Paper sx={{ p: 2 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <Typography variant="h5" sx={{ mt: 2 }}>
            Agent
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => setOpenAddAgent(true)}
              sx={{
                mr: "8px",
                my: 2,
                justifyContent: "flex-end",
                boxShadow: 1,
                background: "linear-gradient(#0072B1, #41A3E3)",
              }}
            >
              <PersonAddAltIcon sx={{ color: "white" }} />{" "}
              <Typography sx={{ color: "white", ml: 1 }}>
                เพิ่มเอเยนต์
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Paper>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Table
          columns={columns}
          dataSource={agent}
          onChange={onChange}
          size="small"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Paper>

      <Dialog
        open={openAddAgent}
        // onClose={() => setOpenEditData(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ bgcolor: "#345481" }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 1, color: "#FFF" }}
          >
            ตั้งค่า Prefix
            <IconButton onClick={() => setOpenAddAgent(false)}>
              <CloseIcon sx={{ color: "#FFF" }} />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ mt: 2, }}
          >
            <Grid item xs={6}>
              <Typography sx={{ mt: 2 }}>Company Prefix</Typography>
              <TextField
                name="prefix"
                type="text"
                fullWidth
                value={rowData?.prefix}
                placeholder="Company Prefix..."
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ mt: 2 }}>Secret Key</Typography>
              <TextField
                name="secret_key"
                type="text"
                fullWidth
                value={rowData?.secret_key}
                placeholder="Secret Key..."
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ mt: 2 }}>IP / White List</Typography>
              <TextField
                name="ip"
                type="text"
                fullWidth
                value={rowData?.ip}
                //   label="ค้นหาโดยใช้ Username"
                placeholder="IP / White List..."
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ mt: 2 }}>Currency</Typography>
              <TextField
                name="currency"
                type="text"
                fullWidth
                value={rowData?.currency}
                placeholder="Currency..."
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="end"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                onClick={() => {
                  addAgent();
                }}
              >
                <Typography sx={{ color: "#ffff" }}>ยืนยัน</Typography>
              </Button>
            </Grid>
          </Grid>

          {/* <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              ตั้งค่า JWT
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={6}>
                <Typography sx={{ mt: 2 }}>JWT Key</Typography>
                <TextField
                  name="username"
                  type="text"
                  fullWidth
                  value={rowData?.jwt_key || ""}
                  placeholder="JWT Key..."
                  onChange={(e) => handleChangeData(e)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ mt: 2 }}>API</Typography>
                <TextField
                  name="username"
                  type="text"
                  fullWidth
                  value={rowData?.api}
                  placeholder="API..."
                  onChange={(e) => handleChangeData(e)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="end"
              alignItems="center"
              sx={{ px: 20, mt: 3 }}
            >
              <Grid item xs={3}>
              <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  onClick={() => {
                    // getReport();
                  }}
                >
                  <Typography sx={{ color: "#ffff" }}>ยืนยัน</Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper> */}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditData.open}
        // onClose={() => setOpenEditData(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: "#345481" }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ my: 1, color: "#FFF" }}
          >
            แก้ไขข้อมูลเอเยนต์
            <IconButton onClick={() => setOpenEditData(false)}>
              <CloseIcon sx={{ color: "#FFF" }} />
            </IconButton>
          </Grid>
        </DialogTitle>

        <DialogContent>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ mt: 2 }}>Company Prefix</Typography>

              <TextField
                autoFocus
                name="prefix"
                value={rowData?.prefix}
                type="text"
                onChange={(e) => handleChangeData(e)}
                size="small"
                fullWidth
                variant="outlined"
              />
              <Typography sx={{ mt: 2 }}>Secret Key</Typography>

              <TextField
                autoFocus
                name="secret_key"
                value={rowData?.secret_key}
                size="small"
                type="text"
                fullWidth
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
              />
              <Typography sx={{ mt: 2 }}>IP / White List</Typography>

              <TextField
                autoFocus
                name="ip"
                value={rowData?.ip}
                size="small"
                type="text"
                fullWidth
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
              />
              <Typography sx={{ mt: 2 }}>Currency</Typography>

              <TextField
                name="currency"
                type="text"
                value={rowData?.currency}
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                placeholder="เลือกตำแหน่ง"
              />
              <Typography sx={{ mt: 2 }}>Status</Typography>

              <Switch
                checked={statusAgent}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2, p: 2 }}
            >
              <Grid item>
                <Button
                  onClick={handleDelete}
                  variant="outlined"
                  sx={{
                    color: "red",
                    border: "1px solid red",
                    "&:hover": {
                      backgroundColor: "red",
                      color: "#FFF",
                      border: "1px solid red",
                    },
                  }}
                >
                  ลบเอเยนต์
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => setOpenEditData(false)} sx={{ mr: 4 }}>
                  ยกเลิก
                </Button>
                <Button
                  onClick={() => updateAgent()}
                  variant="contained"
                  sx={{ color: "#ffff" }}
                >
                  ยืนยัน
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <snack />
      <LoadingModal open={loading} />
    </Layout>
  );
}

export default agent;

export function snack() {
  return (
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
  );
}
