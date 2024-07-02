import {
    Box,
    Button, Collapse,
    FormControl, IconButton,
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
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from "@mui/material/Modal";
import {useEffect, useState} from "react";
import {customer, menu, order} from "../../utils/Server.js";
import AddIcon from '@mui/icons-material/Add';
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import React from 'react';

function OrderPage() {
    const [orderList, setOrderList]= useState([]);
    const [customerList, setCustomerList]= useState([]);
    const [menuList, setMenuList]= useState([]);
    const [item, setItem]= useState({
        menuId:'',
        quantity:''
    });
    const [itemList, setItemList]= useState([]);

    const [addOrder, setAddOrder] = useState({
        customerId:'',
        orderItems:[]
    })

    console.log(orderList)

    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);

    const handleCloseAdd = () => {
        setOpenAdd(false);
        setAddOrder({
            customerId: '',
            orderItems: []
        });
        setItemList([]);
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

    const addItemToList = () => {
        setItemList(prevItemList => [...prevItemList, item]);

        // setAddOrder(prevOrder => ({
        //     ...prevOrder,
        //     orderItems: [...prevOrder.orderItems, item]
        // }));

        setItem({
            menuId: '',
            quantity: ''
        });
    }

    function AddNewOrder() {
        let data;
        if (itemList.length>0){
        data = {...addOrder, orderItems: itemList}
        }
        console.log(data)
        fetch(order, {
            method:"POST",
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data)
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

    function calculateTotal() {
        let total = 0;

        for (let item of itemList) {
            const menuItem = menuList.find(menuItem => menuItem.menuId === item.menuId);

            if (menuItem) {
                const price = menuItem.price * item.quantity;
                console.log(`Price for item with menuId ${item.menuId}: ${price}`);

                total = total+price;
            } else {
                console.log(`Menu item with menuId ${item.menuId} not found.`);
            }
        }
        return total;
    }
    const [open, setOpen] = useState({});

    const handleToggle = (orderId) => {
        setOpen((prevOpen) => ({ ...prevOpen, [orderId]: !prevOpen[orderId] }));
    };

    function getMenuName(id){
        const menuItem = menuList.find(menuItem => menuItem.menuId === id);

        return menuItem.itemName;
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
                            <TableCell style={{fontWeight:"bold", width:20}}></TableCell>
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
                            <React.Fragment key={data.orderId}>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => handleToggle(data.orderId)}
                                        >
                                            {open[data.orderId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {data.orderId}
                                    </TableCell>
                                    <TableCell align="left">{data.customerId}</TableCell>
                                    <TableCell align="left">{data.orderDate}</TableCell>
                                    <TableCell align="center">{data.totalAmount}</TableCell>
                                    <TableCell align="center">{data.status}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction='row' sx={{ gap: { xs: 1, sm: 2, md: 3 } }} justifyContent='right'>
                                            <CancelIcon onClick={() => cancelOrder(data.orderId)} />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={open[data.orderId]} timeout="auto" unmountOnExit>
                                            <Box marginY={1} width="inherit">
                                                <TableContainer component={Paper}>
                                                    <Table aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center" sx={{fontWeight:"bold"}}>Items</TableCell>
                                                                <TableCell align="center" sx={{fontWeight:"bold"}}>Quantity</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data?.orderItems?.map((row,index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell align="center">
                                                                        {getMenuName(row.menuId)}
                                                                    </TableCell>
                                                                    <TableCell align="center">{row.quantity}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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

                    <Typography id="modal-modal-title" variant="h4" component="h2" align="center" marginY={2}>
                        Total : {calculateTotal()}
                    </Typography>
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