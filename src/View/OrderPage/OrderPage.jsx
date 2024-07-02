import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Container} from "@mui/system";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import EditIcon from "@mui/icons-material/Edit.js";
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from "@mui/material/Modal";
import {useEffect, useState} from "react";
import {customer, menu, order} from "../../utils/Server.js";
import AddIcon from '@mui/icons-material/Add';

function OrderPage() {
    const [orderList, setOrderList]= useState([]);
    const [customerList, setCustomerList]= useState([]);
    const [menuList, setMenuList]= useState([]);
    const [item, setItem]= useState({
        menuId:'',
        quantity:''
    });
    const [itemList, setItemList]= useState([]);

    const [selectedOrder, setSelectedOrder] = useState('');
    const [addOrder, setAddOrder] = useState({
        customerId:'',
        orderItems:[]
    })
    console.log(addOrder)
    console.log("item list ",itemList)

    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = () => setOpenUpdate(true);

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseUpdate = () => {
        setOpenUpdate(false)
        setSelectedOrder('')
    };

    const handleCloseAdd = () => {
        setOpenAdd(false)
        setAddOrder('')
        setItemList([])
    };

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchMenus();
    }, []);

    function fetchCustomers(){
        fetch(customer).then(response => response.json())
            .then(data => setCustomerList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }
    function fetchMenus(){
        fetch(menu).then(response => response.json())
            .then(data => setMenuList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }


    function fetchOrders(){
        fetch(order).then(response => response.json())
            .then(data => setOrderList(data.data))
            .catch((err) => {
                console.log(err.message);
            });
    }

    function handleDelete(id){
        fetch(`${order}/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 200) {
                fetchOrders();
            }
        })
    }

    const handleUpdate = (e) =>{
        const {name, value} = e.target;
        setSelectedOrder((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleAdd = (e) =>{
        const {name, value} = e.target;
        setAddOrder((preData) => ({
            ...preData,
            [name]: value,
        }))
    }

    const handleItemAdd = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'quantity' ? parseInt(value, 10) : value;

        setItem((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));
    };

    const addItemToList=()=>{
        setItemList([...itemList, item]);
        setAddOrder(prevOrder => ({
            ...prevOrder,
            orderItems: itemList
        }));
        setItem({
            menuId:'',
            quantity:''
        });
    }

    function updateOrder() {
        fetch(`${order}/${selectedOrder.orderId}`, {
            method:"PUT",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(selectedOrder)
        }).then((r) => {
            if (r.status === 200) {
                handleCloseUpdate()
                fetchOrders();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    function AddNewOrder() {
        console.log(data)
        fetch(order, {
            method:"POST",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(addOrder)
        }).then((r) => {
            if (r.status === 201) {
                handleCloseAdd()
                fetchOrders();
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }


    function cancelOrder(id) {
        fetch(`${order}/cancel/${id}`, {
            method:"PUT",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then((r) => {
            if (r.status === 200) {
                fetchOrders();
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
                <Button variant="contained" onClick={handleOpenAdd}>Add Order</Button>
            </Box>
            <TableContainer component={Container} sx={{overflowX:{xs:'scroll', sm:'hidden'} }}>
                <Table  sx={{  padding:{xs:1, sm:3, md:5} }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight:"bold", width:20}}>#id</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Customer Id</TableCell>
                            <TableCell align="left" style={{fontWeight:"bold"}}>Date</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold"}}>Total Amount</TableCell>
                            <TableCell align="center" style={{fontWeight:"bold"}}>Status</TableCell>
                            <TableCell align="right" style={{fontWeight:"bold"}}>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList?.map((data) => (
                            <TableRow
                                key={data.orderId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {data.orderId}
                                </TableCell>
                                <TableCell align="left">{data.customerId}</TableCell>
                                <TableCell align="left">{data.orderDate}</TableCell>
                                <TableCell align="center">{data.totalAmount}</TableCell>
                                <TableCell align="center">{data.status}</TableCell>
                                <TableCell align="right">
                                    <Stack direction='row' sx={{gap: {xs:1, sm:2, md:3}}} justifyContent='right'>
                                        <EditIcon onClick={()=>handleOpenUpdate(setSelectedOrder(data))}/>
                                        <CancelIcon onClick={()=>cancelOrder(data.orderId)}/>
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
                        Order Update
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <TextField id="outlined-basic"
                                   label="Name"
                                   variant="outlined"
                                   defaultValue={selectedOrder.name}
                                   name="name"
                                   onChange={handleUpdate}
                        />
                        <TextField id="outlined-basic"
                                   label="Email"
                                   variant="outlined"
                                   defaultValue={selectedOrder.email}
                                   name="email"
                                   onChange={handleUpdate}
                        />
                        <TextField id="outlined-basic"
                                   label="Phone Number"
                                   variant="outlined"
                                   defaultValue={selectedOrder.phone}
                                   name="phone"
                                   onChange={handleUpdate}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={updateOrder}>Update</Button>
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
                        Add New Order
                    </Typography>
                    <Stack gap={3} marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Customer Id</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Customer Id"
                                onChange={handleAdd}
                                name="customerId"
                            >
                                {customerList.map((data)=>(
                                    <MenuItem value={data.customerId} key={data.customerId}>{data.customerId} - {data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Stack direction="row" alignItems="center" gap={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Menu Id</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Menu Id"
                                onChange={handleItemAdd}
                                name="menuId"
                            >
                                {menuList.map((data)=>(
                                    <MenuItem value={data.menuId} key={data.menuId}>{data.menuId} - {data.itemName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                            <TextField id="outlined-basic"
                                       label="Quantity"
                                       variant="outlined"
                                       name="quantity"
                                       type="number"
                                       value={item.quantity}
                                       onChange={handleItemAdd}
                            />
                            <AddIcon fontSize="large" sx={{textAlign:"center"}} onClick={addItemToList}/>
                        </Stack>
                    </Stack>
                    {itemList.length !== 0 &&
                    <TableContainer component={Paper} sx={{marginY:3}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Menu</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemList.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{row.menuId}</TableCell>
                                        <TableCell align="center">{row.quantity}</TableCell>
                                        <TableCell align="right"><CancelIcon/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    }
                    <Stack direction="row" justifyContent="right" gap={2}>
                        <Button variant="contained" onClick={AddNewOrder}>Add</Button>
                        <Button variant="contained" onClick={handleCloseAdd}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}

export default OrderPage;