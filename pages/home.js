import React, { useState, useEffect } from "react";
import Layout from "../theme/Layout";
import {
    Grid,
    Typography,
    Box,
    TextField,
    Paper,
    Button,
    Chip,
    Divider,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    CssBaseline,
    Table, TableRow, TableHead, TableContainer, TableCell, TableBody, CardContent, Card
} from "@mui/material";
import hostname from "../utils/hostname";
import axios from "axios";
import scbL from "../assets/scbL.png";
import Image from "next/image";
import moment from "moment/moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import withAuth from "../routes/withAuth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Swal from "sweetalert2";
import LoadingModal from "../theme/LoadingModal";
import { useAppDispatch } from "../store/store";
import { signOut } from "../store/slices/userSlice";
import { useRouter } from "next/router";
// import MaterialTableForm from '../components/materialTableForm';
import Pagination from '@mui/material/Pagination';
// import MaterialTable from '@material-table/core/'


function home() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openDialogView, setOpenDialogView] = useState(false);
    const [search, setSearch] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataLast, setDataLast] = useState([])
    const [bankData, setBankData] = useState([]);

    const getDataLast = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/dashboard/transaction/last`,
            });
            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD-MM-YYYY hh:mm")
                item.bank_name = item.members?.bank_name
                item.bank_number = item.members?.bank_number
                item.username = item.members?.username
            });
            setDataLast(resData);
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
    const getBank = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/bank/bank_list`,
            });
            let resData = res.data;
            let lastData = resData.filter(item => item.type === "DEPOSIT")
            let no = 1;
            lastData.map((item) => {
                item.no = no++;
                item.birthdate = moment(item.birthdate).format("DD-MM-YYYY")
            });
            setBankData(lastData);
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


    useEffect(() => {
        // getDataLast()
        // getBank()
    }, [])


    return (
        <Layout title="home">
            <CssBaseline />
            
            <LoadingModal open={loading} />
        </Layout>
    );
}

// export default withAuth(home);

export default home