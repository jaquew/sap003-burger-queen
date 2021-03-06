import React from 'react'
import growl from 'growl-alert'
import 'growl-alert/dist/growl-alert.css'
import { StyleSheet, css } from 'aphrodite';
import firebase from 'firebase';

import Input from '../Input'
import Firebase from '../../utils/firebaseUtils'
import Button from '../Button'


const Order = ({ orders, total, plusItem, setTotal, setOrders, table, setTable, setActiveMenu, clientName,setName}) => {

	const deleteItem = (item) => {
	const index = (orders.indexOf(item));
	orders.splice(index, 1)
	setOrders([...orders]);
	const deleteTotal = total - (item.price * item.count)
	setTotal(deleteTotal)
	}

	const minusItem = (item) => {
	if (item.count === 1){
		deleteItem(item)
	} else {			
		item.count -= 1
		setOrders([...orders]);
		const minusTotal = total  - item.price
		setTotal(minusTotal)
	}
	}

	const sendOrder = (orders) => {
		if (orders.length && table) {
			const product = orders.map((order) =>  ({count: order.count, name: order.name}))
			
			const clientOrder = {
				name: clientName,
				table: table,
				product,
				time: firebase.firestore.FieldValue.serverTimestamp(),
				total: total,
				ready: false,
				status: "Pronto",
			}
			Firebase.fire.collection('Pedidos').add(clientOrder)
			setOrders([]);
			setTotal(0)
			setName('');
			setTable(0);
			growl.success({text: 'Pedido Enviado', fadeAway: true, fadeAwayTimeout: 2500});
			setActiveMenu({a:true, b:false, c:false})

		} else if (!orders.length) {
			growl.warning({text:'Coloque pelo menos 1 item no pedido!', fadeAway: true, fadeAwayTimeout: 2500})
			
		} else {
			growl.warning({text:'Preencha o número da mesa!',fadeAway: true, fadeAwayTimeout: 2500})
		}
	}


	return(	
	<section className={css(styles.orderbox)}>
			<h3 className={css(styles.boxTitle)}>Pedido de {clientName}</h3>
			<h4>Mesa {table}</h4>
			{orders.map((order) =>(
			<div key={order.id} className={css(styles.placeorder)}>
				<div className={css(styles.ordername)}>
					<p>{order.name}</p>
				</div>
				<div className={css(styles.control)}>  
					<Input className={css(styles.updatebtn)} type="image" src="images/minus.png" handleclick={() => minusItem(order)}/>

					<span>{order.count}</span>

					<Input className={css(styles.updatebtn)} type="image" src="images/add.png" handleclick={() => plusItem(order)}/>
				</div>

				<div className={css(styles.price)}>
					<span>R${order.price * order.count},00</span>  
					<Input className={css(styles.updatebtn)} type="image" src="images/remove.png" handleclick={() => deleteItem(order)} />
				</div>
			</div>
		))}
		<p className={css(styles.total)}>Total: R${total},00</p>
		<Button className={css(styles.sendbtn)} handleclick={() => sendOrder(orders)}>Enviar para Cozinha</Button>
	</section>
	)
}

const styles = StyleSheet.create({
	orderbox:{
		width: "30%",
		margin: "5px",
    marginRight: "15px",
    '@media (max-width: 850px)': {
      width: "40%",

    },
	},
	boxTitle:{
		width: "90%",
		fontSize: "1.3rem",
		textAlign: "center",
    margin: "10px 0",
    color: "#FFEE62",
  },
	clientData: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center"
	},
	updatebtn: {
		height: "25px",
		width: "25px",
		padding: "5px",
		margin: "0 10px"
	},
	placeorder:{
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-evenly",
		margin: "5px 0",
	},
	ordername: {
		width: "100%",
		textAlign: "center"
	},
	price: {
		justifyContent: "flex-end",
		display: "flex",
		alignItems: "center",
		width: "30%"
	},
	control:{
		width: "30%",
		display: "flex",
		alignItems: "center"
	},
	total: {
		fontSize: "1.4em",
		textAlign: "right",
		margin: "10px 15%"
	},
	sendbtn: {
		backgroundColor: "Transparent",
		color: "#fff",
		borderRadius: "15px",
		width: "100%",
		margin: "5px auto",
		height: "60px",
		fontSize: "1.2em",
		border: "3px solid #25B6D2",
		':active': {
			backgroundColor: "#25B6D2",
		},
	}
})
	
export default Order