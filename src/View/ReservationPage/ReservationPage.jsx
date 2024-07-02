import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {Container} from "@mui/system";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import EditIcon from "@mui/icons-material/Edit.js";
import DeleteIcon from "@mui/icons-material/Delete.js";
import Modal from "@mui/material/Modal";
import {customer, reservation} from "../../utils/Server.js";

function ReservationPage() {
    const [reservationList, setReservationList] = useState([]);
    const [customerList, setCustomerList]= useState([]);

    const [selectedReservation, setSelectedReservation] = useState('');
    const [addReservation, setAddReservation] = useState({
        customer_id: '',
        reservation_date: '',
        reservation_time: '',
        numberOfPeople: ''
    })

    console.log(selectedReservation)

    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = () => setOpenUpdate(true);

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setSelectedReservation('')
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
        setAddReservation('')
    };

    useEffect(() => {
        fetchReservations();
        fetchCustomers();
    }, []);

    function fetchCustomers(){
        fetch(customer).then(response => response.json())
            .then(data => setCustomerList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }

    function fetchReservations() {
        fetch(reservation).then(response => response.json())
            .then(data => setReservationList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }

    function handleDelete(id) {
        fetch(`${reservation}/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 200) {
                fetchReservations();
            }
        })
    }

    const handleUpdate = (e) => {
        const {name, value} = e.target;
        setSelectedReservation((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleAdd = (e) => {
        const {name, value} = e.target;
        setAddReservation((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    function updateReservation() {
        fetch(`${reservation}/${selectedReservation.reservationId}`, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(selectedReservation)
        }).then((r) => {
            if (r.status === 200) {
                handleCloseUpdate()
                fetchReservations();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    function AddNewReservation() {
        fetch(reservation, {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(addReservation)
        }).then((r) => {
            if (r.status === 201) {
                handleCloseAdd()
                fetchReservations();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }


    return (
        <Box>
            <Box
                component={Container}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                marginY={2}
            >
                <Button variant="contained" onClick={handleOpenAdd}>Add Reservation</Button>
            </Box>
            <TableContainer component={Container} sx={{overflowX: {xs: 'scroll', sm: 'hidden'}}}>
                <Table sx={{padding: {xs: 1, sm: 3, md: 5}}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold", width: 20}}>#id</TableCell>
                            <TableCell align="left" style={{fontWeight: "bold"}}>CustomerId</TableCell>
                            <TableCell align="left" style={{fontWeight: "bold"}}>Date</TableCell>
                            <TableCell align="center" style={{fontWeight: "bold"}}>Time</TableCell>
                            <TableCell align="right" style={{fontWeight: "bold"}}>No of People</TableCell>
                            <TableCell align="right" style={{fontWeight: "bold"}}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservationList?.map((data) => (
                            <TableRow
                                key={data.reservationId}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {data.reservationId}
                                </TableCell>
                                <TableCell align="left">{data.customer_id}</TableCell>
                                <TableCell align="left">{data.reservation_date}</TableCell>
                                <TableCell align="center">{data.reservation_time}</TableCell>
                                <TableCell align="right">{data.numberOfPeople}</TableCell>
                                <TableCell align="right">
                                    <Stack direction='row' sx={{gap: {xs: 1, sm: 2, md: 3}}} justifyContent='right'>
                                        <EditIcon onClick={() => handleOpenUpdate(setSelectedReservation(data))}/>
                                        <DeleteIcon onClick={() => handleDelete(data.reservationId)}/>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*model for update reservation*/}
            <Modal
                open={openUpdate}
                onClose={handleCloseUpdate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" align="center" marginY={2}>
                        Reservation Update
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Customer Id</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Customer Id"
                                value={selectedReservation.customer_id || ''}
                                onChange={handleUpdate}
                                name="customer_id"
                            >
                                {customerList.map((data)=>(
                                <MenuItem  value={data.customerId} key={data.customerId}>{data.customerId} - {data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField id="outlined-basic"
                                   label="Date"
                                   variant="outlined"
                                   defaultValue={selectedReservation.reservation_date}
                                   name="reservation_date"
                                   onChange={handleUpdate}
                                   type="date"
                        />
                        <TextField id="outlined-basic"
                                   label="Time"
                                   variant="outlined"
                                   defaultValue={selectedReservation.reservation_time}
                                   name="reservation_time"
                                   onChange={handleUpdate}
                                   type="time"
                        />
                        <TextField id="outlined-basic"
                                   label="No of People"
                                   variant="outlined"
                                   defaultValue={selectedReservation.numberOfPeople}
                                   name="numberOfPeople"
                                   onChange={handleUpdate}
                                   type="number"
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={updateReservation}>Update</Button>
                        <Button variant="contained" onClick={handleCloseUpdate}>Close</Button>
                    </Stack>
                </Box>
            </Modal>

            {/* model for add reservation*/}
            <Modal
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" align="center" marginY={2}>
                        Add New Reservation
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Customer Id</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Customer Id"
                                onChange={handleAdd}
                                name="customer_id"
                            >
                                {customerList.map((data)=>(
                                    <MenuItem value={data.customerId} key={data.customerId}>{data.customerId} - {data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField id="outlined-basic"
                                   label="Date"
                                   variant="outlined"
                                   name="reservation_date"
                                   onChange={handleAdd}
                                   type="date"
                        />
                        <TextField id="outlined-basic"
                                   label="Time"
                                   variant="outlined"
                                   name="reservation_time"
                                   onChange={handleAdd}
                                   type="time"
                        />
                        <TextField id="outlined-basic"
                                   label="No of People"
                                   variant="outlined"
                                   name="numberOfPeople"
                                   onChange={handleAdd}
                                   type="number"
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={AddNewReservation}>Add</Button>
                        <Button variant="contained" onClick={handleCloseAdd}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}

export default ReservationPage;