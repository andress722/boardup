import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from "querystring";
import Head from 'next/head';
import { getSession } from "next-auth/react"
import firebase from "../../services/firebaseConnection"
import {format} from "date-fns"
import styles from './task.module.scss'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'

type Task = {
  id: string,
  created: string | Date,
  createFormat?: string,
  tarefa: string,
  userId: string,
  nome: string 
}


interface TaskProps{
  data: string
}



export default function Task( {data }:TaskProps ){

    const task = JSON.parse(data) as Task


    return(
        <>
        <Head>
      <title>Detalhes da sua tarefa</title>
    </Head>
    <article className={styles.container}>
      <div className={styles.actions}>
        <div>
          <FiCalendar size={30} color="#FFF"/>
          <span>Tarefa criada:</span>
          <time>{task.createFormat}</time>
        </div>
      </div>    
      <p>{task.tarefa}</p>  
    </article>
    </>
    
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params}) => {
  const { id } = params;
  const session = await getSession({ req });

  console.log

    if(!session?.vip){
        return {
            redirect: {
                destination: '/',
                permanent: false

            }
        }
    }

    const data = await firebase.firestore().collection('tarefa').doc(String(id)).get()
    .then((snapshot)=> {
        const data = {
        id: snapshot.id,
        created: snapshot.data().created,
        createFormat: format(snapshot.data().created.toDate(), 'dd mmmm yyyy'),
         tarefa: snapshot.data().tarefa,
         userId: snapshot.data().userId,
        nome: snapshot.data().nome
        }
        return JSON.stringify(data)
    })
      .catch(()=>{
        return {}
      })

      if(Object.keys(data).length === 0){
        return{
      redirect:{
        destination: '/board',
        permanent: false,
      }
    }  
      }

    return {    
        props:{
            data
        }
    }

}       