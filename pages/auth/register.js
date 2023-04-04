import React, { useState, useEffect } from "react";
import Image from "next/image";
// import logo from "/assets/logo.png";
import {
    Button,
    Grid,
    Typography,
    IconButton,
    TextField,
    FormControl,
    Box,
    InputAdornment,
    OutlinedInput,
    Switch,
    MenuItem,
    Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from "@mui/material/CssBaseline";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EastIcon from '@mui/icons-material/East';
import axios from "axios";
import hostname from "../../utils/hostname";


function register() {
    const router = useRouter()
    const [bonus, setBonus] = useState(true);
    const [rowData, setRowData] = useState({});
    const [loading, setLoading] = useState(false);
    const [tabOtp, setTabOtp] = useState(new Array(6).fill(""))

    const [page, setPage] = useState(0)
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });
    const [valuesCf, setValuesCf] = useState({
        password: "",
        showPassword: false,
    });

    const handleChangeData = async (e) => {
        setRowData({ ...rowData, [e.target.name]: e.target.value });
    };

    const handleChangeOtp = (element, index) => {
        if (isNaN(element.value)) return false

        setTabOtp([...tabOtp.map((d, idx) => (idx === index) ? element.value : d)])

        if (element.nextSibling) {
            element.nextSibling.focus()
        }
    }

    const handleChangeBonus = (event) => {
        setBonus(event.target.checked);
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChangeCf = (prop) => (event) => {
        setValuesCf({ ...valuesCf, [prop]: event.target.value });
    };
    const handleClickShowPasswordCf = () => {
        setValuesCf({
            ...valuesCf,
            showPassword: !valuesCf.showPassword,
        });
    };

    const handleMouseDownPasswordCf = (event) => {
        event.preventDefault();
    };


    const register = async () => {
        try {
            let res = await axios({
                method: "post",
                url: `${hostname}/auth/register`,
                data: {
                    fname: rowData.fname,
                    lname: rowData.lname,
                    bank_number: rowData.bank_number,
                    bank_name: rowData.bank_name,
                    password: values.password,
                    tel: rowData.tel,
                    affiliate_by: "-",
                    line_id: rowData.line_id,
                    platform: "postman",
                }
            });

            if (res.data.message === "Register success") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'สมัครสมาชิกสำเร็จ',
                    showConfirmButton: false,
                    timer: 2000
                })
                router.push("/auth/login")
            }

        } catch (error) {
            console.log(error);
            // if (
            //   error.response.status === 401 &&
            //   error.response.data === "Unauthorized"
            // ) {
            //   dispatch(signOut());
            //   localStorage.clear();
            //   router.push("/auth/login");
            // }
        }
    }

    return (
        <div style={{ padding: "0 2rem" }}>
            <CssBaseline />

            <AppBar position="fixed" color="primary" elevation={0} sx={{ borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography sx={{ mt: 1 }}
                                    onClick={() => {
                                        router.push('/')
                                    }}>LOGO</Typography>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>

            <Grid container direction="row"
                justifyContent="center"
                alignItems="center" >
                <Grid item xs={3}></Grid>
                <Grid item xs={6} sx={{ display: { xs: "none", md: "block" }, }}>
                    {
                        page === 0 ?
                            <Box sx={{ mt: 10 }}>
                                <Paper elevation={1} sx={{ p: 3 }}>
                                    <Grid container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"><AccountCircleIcon sx={{ color: '#41A3E3' }} />
                                        <Typography sx={{ color: "#41A3E3", ml: 1 }}>สมัครสมาชิก</Typography>
                                    </Grid>

                                    <Grid container
                                        direction="column"
                                        sx={{ mt: 3 }}>
                                        <Typography sx={{ color: "#707070", fontSize: "14px" }}>เบอร์โทรศัพท์</Typography>
                                        <TextField
                                            name="tel"
                                            type="text"
                                            value={rowData.tel || ""}
                                            placeholder="เบอร์โทรศัพท์ของท่าน"
                                            fullWidth
                                            size="small"
                                            onChange={(e) => handleChangeData(e)}
                                            variant="outlined"
                                            inputProps={{ maxLength: 10 }}
                                            sx={{ borderRadius: "20px", mt: 1 }}
                                        />

                                    </Grid>

                                    <Grid container
                                        direction="row"
                                        sx={{ mt: 1 }}>
                                        <Typography sx={{ color: "#707070", fontSize: "12px", mt: 1 }}>มีบัญชีอยู่แล้ว ?  </Typography>
                                        <Button
                                            variant="text"
                                            onClick={() => router.push("/auth/login")}
                                        >
                                            <Typography sx={{ color: "#41A3E3", fontSize: "12px", textDecoration: 'underline' }} >เข้าสู่ระบบ</Typography>
                                        </Button>

                                    </Grid>

                                    <Grid container
                                        direction="column"
                                        alignItems='center'
                                        justifyContent='center'
                                        sx={{ mt: 3 }}>
                                        <Typography sx={{ color: "#979797", fontSize: "14px" }}>1/3</Typography>
                                    </Grid>
                                </Paper>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mt: 3 }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#E4E4E4', borderRadius: 10 }}
                                        onClick={() => router.push("/auth/login")}
                                    >
                                        <KeyboardBackspaceIcon fontSize="small" sx={{ color: '#7C7C7C' }} />
                                        <Typography sx={{ color: '#7C7C7C', fontSize: '10px', ml: 1 }}>ย้อนกลับ</Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: 10 }}
                                        onClick={() => {
                                            if (!rowData.tel) {
                                                Swal.fire({
                                                    position: 'center',
                                                    icon: 'warning',
                                                    title: 'กรุณากรอกเบอร์โทรศัพท์',
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                })
                                            } else {
                                                setPage(1)
                                            }
                                        }
                                        }
                                    >
                                        <Typography sx={{ color: '#fff', fontSize: '10px', mr: 1 }}> {" "}ต่อไป {"  "}</Typography>
                                        <EastIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </Button>
                                </Grid>
                            </Box>
                            : page === 1 ?
                                <Box sx={{ mt: 10 }}>
                                    <Paper elevation={1} sx={{ p: 3 }}>
                                        <Grid container
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center">
                                            <AccountCircleIcon sx={{ color: '#41A3E3' }} />
                                            <Typography sx={{ color: "#41A3E3", ml: 1 }}>สมัครสมาชิก</Typography>
                                        </Grid>

                                        <Grid container
                                            direction="column"
                                            sx={{ mt: 3 }}>
                                            <Typography sx={{ color: "#707070", fontSize: "14px" }}>ธนาคารสำหรับฝาก - ถอนเงิน</Typography>
                                            <TextField
                                                name="bank_name"
                                                type="text"
                                                value={rowData.bank_name || ""}
                                                select
                                                fullWidth
                                                size="small"
                                                onChange={(e) => handleChangeData(e)}
                                                variant="outlined"
                                                sx={{ bgcolor: "white", borderRadius: 1 }}
                                            >
                                                <MenuItem selected disabled value>
                                                    เลือก ธนาคาร
                                                </MenuItem>
                                                <MenuItem value="kbnk">ธนาคารกสิกรไทย</MenuItem>
                                                <MenuItem value="truemoney">TrueMoney Wallet</MenuItem>
                                                <MenuItem value="ktba">ธนาคารกรุงไทย</MenuItem>
                                                <MenuItem value="scb">ธนาคารไทยพาณิชย์</MenuItem>
                                                <MenuItem value="bay">ธนาคารกรุงศรีอยุธยา</MenuItem>
                                                <MenuItem value="bbla">ธนาคารกรุงเทพ</MenuItem>
                                                <MenuItem value="gsb">ธนาคารออมสิน</MenuItem>
                                                <MenuItem value="ttb">ธนาคารทหารไทยธนชาต (TTB)</MenuItem>
                                                <MenuItem value="BAAC">
                                                    ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
                                                </MenuItem>
                                                <MenuItem value="ICBC">ธนาคารไอซีบีซี (ไทย)</MenuItem>
                                                <MenuItem value="TCD">ธนาคารไทยเครดิตเพื่อรายย่อย</MenuItem>
                                                <MenuItem value="CITI">ธนาคารซิตี้แบงก์</MenuItem>
                                                <MenuItem value="SCBT">ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)</MenuItem>
                                                <MenuItem value="CIMB">ธนาคารซีไอเอ็มบีไทย</MenuItem>
                                                <MenuItem value="UOB">ธนาคารยูโอบี</MenuItem>
                                                <MenuItem value="HSBC">ธนาคารเอชเอสบีซี ประเทศไทย</MenuItem>
                                                <MenuItem value="MIZUHO">ธนาคารมิซูโฮ คอร์ปอเรต</MenuItem>
                                                <MenuItem value="GHB">ธนาคารอาคารสงเคราะห์</MenuItem>
                                                <MenuItem value="LHBANK">ธนาคารแลนด์ แอนด์ เฮ้าส์</MenuItem>
                                                <MenuItem value="TISCO">ธนาคารทิสโก้</MenuItem>
                                                <MenuItem value="kkba">ธนาคารเกียรตินาคิน</MenuItem>
                                                <MenuItem value="IBANK">ธนาคารอิสลามแห่งประเทศไทย</MenuItem>
                                            </TextField>

                                            <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                                หมายเลขบัญชี*
                                            </Typography>
                                            <TextField
                                                name="bank_number"
                                                type="number"
                                                value={rowData.bank_number || ""}
                                                placeholder="000-000-000"
                                                fullWidth
                                                size="small"
                                                onChange={(e) => handleChangeData(e)}
                                                variant="outlined"
                                                sx={{ bgcolor: "white", borderRadius: 1 }}
                                            />
                                            <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>รหัสผ่าน</Typography>
                                            <FormControl fullWidth variant="outlined" size="small">
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type={values.showPassword ? "text" : "password"}
                                                    value={values.password}
                                                    placeholder="password"
                                                    onChange={handleChange("password")}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    sx={{ bgcolor: "white" }}
                                                />
                                            </FormControl>
                                            <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                                ยืนยันรหัสผ่าน
                                            </Typography>

                                            <FormControl fullWidth variant="outlined" size="small">
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type={valuesCf.showPassword ? "text" : "password"}
                                                    value={valuesCf.password}
                                                    placeholder="password"
                                                    onChange={handleChangeCf("password")}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPasswordCf}
                                                                onMouseDown={handleMouseDownPasswordCf}
                                                                edge="end"
                                                            >
                                                                {valuesCf.showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    sx={{ bgcolor: "white" }}
                                                />
                                            </FormControl>

                                            <Grid container spacing={2} direction="row">
                                                <Grid item xs={6}>
                                                    <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                                        ชื่อ*
                                                    </Typography>
                                                    <TextField
                                                        name="fname"
                                                        type="text"
                                                        value={rowData.fname || ""}
                                                        placeholder="ชื่อจริง"
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e) => handleChangeData(e)}
                                                        variant="outlined"
                                                        sx={{ bgcolor: "white", borderRadius: 1 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                                        นามสกุล*
                                                    </Typography>
                                                    <TextField
                                                        name="lname"
                                                        type="text"
                                                        value={rowData.lname || ""}
                                                        placeholder="นามสกุลจริง"
                                                        fullWidth
                                                        size="small"
                                                        onChange={(e) => handleChangeData(e)}
                                                        variant="outlined"
                                                        sx={{ bgcolor: "white", borderRadius: 1 }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                                Line Id*
                                            </Typography>
                                            <TextField
                                                name="line_id"
                                                type="text"
                                                value={rowData.line_id || ""}
                                                placeholder="line id"
                                                fullWidth
                                                size="small"
                                                onChange={(e) => handleChangeData(e)}
                                                variant="outlined"
                                                sx={{ bgcolor: "white", borderRadius: 1 }}
                                            />

                                        </Grid>

                                        <Grid container
                                            direction="row"
                                            sx={{ mt: 1 }}>
                                            <Typography sx={{ color: "#707070", fontSize: "12px", mt: 1 }}>มีบัญชีอยู่แล้ว ?  </Typography>
                                            <Button
                                                variant="text"
                                                onClick={() => router.push("/auth/login")}
                                            >
                                                <Typography sx={{ color: "#41A3E3", fontSize: "12px", textDecoration: 'underline' }} >เข้าสู่ระบบ</Typography>
                                            </Button>

                                        </Grid>

                                        <Grid container
                                            direction="column"
                                            alignItems='center'
                                            justifyContent='center'
                                            sx={{ mt: 3 }}>
                                            <Typography sx={{ color: "#979797", fontSize: "14px" }}>2/3</Typography>
                                        </Grid>
                                    </Paper>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mt: 3 }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: '#E4E4E4', borderRadius: 10 }}
                                            onClick={() => setPage(0)}
                                        >
                                            <KeyboardBackspaceIcon fontSize="small" sx={{ color: '#7C7C7C' }} />
                                            <Typography sx={{ color: '#7C7C7C', fontSize: '10px', ml: 1 }}>ย้อนกลับ</Typography>
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ borderRadius: 10 }}
                                            onClick={() => setPage(2)}
                                        >
                                            <Typography sx={{ color: '#fff', fontSize: '10px', mr: 1 }}> {" "}ต่อไป {"  "}</Typography>
                                            <EastIcon fontSize="small" sx={{ color: '#fff' }} />
                                        </Button>
                                    </Grid>
                                </Box>
                                : page === 2 ?
                                    <>
                                        <Box sx={{ mt: 10 }}>
                                            <Paper elevation={1} sx={{ p: 3 }}>
                                                <Grid container
                                                    direction="row"
                                                    justifyContent="center"
                                                    alignItems="center"><AccountCircleIcon sx={{ color: '#41A3E3' }} />
                                                    <Typography sx={{ color: "#41A3E3", ml: 1 }}>สมัครสมาชิก</Typography>
                                                </Grid>

                                                <Grid container
                                                    direction="column"
                                                    sx={{ mt: 3 }}>
                                                    <Typography sx={{ color: "#4B4949", fontSize: "16px" }}>ยืนยันตัวตน OTP</Typography>

                                                    <Typography sx={{ mt: 1, color: "#707070", fontSize: "14px" }}>ส่งรหัส 6 หลักไปที่ {rowData.tel || ''}</Typography>
                                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                        {tabOtp.map((data, index) => {
                                                            return (
                                                                <input
                                                                    style={{ width: 30, height: 45, marginLeft: '2%', textAlign: 'center', borderRadius: '10px', border: '1px solid #41A3E3' }}
                                                                    type="number"
                                                                    name="otp"
                                                                    maxLength="1"
                                                                    key={index}
                                                                    value={data}
                                                                    onChange={e => handleChangeOtp(e.target, index)}
                                                                    onFocus={e => e.target.select()}
                                                                />
                                                            )
                                                        })}
                                                    </Box>
                                                    <Typography sx={{ color: "#707070", fontSize: "14px" }}>รหัสอ้างอิง : r14dx8k</Typography>

                                                </Grid>
                                                <Grid container
                                                    direction="row">
                                                    <Typography sx={{ color: "#707070", fontSize: "12px", mt: 1 }}>ไม่ได้รับรหัส OTP ? ?  </Typography>
                                                    <Button
                                                        variant="text"
                                                        onClick={() => router.push("/auth/login")}
                                                    >
                                                        <Typography sx={{ color: "#41A3E3", fontSize: "12px", textDecoration: 'underline' }} >ส่งรหัสอีกครั้ง</Typography>
                                                    </Button>

                                                </Grid>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    sx={{ mt: 3 }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        sx={{ borderRadius: 10 }}
                                                        // onClick={() => router.push("/auth/login")}
                                                        onClick={() => register()}
                                                        fullWidth
                                                    >
                                                        <Typography sx={{ color: '#fff', mr: 1 }}> {" "}ยืนยัน {"  "}</Typography>
                                                    </Button>
                                                </Grid>
                                                <Grid container
                                                    direction="column"
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    sx={{ mt: 3 }}>
                                                    <Typography sx={{ color: "#979797", fontSize: "14px" }}>3/3</Typography>
                                                </Grid>
                                            </Paper>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ mt: 3 }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    sx={{ bgcolor: '#E4E4E4', borderRadius: 10 }}
                                                    onClick={() => setPage(1)}
                                                >
                                                    <KeyboardBackspaceIcon fontSize="small" sx={{ color: '#7C7C7C' }} />
                                                    <Typography sx={{ color: '#7C7C7C', fontSize: '10px', ml: 1 }}>ย้อนกลับ</Typography>
                                                </Button>

                                            </Grid>
                                        </Box>
                                    </>
                                    : ''
                    }

                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>

            <Box sx={{ display: { xs: "block", md: "none" }, }}>
                {
                    page === 0 ?
                        <Box sx={{ mt: 10 }}>
                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Grid container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"><AccountCircleIcon sx={{ color: '#41A3E3' }} />
                                    <Typography sx={{ color: "#41A3E3", ml: 1 }}>สมัครสมาชิก</Typography>
                                </Grid>

                                <Grid container
                                    direction="column"
                                    sx={{ mt: 3 }}>
                                    <Typography sx={{ color: "#707070", fontSize: "14px" }}>เบอร์โทรศัพท์</Typography>
                                    <TextField
                                        name="tel"
                                        type="number"
                                        value={rowData.tel || ""}
                                        placeholder="เบอร์โทรศัพท์ของท่าน"
                                        fullWidth
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ borderRadius: "20px", mt: 1 }}
                                    />

                                </Grid>

                                <Grid container
                                    direction="row"
                                    sx={{ mt: 1 }}>
                                    <Typography sx={{ color: "#707070", fontSize: "12px", mt: 1 }}>มีบัญชีอยู่แล้ว ?  </Typography>
                                    <Button
                                        variant="text"
                                        onClick={() => router.push("/auth/login")}
                                    >
                                        <Typography sx={{ color: "#41A3E3", fontSize: "12px", textDecoration: 'underline' }} >เข้าสู่ระบบ</Typography>
                                    </Button>

                                </Grid>

                                <Grid container
                                    direction="column"
                                    alignItems='center'
                                    justifyContent='center'
                                    sx={{ mt: 3 }}>
                                    <Typography sx={{ color: "#979797", fontSize: "14px" }}>1/3</Typography>
                                </Grid>
                            </Paper>
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mt: 3 }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: '#E4E4E4', borderRadius: 10 }}
                                    onClick={() => router.push("/auth/login")}
                                >
                                    <KeyboardBackspaceIcon fontSize="small" sx={{ color: '#7C7C7C' }} />
                                    <Typography sx={{ color: '#7C7C7C', fontSize: '10px', ml: 1 }}>ย้อนกลับ</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ borderRadius: 10 }}
                                    onClick={() => setPage(1)}
                                >
                                    <Typography sx={{ color: '#fff', fontSize: '10px', mr: 1 }}> {" "}ต่อไป {"  "}</Typography>
                                    <EastIcon fontSize="small" sx={{ color: '#fff' }} />
                                </Button>
                            </Grid>
                        </Box>
                        : page === 1 ?
                            <Box sx={{ mt: 10 }}>
                                <Paper elevation={1} sx={{ p: 3 }}>
                                    <Grid container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center">
                                        <AccountCircleIcon sx={{ color: '#41A3E3' }} />
                                        <Typography sx={{ color: "#41A3E3", ml: 1 }}>สมัครสมาชิก</Typography>
                                    </Grid>

                                    <Grid container
                                        direction="column"
                                        sx={{ mt: 3 }}>
                                        <Typography sx={{ color: "#707070", fontSize: "14px" }}>ธนาคารสำหรับฝาก - ถอนเงิน</Typography>
                                        <TextField
                                            name="bank_name"
                                            type="text"
                                            value={rowData.bank_name || ""}
                                            select
                                            fullWidth
                                            size="small"
                                            onChange={(e) => handleChangeData(e)}
                                            variant="outlined"
                                            sx={{ bgcolor: "white", borderRadius: 1 }}
                                        >
                                            <MenuItem selected disabled value>
                                                เลือก ธนาคาร
                                            </MenuItem>
                                            <MenuItem value="kbnk">ธนาคารกสิกรไทย</MenuItem>
                                            <MenuItem value="truemoney">TrueMoney Wallet</MenuItem>
                                            <MenuItem value="ktba">ธนาคารกรุงไทย</MenuItem>
                                            <MenuItem value="scb">ธนาคารไทยพาณิชย์</MenuItem>
                                            <MenuItem value="bay">ธนาคารกรุงศรีอยุธยา</MenuItem>
                                            <MenuItem value="bbla">ธนาคารกรุงเทพ</MenuItem>
                                            <MenuItem value="gsb">ธนาคารออมสิน</MenuItem>
                                            <MenuItem value="ttb">ธนาคารทหารไทยธนชาต (TTB)</MenuItem>
                                            <MenuItem value="BAAC">
                                                ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
                                            </MenuItem>
                                            <MenuItem value="ICBC">ธนาคารไอซีบีซี (ไทย)</MenuItem>
                                            <MenuItem value="TCD">ธนาคารไทยเครดิตเพื่อรายย่อย</MenuItem>
                                            <MenuItem value="CITI">ธนาคารซิตี้แบงก์</MenuItem>
                                            <MenuItem value="SCBT">ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)</MenuItem>
                                            <MenuItem value="CIMB">ธนาคารซีไอเอ็มบีไทย</MenuItem>
                                            <MenuItem value="UOB">ธนาคารยูโอบี</MenuItem>
                                            <MenuItem value="HSBC">ธนาคารเอชเอสบีซี ประเทศไทย</MenuItem>
                                            <MenuItem value="MIZUHO">ธนาคารมิซูโฮ คอร์ปอเรต</MenuItem>
                                            <MenuItem value="GHB">ธนาคารอาคารสงเคราะห์</MenuItem>
                                            <MenuItem value="LHBANK">ธนาคารแลนด์ แอนด์ เฮ้าส์</MenuItem>
                                            <MenuItem value="TISCO">ธนาคารทิสโก้</MenuItem>
                                            <MenuItem value="kkba">ธนาคารเกียรตินาคิน</MenuItem>
                                            <MenuItem value="IBANK">ธนาคารอิสลามแห่งประเทศไทย</MenuItem>
                                        </TextField>

                                        <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                            หมายเลขบัญชี*
                                        </Typography>
                                        <TextField
                                            name="bank_number"
                                            type="number"
                                            value={rowData.bank_number || ""}
                                            placeholder="000-000-000"
                                            fullWidth
                                            size="small"
                                            onChange={(e) => handleChangeData(e)}
                                            variant="outlined"
                                            sx={{ bgcolor: "white", borderRadius: 1 }}
                                        />
                                        <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>รหัสผ่าน</Typography>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={values.showPassword ? "text" : "password"}
                                                value={values.password}
                                                placeholder="password"
                                                onChange={handleChange("password")}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                sx={{ bgcolor: "white" }}
                                            />
                                        </FormControl>
                                        <Typography sx={{ mt: 1, color: "#707070", fontSize: '12px' }}>
                                            ยืนยันรหัสผ่าน
                                        </Typography>

                                        <FormControl fullWidth variant="outlined" size="small">
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={valuesCf.showPassword ? "text" : "password"}
                                                value={valuesCf.password}
                                                placeholder="password"
                                                onChange={handleChangeCf("password")}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPasswordCf}
                                                            onMouseDown={handleMouseDownPasswordCf}
                                                            edge="end"
                                                        >
                                                            {valuesCf.showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                sx={{ bgcolor: "white" }}
                                            />
                                        </FormControl>

                                    </Grid>

                                    <Grid container
                                        direction="row"
                                        sx={{ mt: 1 }}>
                                        <Typography sx={{ color: "#707070", fontSize: "12px", mt: 1 }}>มีบัญชีอยู่แล้ว ?  </Typography>
                                        <Button
                                            variant="text"
                                            onClick={() => router.push("/auth/login")}
                                        >
                                            <Typography sx={{ color: "#41A3E3", fontSize: "12px", textDecoration: 'underline' }} >เข้าสู่ระบบ</Typography>
                                        </Button>

                                    </Grid>

                                    <Grid container
                                        direction="column"
                                        alignItems='center'
                                        justifyContent='center'
                                        sx={{ mt: 3 }}>
                                        <Typography sx={{ color: "#979797", fontSize: "14px" }}>2/3</Typography>
                                    </Grid>
                                </Paper>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mt: 3 }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#E4E4E4', borderRadius: 10 }}
                                        onClick={() => setPage(0)}
                                    >
                                        <KeyboardBackspaceIcon fontSize="small" sx={{ color: '#7C7C7C' }} />
                                        <Typography sx={{ color: '#7C7C7C', fontSize: '10px', ml: 1 }}>ย้อนกลับ</Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: 10 }}
                                        onClick={() => setPage(2)}
                                    >
                                        <Typography sx={{ color: '#fff', fontSize: '10px', mr: 1 }}> {" "}ต่อไป {"  "}</Typography>
                                        <EastIcon fontSize="small" sx={{ color: '#fff' }} />
                                    </Button>
                                </Grid>
                            </Box>
                            : page === 2 ?
                                <>
                                    <Box sx={{ mt: 10 }}>
                                        <Paper elevation={1} sx={{ p: 3 }}>
                                            <Grid container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"><AccountCircleIcon sx={{ color: '#41A3E3' }} />
                                                <Typography sx={{ color: "#41A3E3", ml: 1 }}>สมัครสมาชิก</Typography>
                                            </Grid>

                                            <Grid container
                                                direction="column"
                                                sx={{ mt: 3 }}>
                                                <Typography sx={{ color: "#4B4949", fontSize: "16px" }}>ยืนยันตัวตน OTP</Typography>

                                                <Typography sx={{ mt: 1, color: "#707070", fontSize: "14px" }}>ส่งรหัส 6 หลักไปที่ 0987644452</Typography>
                                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                    {tabOtp.map((data, index) => {
                                                        return (
                                                            <input
                                                                style={{ width: 30, height: 45, marginLeft: '2%', textAlign: 'center', borderRadius: '10px', border: '1px solid #41A3E3' }}
                                                                type="number"
                                                                name="otp"
                                                                maxLength="1"
                                                                key={index}
                                                                value={data}
                                                                onChange={e => handleChangeOtp(e.target, index)}
                                                                onFocus={e => e.target.select()}
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                                <Typography sx={{ color: "#707070", fontSize: "14px" }}>รหัสอ้างอิง : r14dx8k</Typography>

                                            </Grid>
                                            <Grid container
                                                direction="row">
                                                <Typography sx={{ color: "#707070", fontSize: "12px", mt: 1 }}>ไม่ได้รับรหัส OTP ? ?  </Typography>
                                                <Button
                                                    variant="text"
                                                    onClick={() => router.push("/auth/login")}
                                                >
                                                    <Typography sx={{ color: "#41A3E3", fontSize: "12px", textDecoration: 'underline' }} >ส่งรหัสอีกครั้ง</Typography>
                                                </Button>

                                            </Grid>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                sx={{ mt: 3 }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    sx={{ borderRadius: 10 }}
                                                    onClick={() => router.push("/auth/login")}
                                                    fullWidth
                                                >
                                                    <Typography sx={{ color: '#fff', fontSize: '10px', mr: 1 }}> {" "}ยืนยัน {"  "}</Typography>
                                                </Button>
                                            </Grid>
                                            <Grid container
                                                direction="column"
                                                alignItems='center'
                                                justifyContent='center'
                                                sx={{ mt: 3 }}>
                                                <Typography sx={{ color: "#979797", fontSize: "14px" }}>3/3</Typography>
                                            </Grid>
                                        </Paper>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 3 }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{ bgcolor: '#E4E4E4', borderRadius: 10 }}
                                                onClick={() => setPage(1)}
                                            >
                                                <KeyboardBackspaceIcon fontSize="small" sx={{ color: '#7C7C7C' }} />
                                                <Typography sx={{ color: '#7C7C7C', fontSize: '10px', ml: 1 }}>ย้อนกลับ</Typography>
                                            </Button>

                                        </Grid>
                                    </Box>
                                </>
                                : ''
                }
            </Box>
        </div>



    )
}

export default register
