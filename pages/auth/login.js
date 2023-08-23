import React, { useState, useEffect } from "react";
import Image from "next/image";
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
   Paper,
   AppBar,
   Container,
   Avatar,
   FormControlLabel,
   Checkbox,
   Link
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import { signIn } from "../../store/slices/userSlice";
import withAuth from "../../routes/withAuth";
import hostname from "../../utils/hostname";
import { useAppDispatch } from "../../store/store";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo_angpao from "../../assets/logo_ap.png"
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Login() {
   const theme = createTheme();
   const router = useRouter();
   const line = 'line'
   const dispatch = useAppDispatch();
   const [rowData, setRowData] = useState({});
   const [values, setValues] = useState({
      amount: "",
      password: "",
      weight: "",
      weightRange: "",
      showPassword: false,
   });

   const handleChangeData = async (e) => {
      setRowData({ ...rowData, [e.target.name]: e.target.value });
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

   return (
      <>
         {/* <div style={{ padding: "0 2rem" }} >
            <CssBaseline />
         
            <Grid container >
               <Grid item xs={3} />
               <Grid item xs={6} >
                  <Box sx={
                     {
                        display: { xs: "none", md: "block" },
                        flexGrow: 1,
                        mt: 20,
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 5,
                        boxShadow: '2px 2px 5px #C1B9B9',
                        border: "1px solid #C1B9B9"
                     }
                  } >
                     <Grid container direction="column"
                        justifyContent="center"
                        alignItems="center" >
                        < Typography variant="h5"
                           sx={{ mt: 3, color: "#41A3E3" }}> เข้าสู่ระบบ </Typography>
                     </Grid>
                     <Typography
                        sx={{ mt: 3, color: "#707070", fontSize: "14px" }} >
                        Username
                     </Typography>
                     <TextField name="username"
                        type="text"
                        value={rowData.username || ""}
                        placeholder="000-000-000"
                        fullWidth size="small"
                        onChange={
                           (e) => handleChangeData(e)}
                        variant="outlined"
                        sx={
                           { bgcolor: "white" }}
                        inputProps={
                           { maxLength: 10 }}
                     />
                     <Typography sx={{ mt: 2, color: "#707070", fontSize: "14px" }} > Password </Typography>
                     <div>
                        <FormControl fullWidth variant="outlined" size="small" >
                           <OutlinedInput id="outlined-adornment-password"
                              type={values.showPassword ? "text" : "password"}
                              value={values.password}
                              placeholder="password"
                              onChange={handleChange("password")}
                              endAdornment={<InputAdornment position="end" >
                                 <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end" >
                                    {values.showPassword ? < VisibilityOff /> : < Visibility />}
                                 </IconButton>
                              </InputAdornment>
                              }
                              sx={{ bgcolor: "white" }}
                           />
                        </FormControl>
                     </div>
                     <Button variant="contained"
                        fullWidth sx={{
                           my: 5,
                           bgcolor: '#41A3E3',
                           borderRadius: 5,
                           color: '#fff'
                        }}
                        onClick={
                           async () => {
                              const response = await dispatch(
                                 signIn({ username: rowData.username, password: values.password })
                              );
                              if (response.meta.requestStatus === "rejected") {
                                 // alert("Login failed");

                              } else {
                                 router.push("/home");
                              }
                           }
                        } >
                        เข้าสู่ระบบ </Button>

                  </Box>
               </Grid>
               < Grid item xs={3} /> </Grid>


         </div>  */}
         <ThemeProvider theme={theme}>

            <Container component="main" maxWidth="xs" sx={{ p: 3, mt: 10 }}>
               <Paper sx={{ p: 4 }} elevation={4}>
                  <CssBaseline />
                  <Box
                     sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                     }}
                  >
                     <Image
                        src={logo_angpao}
                        alt="scb"
                        width={130}
                        height={80}
                     />
                     <Typography component="h1" variant="h5">
                        เข้าสู่ระบบ
                     </Typography>
                     <Box noValidate sx={{ mt: 1 }}>
                        <TextField
                           margin="normal"
                           required
                           value={rowData.username || ""}
                           onChange={(e) => handleChangeData(e)}
                           fullWidth
                           label="Username"
                           name="username"
                           autoComplete="username"
                           autoFocus
                        />
                        <TextField
                           margin="normal"
                           required
                           fullWidth
                           value={rowData.password || ""}
                           onChange={(e) => handleChangeData(e)}
                           name="password"
                           label="Password"
                           type="password"
                           autoComplete="current-password"
                        />
                        <TextField
                           margin="normal"
                           required
                           fullWidth
                           value={rowData.prefix || ""}
                           onChange={(e) => handleChangeData(e)}
                           name="prefix"
                           label="prefix"
                           type="text"
                        />
                        <FormControlLabel
                           control={<Checkbox value="remember" color="primary" />}
                           label="Remember me"
                        />
                        <Button
                           type="submit"
                           fullWidth
                           variant="contained"
                           sx={{ mt: 3, mb: 2 }}
                           onClick={
                              async () => {
                                 const response = await dispatch(
                                    signIn({ username: rowData.username, password: rowData.password, prefix: rowData.prefix })
                                 );
                                 if (response.meta.requestStatus === "rejected") {
                                    alert("Login failed");

                                 } else {
                                    router.push("/dashboard");
                                 }
                              }
                           }
                        >
                           เข้าสู่ระบบ
                        </Button>
                        <Grid container>
                           <Grid item xs>
                              <Link href="#" variant="body2">
                                 ลืมพาสเวิร์ด?
                              </Link>
                           </Grid>
                           {/* <Grid item>
                              <Link href="#" variant="body2">
                                 {"Don't have an account? Sign Up"}
                              </Link>
                           </Grid> */}
                        </Grid>
                     </Box>
                  </Box>
               </Paper>
            </Container>


         </ThemeProvider>
      </>
   );
}

export default withAuth(Login);