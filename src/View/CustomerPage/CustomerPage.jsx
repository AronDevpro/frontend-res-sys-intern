import {useEffect, useState} from 'react';
import {customer} from "../../utils/Server.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {Container} from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';

function CustomerPage() {
    const [customerList, setCustomerList]= useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [addCustomer, setAddCustomer] = useState({
        name:'',
        email:'',
        phone:''
    })

    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = () => setOpenUpdate(true);

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setSelectedCustomer('')
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
        setAddCustomer('')
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    function fetchCustomers(){
        fetch(customer).then(response => response.json())
            .then(data => setCustomerList(data.data))
            .catch((err) => {
            console.log(err.message);
        });
    }

    function handleDelete(id){
        fetch(`${customer}/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 200) {
                fetchCustomers();
            }
        })
    }

    const handleUpdate = (e) =>{
        const {name, value} = e.target;
        setSelectedCustomer((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleAdd = (e) =>{
        const {name, value} = e.target;
        setAddCustomer((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    function updateCustomer() {
        fetch(`${customer}/${selectedCustomer.customerId}`, {
            method:"PUT",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(selectedCustomer)
        }).then((r) => {
            if (r.status === 200) {
                handleCloseUpdate()
                fetchCustomers();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    function AddNewCustomer() {
        fetch(customer, {
            method:"POST",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(addCustomer)
        }).then((r) => {
            if (r.status === 201) {
                handleCloseAdd()
                fetchCustomers();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    return (
        <Box sx={{marginY:2}}>
            <Box
                component={Container}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                marginY={2}
            >
            <Button variant="contained" onClick={handleOpenAdd}>Add Customer</Button>
            </Box>
        <TableContainer component={Container} sx={{overflowX:{xs:'scroll', sm:'hidden'} }}>
            <Table  sx={{  padding:{xs:1, sm:3, md:5} }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontWeight:"bold", width:20}}>#id</TableCell>
                        <TableCell align="left" style={{fontWeight:"bold"}}>Name</TableCell>
                        <TableCell align="left" style={{fontWeight:"bold"}}>Email</TableCell>
                        <TableCell align="center" style={{fontWeight:"bold"}}>Phone</TableCell>
                        <TableCell align="right" style={{fontWeight:"bold"}}>Options</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customerList?.map((data) => (
                        <TableRow
                            key={data.customerId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {data.customerId}
                            </TableCell>
                            <TableCell align="left">{data.name}</TableCell>
                            <TableCell align="left">{data.email}</TableCell>
                            <TableCell align="center">{data.phone}</TableCell>
                            <TableCell align="right">
                                <Stack direction='row' sx={{gap: {xs:1, sm:2, md:3}}} justifyContent='right'>
                                <EditIcon onClick={()=>handleOpenUpdate(setSelectedCustomer(data))}/>
                                <DeleteIcon onClick={()=>handleDelete(data.customerId)}/>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            {/*model for update*/}
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
                        Customer Update
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                    <TextField id="outlined-basic"
                               label="Name"
                               variant="outlined"
                               defaultValue={selectedCustomer.name}
                               name="name"
                               onChange={handleUpdate}
                    />
                    <TextField id="outlined-basic"
                               label="Email"
                               variant="outlined"
                               defaultValue={selectedCustomer.email}
                               name="email"
                               onChange={handleUpdate}
                    />
                    <TextField id="outlined-basic"
                               label="Phone Number"
                               variant="outlined"
                               defaultValue={selectedCustomer.phone}
                               name="phone"
                               onChange={handleUpdate}
                    />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                    <Button variant="contained" onClick={updateCustomer}>Update</Button>
                    <Button variant="contained" onClick={handleCloseUpdate}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
                {/*model for add*/}
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
                            Add New Customer
                        </Typography>
                        <Stack gap={3} marginBottom={2}>
                            <TextField id="outlined-basic"
                                       label="Name"
                                       variant="outlined"
                                       name="name"
                                       onChange={handleAdd}
                            />
                            <TextField id="outlined-basic"
                                       label="Email"
                                       variant="outlined"
                                       name="email"
                                       onChange={handleAdd}
                            />
                            <TextField id="outlined-basic"
                                       label="Phone Number"
                                       variant="outlined"
                                       name="phone"
                                       onChange={handleAdd}
                            />
                        </Stack>
                        <Stack direction="row" justifyContent="right" gap={2}>
                            <Button variant="contained" onClick={AddNewCustomer}>Add</Button>
                            <Button variant="contained" onClick={handleCloseAdd}>Close</Button>
                        </Stack>
                    </Box>
            </Modal>
        </Box>
    );
}

export default CustomerPage;