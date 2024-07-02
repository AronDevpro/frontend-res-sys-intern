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
import {menu} from "../../utils/Server.js";

function MenuPage() {
    const [menuList, setMenuList]= useState([]);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [addMenu, setAddMenu] = useState({
        itemName:'',
        price:''
    })

    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = () => setOpenUpdate(true);

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setSelectedMenu('')
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
        setAddMenu('')
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    function fetchMenus(){
        fetch(menu).then(response => response.json())
            .then(data => setMenuList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }

    function handleDelete(id){
        fetch(`${menu}/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 200) {
                fetchMenus();
            }
        })
    }

    const handleUpdate = (e) =>{
        const {name, value} = e.target;
        setSelectedMenu((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleAdd = (e) =>{
        const {name, value} = e.target;
        setAddMenu((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    function updateMenu() {
        fetch(`${menu}/${selectedMenu.menuId}`, {
            method:"PUT",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(selectedMenu)
        }).then((r) => {
            if (r.status === 200) {
                handleCloseUpdate()
                fetchMenus();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    function AddNewMenu() {
        fetch(menu, {
            method:"POST",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(addMenu)
        }).then((r) => {
            if (r.status === 201) {
                handleCloseAdd()
                fetchMenus();
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
                <Button variant="contained" onClick={handleOpenAdd}>Add Menu</Button>
            </Box>
            <TableContainer component={Container} sx={{overflowX:{xs:'scroll', sm:'hidden'} }}>
                <Table  sx={{  padding:{xs:1, sm:3, md:5} }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight:"bold"}}>#id</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Item Name</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold"}}>Price</TableCell>
                            <TableCell align="right" style={{fontWeight:"bold"}}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menuList?.map((data) => (
                            <TableRow
                                key={data.menuId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {data.menuId}
                                </TableCell>
                                <TableCell align="left">{data.itemName}</TableCell>
                                <TableCell align="center">{data.price}</TableCell>
                                <TableCell align="right">
                                    <Stack direction='row' sx={{gap: {xs:1, sm:2, md:3}}} justifyContent='right'>
                                        <EditIcon onClick={()=>handleOpenUpdate(setSelectedMenu(data))}/>
                                        <DeleteIcon onClick={()=>handleDelete(data.menuId)}/>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                        Menu Update
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <TextField id="outlined-basic"
                                   label="Item Name"
                                   variant="outlined"
                                   defaultValue={selectedMenu.itemName}
                                   name="itemName"
                                   onChange={handleUpdate}
                        />
                        <TextField id="outlined-basic"
                                   label="Price"
                                   variant="outlined"
                                   defaultValue={selectedMenu.price}
                                   name="price"
                                   type="number"
                                   onChange={handleUpdate}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={updateMenu}>Update</Button>
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
                        Add New Menu
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <TextField id="outlined-basic"
                                   label="Item Name"
                                   variant="outlined"
                                   name="itemName"
                                   onChange={handleAdd}
                        />
                        <TextField id="outlined-basic"
                                   label="Price"
                                   variant="outlined"
                                   name="price"
                                   type="number"
                                   onChange={handleAdd}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={AddNewMenu}>Add</Button>
                        <Button variant="contained" onClick={handleCloseAdd}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}

export default MenuPage;