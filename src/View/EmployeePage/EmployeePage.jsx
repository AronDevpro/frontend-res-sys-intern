import {useEffect, useState} from "react";
import {employee} from "../../utils/Server.js";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
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

function EmployeePage() {
    const [employeeList, setEmployeeList]= useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [addEmployee, setAddEmployee] = useState({
        firstName:'',
        lastName:'',
        address:'',
        phoneNumber:'',
        dob:'',
        nic:'',
        position:'',
        salary:''
    })


    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = () => setOpenUpdate(true);

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setSelectedEmployee('')
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
        setAddEmployee('')
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    function fetchEmployees(){
        fetch(employee).then(response => response.json())
            .then(data => setEmployeeList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }

    function handleDelete(id){
        fetch(`${employee}/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 200) {
                fetchEmployees();
            }
        })
    }

    const handleUpdate = (e) =>{
        const {name, value} = e.target;
        setSelectedEmployee((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleAdd = (e) =>{
        const {name, value} = e.target;
        setAddEmployee((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    function updateEmployee() {
        fetch(`${employee}/${selectedEmployee.employeeId}`, {
            method:"PUT",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(selectedEmployee)
        }).then((r) => {
            if (r.status === 200) {
                handleCloseUpdate()
                fetchEmployees();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    function AddNewEmployee() {
        fetch(employee, {
            method:"POST",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(addEmployee)
        }).then((r) => {
            if (r.status === 201) {
                handleCloseAdd()
                fetchEmployees();
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
                <Button variant="contained" onClick={handleOpenAdd}>Add Employee</Button>
            </Box>
            <TableContainer component={Container} sx={{overflowX:{xs:'scroll', sm:'hidden'} }}>
                <Table  sx={{  padding:{xs:1, sm:3, md:5} }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight:"bold", width:20}}>#id</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Name</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Address</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold"}}>Phone Number</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold"}}>Position</TableCell>
                            <TableCell align="right" style={{fontWeight:"bold"}}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeList?.map((data) => (
                            <TableRow
                                key={data.employeeId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {data.employeeId}
                                </TableCell>
                                <TableCell align="left">{data.firstName} {data.lastName}</TableCell>
                                <TableCell align="left">{data.address}</TableCell>
                                <TableCell align="center">{data.phoneNumber}</TableCell>
                                <TableCell align="center">{data.position}</TableCell>
                                <TableCell align="right">
                                    <Stack direction='row' sx={{gap: {xs:1, sm:2, md:3}}} justifyContent='right'>
                                        <EditIcon onClick={()=>handleOpenUpdate(setSelectedEmployee(data))}/>
                                        <DeleteIcon onClick={()=>handleDelete(data.employeeId)}/>
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
                        Employee Update
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <Stack direction="row" gap={2}>
                            <TextField id="outlined-basic"
                                       label="First Name"
                                       variant="outlined"
                                       defaultValue={selectedEmployee.firstName}
                                       name="firstName"
                                       onChange={handleUpdate}
                                       fullWidth
                            />
                            <TextField id="outlined-basic"
                                       label="Last Name"
                                       variant="outlined"
                                       defaultValue={selectedEmployee.lastName}
                                       name="lastName"
                                       onChange={handleUpdate}
                                       fullWidth
                            />
                        </Stack>
                        <TextField id="outlined-basic"
                                   label="Address"
                                   variant="outlined"
                                   defaultValue={selectedEmployee.address}
                                   name="address"
                                   onChange={handleUpdate}
                        />
                        <TextField id="outlined-basic"
                                   label="Phone Number"
                                   variant="outlined"
                                   defaultValue={selectedEmployee.phoneNumber}
                                   name="phoneNumber"
                                   onChange={handleUpdate}
                        />
                        <Stack direction="row" gap={2}>
                            <TextField id="outlined-basic"
                                       label="Date of Birth"
                                       variant="outlined"
                                       defaultValue={selectedEmployee.dob}
                                       name="dob"
                                       type="date"
                                       onChange={handleUpdate}
                            />
                            <TextField id="outlined-basic"
                                       label="NIC"
                                       variant="outlined"
                                       defaultValue={selectedEmployee.nic}
                                       name="nic"
                                       onChange={handleUpdate}
                            />
                        </Stack>
                        <Stack direction="row" gap={2}>
                            <TextField id="outlined-basic"
                                       label="Position"
                                       variant="outlined"
                                       defaultValue={selectedEmployee.position}
                                       name="position"
                                       onChange={handleUpdate}
                                       fullWidth
                            />
                            <TextField id="outlined-basic"
                                       label="Salary"
                                       variant="outlined"
                                       defaultValue={selectedEmployee.salary}
                                       name="salary"
                                       type="number"
                                       onChange={handleUpdate}
                                       fullWidth
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={updateEmployee}>Update</Button>
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
                        Add New Employee
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <Stack direction="row" gap={2}>
                        <TextField id="outlined-basic"
                                   label="First Name"
                                   variant="outlined"
                                   name="firstName"
                                   onChange={handleAdd}
                                   fullWidth
                        />
                        <TextField id="outlined-basic"
                                   label="Last Nme"
                                   variant="outlined"
                                   name="lastName"
                                   onChange={handleAdd}
                                   fullWidth
                        />
                        </Stack>
                        <TextField id="outlined-basic"
                                   label="Address"
                                   variant="outlined"
                                   name="address"
                                   onChange={handleAdd}
                        />
                        <TextField id="outlined-basic"
                                   label="Phone Number"
                                   variant="outlined"
                                   name="phoneNumber"
                                   onChange={handleAdd}
                        />
                        <Stack direction="row" gap={2}>
                        <TextField id="outlined-basic"
                                   label="Date of Birth"
                                   variant="outlined"
                                   name="dob"
                                   type="date"
                                   onChange={handleAdd}
                                   fullWidth
                        />
                        <TextField id="outlined-basic"
                                   label="NIC"
                                   variant="outlined"
                                   name="nic"
                                   onChange={handleAdd}
                                   fullWidth
                        />
                        </Stack>
                        <Stack direction="row" gap={2}>
                            <TextField id="outlined-basic"
                                       label="Position"
                                       variant="outlined"
                                       name="position"
                                       onChange={handleAdd}
                                       fullWidth
                            />
                            <TextField id="outlined-basic"
                                       label="Salary"
                                       variant="outlined"
                                       name="salary"
                                       type="number"
                                       onChange={handleAdd}
                                       fullWidth
                            />
                        </Stack>
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={AddNewEmployee}>Add</Button>
                        <Button variant="contained" onClick={handleCloseAdd}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}

export default EmployeePage;