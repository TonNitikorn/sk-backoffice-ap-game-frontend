import React, { useState, useEffect, useRef } from "react";
import Layout from '../theme/Layout'
import MaterialTable from '@material-table/core'
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

function list() {
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
  const [memberList, setMemberList] = useState([])

  const getMemberList = async (type, start, end) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: { Authorization: "Bearer " + localStorage.getItem("access_token"), },
        method: "get",
        url: `${hostname}/transaction/get_allmember`,
      });
      let resData = res.data.member;
      let no = 1;
      resData.map((item) => {
        item.no = no++;
        item.fullname = item.fname + ' ' + item.lname
      });
      setMemberList(resData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    //   if (
    //     error.response.data.error.status_code === 401 &&
    //     error.response.data.error.message === "Unauthorized"
    //   ) {
    //     dispatch(signOut());
    //     localStorage.clear();
    //     router.push("/auth/login");
    //   }
    }
  };
  console.log('memberList', memberList)

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
      title: 'ลำดับ',
      dataIndex: 'no',
      align: 'center',
      sorter: (record1, record2) => record1.no - record2.no,
      render: (item, data) => (
        <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >{item}</Typography>
      )
    },

    {
      title: 'บัญชี',
      dataIndex: 'username',
      align: 'left',
      width: 250,
      render: (item, data) => (
        <CopyToClipboard text={item}>
          <div style={{ "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } } }} >
            <Button
              sx={{
                fontSize: "14px",
                p: 0,
                color: "blue",
              }}
              onClick={handleClickSnackbar}
            >
              {item}
            </Button>
          </div>
        </CopyToClipboard>
      ),
      ...getColumnSearchProps('username'),

    },
    {
      dataIndex: "fullname",
      title: "ชื่อ",
      align: "left",
      width: 200,
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
      ...getColumnSearchProps('fullname'),
    },
    {
      dataIndex: "rank",
      title: "rank",
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
      dataIndex: "bet_amount",
      title: "สกุลเงิน",
      align: "center",
      width: 100,
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{'THB'}</Typography>
      ),
    },
    {
      dataIndex: "credit",
      title: "จำนวนเครดิต",
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
      dataIndex: "bet_amount_before",
      title: "จำนวนรอบเดิมพัน",
      align: "center",
      width: 160,
      ...getColumnSearchProps('bet_amount_before'),
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
      ),
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
    // getMemberList()
  }, [])

  return (
    <Layout>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>รายการการแพ้ชนะ</Typography>
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
                // getReport();
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
          columns={columnsMember}
          dataSource={memberList}
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


            pageData.forEach(({ credit, betAmount, credit_after, sumCredit, sumCreditBefore, sumCreditAfter }) => {
              totalCredit += parseInt(credit);
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
                  <Table.Summary.Cell />
                  <Table.Summary.Cell >
                    <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >
                      {Intl.NumberFormat("TH").format(parseInt(totalCredit))}
                    </Typography>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell >
                    <Typography align="center" sx={{ fontWeight: "bold", }} >
                      {/* {Intl.NumberFormat("TH").format(parseInt(totalCredit))} */}
                      จำนวนรอบรวม API 
                    </Typography>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />

                </Table.Summary.Row>

              </>
            );
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

export default list
