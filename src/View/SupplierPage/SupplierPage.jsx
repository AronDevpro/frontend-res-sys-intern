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
import {useEffect, useState} from "react";
import {supplier} from "../../utils/Server.js";

function SupplierPage() {

    const [supplierList, setSupplierList]= useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [addSupplier, setAddSupplier] = useState({
        name:'',
        contactNumber:'',
        address:''
    })

    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = () => setOpenUpdate(true);

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setSelectedSupplier('')
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
        setAddSupplier('')
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    function fetchSuppliers(){
        fetch(supplier).then(response => response.json())
            .then(data => setSupplierList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }

    function handleDelete(id){
        fetch(`${supplier}/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 200) {
                fetchSuppliers();
            }
        })
    }

    const handleUpdate = (e) =>{
        const {name, value} = e.target;
        setSelectedSupplier((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleAdd = (e) =>{
        const {name, value} = e.target;
        setAddSupplier((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    function updateSupplier() {
        fetch(`${supplier}/${selectedSupplier.supplierId}`, {
            method:"PUT",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(selectedSupplier)
        }).then((r) => {
            if (r.status === 200) {
                handleCloseUpdate()
                fetchSuppliers();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    function AddNewSupplier() {
        fetch(supplier, {
            method:"POST",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(addSupplier)
        }).then((r) => {
            if (r.status === 201) {
                handleCloseAdd()
                fetchSuppliers();
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
                <Button variant="contained" onClick={handleOpenAdd}>Add Supplier</Button>
            </Box>
            <TableContainer component={Container} sx={{overflowX:{xs:'scroll', sm:'hidden'} }}>
                <Table  sx={{  padding:{xs:1, sm:3, md:5} }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight:"bold", width:20}}>#id</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Name</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Contact Number</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold"}}>Address</TableCell>
                            <TableCell align="right" style={{fontWeight:"bold"}}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supplierList?.map((data) => (
                            <TableRow
                                key={data.supplierId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {data.supplierId}
                                </TableCell>
                                <TableCell align="left">{data.name}</TableCell>
                                <TableCell align="left">{data.contactNumber}</TableCell>
                                <TableCell align="center">{data.address}</TableCell>
                                <TableCell align="right">
                                    <Stack direction='row' sx={{gap: {xs:1, sm:2, md:3}}} justifyContent='right'>
                                        <EditIcon onClick={()=>handleOpenUpdate(setSelectedSupplier(data))}/>
                                        <DeleteIcon onClick={()=>handleDelete(data.supplierId)}/>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Model for update */}
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
                        Supplier Update
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <TextField id="outlined-basic"
                                   label="Name"
                                   variant="outlined"
                                   defaultValue={selectedSupplier.name}
                                   name="name"
                                   onChange={handleUpdate}
                        />
                        <TextField id="outlined-basic"
                                   label="Contact Number"
                                   variant="outlined"
                                   defaultValue={selectedSupplier.contactNumber}
                                   name="contactNumber"
                                   onChange={handleUpdate}
                        />
                        <TextField id="outlined-basic"
                                   label="Address"
                                   variant="outlined"
                                   defaultValue={selectedSupplier.address}
                                   name="address"
                                   onChange={handleUpdate}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={updateSupplier}>Update</Button>
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
                        Add New Supplier
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <TextField id="outlined-basic"
                                   label="Name"
                                   variant="outlined"
                                   name="name"
                                   onChange={handleAdd}
                        />
                        <TextField id="outlined-basic"
                                   label="Contact Number"
                                   variant="outlined"
                                   name="contactNumber"
                                   onChange={handleAdd}
                        />
                        <TextField id="outlined-basic"
                                   label="Address"
                                   variant="outlined"
                                   name="address"
                                   onChange={handleAdd}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={AddNewSupplier}>Add</Button>
                        <Button variant="contained" onClick={handleCloseAdd}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}

export default SupplierPage;