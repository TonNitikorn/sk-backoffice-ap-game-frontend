import React, { useState, useEffect } from "react";
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
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Divider,
  Box,
  CardMedia,
  MenuItem
} from "@mui/material";
import moment from "moment";
import axios from "axios";
import hostname from "../utils/hostname";
import hostnameAP from "../utils/hostnameAP";
import LoadingModal from "../theme/LoadingModal";


function list() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [username, setUsername] = useState("");
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(false);



  const getReport = async (type, start, end) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostnameAP}/v1/member/getMemberTransaction`,
        data: {
          "start_date": type === undefined ? selectedDateRange.start : start,
          "end_date": type === undefined ? selectedDateRange.end : end,
          "username": username
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
        item.bet_amount_after = Intl.NumberFormat('th-TH', {style: 'currency',currency: 'THB',}).format(item.bet_amount_after)
        item.bet_amount_before = Intl.NumberFormat('th-TH', {style: 'currency',currency: 'THB',}).format(item.bet_amount_before)
        item.bet_result = Intl.NumberFormat('th-TH', {style: 'currency',currency: 'THB',}).format(item.bet_result)
        item.bet_amount = Intl.NumberFormat('th-TH', {style: 'currency',currency: 'THB',}).format(item.bet_amount)
      });
      setReport(resData);

      setLoading(false);
    } catch (error) {
      console.log(error);
      // if (
      //   error.response.data.error.status_code === 401 &&
      //   error.response.data.error.message === "Unauthorized"
      // ) {
      //   dispatch(signOut());
      //   localStorage.clear();
      //   router.push("/auth/login");
      // }
    }
  };

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
                getReport();
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

      <MaterialTable
        title=""
        columns={[
          { title: 'ลำดับที่', field: 'no',align:'center' },
          { title: 'ยูสเซอร์', field: 'username' },
          { title: 'เกม', field: 'game_name' },
          { title: 'จำนวน', field: 'bet_amount' },
          { title: 'ผลลัพธ์ ', field: 'bet_result' },
          { title: 'เครดิตก่อน bet', field: 'bet_amount_before' },
          { title: 'เครดิตหลัง bet	', field: 'bet_amount_after' },
          { title: 'ประเภทการเดิมพัน', field: 'bet_type' },
          // { title: 'สกุลเงิน', field: 'bet_currency' },
          { title: 'สถานะ', field: 'bet_status' },
          { title: 'เวลาเดิมพัน', field: 'create_at' },
          { title: 'อัปเดทรายการ', field: 'update_at' },
          { title: 'prefix', field: 'prefix',align:'center' },
          { title: 'รายละเอียด', field: 'bet_detail',align:'center' },
        ]}
        data={report}
        options={{
          exportMenu: [
            {
              label: "Export CSV",
              exportFunc: (cols, datas) =>
                ExportCsv(cols, datas, "รายการเดินบัญชี"),
            },
          ],
          search: true,
          columnsButton: true,
          columnResizable: true,
          rowStyle: {
            fontSize: 14,
          },
          headerStyle: {
            paddingTop: 5,
            paddingBottom: 5,
            align: "center",
            paddingRight: 0
          },
          pageSize: 20,
          pageSizeOptions: [10, 20, 100],
          padding: 0,
          filtering: true
        }}
        localization={{
          toolbar: {
            exportCSVName: "Export some excel format",
            exportPDFName: "Export as pdf!!"
          }
        }}
      />
      <LoadingModal open={loading} />
    </Layout>
  )
}

export default list
