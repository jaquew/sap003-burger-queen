import React, {useEffect} from 'react'
import { StyleSheet, css } from 'aphrodite';
import firebase from '../../utils/firebaseUtils'
import Button from '../../components/Button'
import OrderCard from '../../components/OrderCard'
import HistoryCard from '../../components/HistoryCard'

const DoneOrders = ({doneOrders}) => {    
  const ordersShow = doneOrders.filter(order => order.delivered===false)
  const orderHistory = doneOrders.filter(order => order.delivered===true).sort((a,b) => a.time > b.time ? -1 : 1)

  const deliverOrder = (done) => {
    const endTime = new Date()      
    const readyTime = Math.floor((endTime - done.time.toDate())/60000)
    
    firebase.fire.collection('Pedidos').doc(done.id).update({
      delivered: true,
      readyTime
    })
  }

	return (
		<div className={css(styles.halllayout)}>
    <section className={css(styles.orderMain, styles.vertical)}>
			<h1 className={css(styles.boxTitle)}>Pedidos Prontos</h1>
			{ordersShow.map( (done) => (
        <div key={done.id} className={css(styles.orderCard)}>
          <OrderCard order={done}/>
          <Button className={css(styles.orderBtn)} handleclick={() => deliverOrder(done)}>Entregue</Button>
        </div> 
      ))}
    </section>
    <HistoryCard order={orderHistory} />
    </div>
	)
}

const styles = StyleSheet.create({
  halllayout: {
    display:"flex",
    padding: "5px",
    justifyContent: "space-around",

    '@media (max-width: 850px)': {
      flexDirection: 'column'
    },
  },
  orderMain: {
    borderRight: "1px solid #25B6D2",
    width: "75%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignContent: "flex-start",
    '@media (max-width: 850px)': {
      borderRight: "none"
    },

  },
  histAside:{
    width: "30%",
  },
  boxTitle:{
    width: "90%",
    textAlign: "center",
    margin: "10px 0",
  },
  vertical: {
    '@media (max-width: 850px)': {
      width: "90%",
      margin: "auto"
    },
  },
  orderCard:{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "30%",
    padding: "10px",
    border: "2px solid #25B6D2",
    borderRadius: "15px",
    margin: "10px",
    boxSizing: "border-box",
    '@media (max-width: 850px)': {
      minWidth: "45%",
    },
  },
  tableN: {
    fontSize: "1.6rem",
    color: "#25B6D2",
    fontWeight: "bold"
  },
  itemUl:{
    paddingLeft: "15px",
  },
  itemN: {
    listStyle: "none"
  },
  orderBtn:{
    backgroundColor: "Transparent",
    width: "50%",
    height: "45px",
    marginBottom: "15px",
    whiteSpace: "normal",
    color: "#fff",
    border: "2px solid #25B6D2",
    borderRadius: "15px",
    ':focus': {
      backgroundColor: "#25B6D2",
    },    
  },
  count:{
    marginRight: "7px"
  },
  historyBox:{
    border: "1px solid white",

  }
})

export default DoneOrders