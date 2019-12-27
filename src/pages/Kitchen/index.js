import React, {useState, useEffect} from 'react'
import fire from '../../utils/firebaseUtils'
import Button from '../../components/Button'
import { StyleSheet, css } from 'aphrodite'

function Kitchen(){
  const [orders,setOrders] = useState([])
  const [orderDone, setOrderDone] = useState([])

  useEffect(() => {
    fire.collection('Pedidos')
    .orderBy('time', 'asc')
    .onSnapshot((snap) => {
      const newOrder = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrders(newOrder)
    })
  },[])

  useEffect(() => {
    fire.collection('Historico')
    .orderBy('time', 'asc')
    .onSnapshot((snap) => {
      const done = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrderDone(done)
    })
  },[])


  
  const orderReady = (order) => {    
    if (order.status==="Confirmar"){
      order.ready = true;

      fire.collection('Historico').add(order)
      fire.collection('Pedidos').doc(order.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });

    } else {
      order.status = "Confirmar"
    }
    setOrders([...orders]) //usar o spread para criar um outro array, assim forçando a renderização da pag
  }
  console.log(orders);


  return (
    <div>
      <h1>Cozinha</h1>
      <h2>Pedidos na Fila</h2>
      {orders.map((order)=> (
        <>
          {order.ready===false &&
          <div key={order.id}>
          <p>Mesa: {order.table}. {order.name}          <Button title={order.status} handleclick={() => orderReady(order)} /></p>
            {/* {console.log(order.time.toDate().toTimeString)} */}
          {order.product.map((item) => (
            <ul>
              <li>{item}</li>
            </ul>
            ))}
            </div>
          }
        </>
      ))}

      <h3>Histórico</h3>
      {orderDone.map((done) => (
        <div className={css(styles.doneList)}>
          <p>Mesa: {done.table}. {done.name}</p>{done.product.map((item) => (
            <ul>
              <li>{item}</li>
            </ul>
          ))}
          </div>
      ))}
    </div>
  )
}

const styles = StyleSheet.create({
  doneList: {
    fontSize: "0.8em"
  }
})

export default Kitchen