import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Typography,
  Chip,
  Box,
  IconButton,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Grid,
  TextField,
  Paper
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";


function TableForm(props) {
  const data = props.data

  const [searchData, setSearchData] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [complaintData, setComplaintData] = useState([]);
  const [dataList, setDataList] = useState(data)
  console.log('data', data)
  console.log('dataList', dataList)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const requestSearchItem = (searchedVal) => {
    const filteredRows = searchData.filter((row) => {
      let searchDesc =
        row.fname +
        row.lname ;
      return searchDesc
        .toLowerCase()
        .includes(searchedVal.target.value.toLowerCase());
    });
    setDataList(filteredRows);
  };



  return (
    <Paper>
      <Grid container style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          {/* <SearchBar
              value={searchedItem}
              onChange={(searchVal) => requestSearchItem(searchVal)}
              onCancelSearch={() => cancelSearchItem()}
              sx={{ mb: "10px" }}
            /> */}
          <TextField
            fullWidth
            placeholder="Search"
            variant="outlined"
            onChange={(e) => {
              requestSearchItem(e);
            }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchOutlined />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid
        style={{
          marginTop: "20px",
          // borderRadius: "20px",
          // boxShadow: "1px 1px 5px #bdbdbd",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#41A3E3' }}>
            <TableRow>
              <TableCell>Dessert </TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Fat&nbsp;(g)</TableCell>
              <TableCell>Carbs&nbsp;(g)</TableCell>
              <TableCell>Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>

          {dataList.length !== 0 ? dataList : data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <>
                <TableBody sx={{ bgcolor: '#eee' }}>
                  <TableRow>
                    <TableCell>{item.fname}</TableCell>
                    <TableCell>{item.lname}</TableCell>
                    <TableCell>{item.fname}</TableCell>
                    <TableCell>{item.lname}</TableCell>
                    <TableCell>{item.fname}</TableCell>
                  </TableRow>
                </TableBody>
              </>
            ))}
        </Table>
      </Grid>
      <TablePagination
        showFirstButton="true"
        showLastButton="true"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dataList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default TableForm;
