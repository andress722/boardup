import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import styles from './styles.module.scss'
import Link from 'next/link';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton';
import { getToken } from 'next-auth/jwt';
import { useState, FormEvent} from 'react';
import firebase from "../../services/firebaseConnection"
import {format} from "date-fns"
import { type } from 'os';

type TaskList = {
  id: string,
  created: string | Date,
  createFormat?: string,
  tarefa: string,
  userId: string,
  nome: string 
}


interface BoardProps{
  user:{
    nome: string
    id: string,
  },
  data: string
}


export default function Board({ user, data }: BoardProps){
  console.log(user.nome)
  const [input, setInput] = useState('')
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)
   
  async function handleAddTask(e:FormEvent){
    e.preventDefault()
    if(input === ''){
      alert('Preencha uma tarefa')
      return
    }

    if(taskEdit){
      await firebase.firestore().collection('tarefa').doc(taskEdit.id).update({
        tarefa:input
      })
      .then(()=> {
       let data = taskList;
        let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
        data[taskIndex].tarefa = input

        setTaskList(data);
        setTaskEdit(null);
        setInput('');

      })
      return
    }

    await firebase.firestore().collection('tarefa')
    .add({
      created: new Date,
      createFormat:  format(new Date(), 'dd mmmm yyyy'),
      tarefa: input,
      userId: user.id,
      nome: user.nome
 })
    
    .then((doc)=> {

      console.log('Cadastrado com sucesso')

      let data = {
        id: doc.id,
        created: new Date,
        createFormat:  format(new Date(), 'dd mmmm yyyy'),
         tarefa: input,
         userId: user.id,
       nome: user.nome
      }

       setTaskList([...taskList, data])
       setInput('')
    })
    .catch((err)=> {
      console.log('erro ao cadastrar')
    })
  }

async function handleEdit(task:TaskList) {
    setTaskEdit(task)
    setInput(task.tarefa)
}
  function handleCancelEdit(){
    setInput('')
    setTaskEdit(null)
  }
  async function handleDelete(id:string){
    await firebase.firestore().collection('tarefa').doc(id).delete()
    .then(()=> {
      console.log('deletado com sucesso')
      let taskFilter = taskList.filter(item=> {
        return (item.id !== id) 
      })

      setTaskList(taskFilter)
    })
    .catch((err)=> console.log(err))
  }

  return(
    <>
    <Head>
    	<title>Minhas tarefas - Board</title>
    </Head>
    <main className={styles.container}>

      {taskEdit && (
        <span className={styles.wormText}>
          <button onClick={()=> handleCancelEdit()}>
            <FiX size={30} color="#ff3636"/>
          </button>
          Você está editando uma tarefa
        </span>
      )}
      <form onSubmit={handleAddTask} >
        <input 
          type="text" 
          placeholder="Digite sua tarefa..."
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />
        <button type="submit">
          <FiPlus size={25} color="#17181f" />
        </button>
      </form>

    <h1>Você tem 2 tarefas!</h1>

    <section>
      {taskList.map( task => (
      <article key={task.id} className={styles.taskList}>
        <Link href={`/board/${task.id}`}>
         <p>{task.tarefa}</p>
        </Link>
        <div className={styles.actions}>
          <div>
            <div>
              <FiCalendar size={20} color="#FFB800"/>
              <time>{task.createFormat}</time>
            </div>
            <button onClick={()=> handleEdit(task)}>
              <FiEdit2 size={20} color="#FFF" />
              <span>Editar</span>
            </button>
          </div>

          <button onClick={ () => handleDelete(task.id)}>
            <FiTrash size={20} color="#FF3636" />
            <span>Excluir</span>
          </button>
        </div>
      </article>
      ))}
    </section>

    </main>

    <div className={styles.vipContainer}>
      <h3>Obrigado por apoiar esse projeto.</h3>
      <div>
        <FiClock size={28} color="#FFF" />
        <time>
          Última doação foi a 3 dias.
        </time>
      </div>
    </div>

    <SupportButton/>

    </>
  )
}




export const getServerSideProps: GetServerSideProps = async ({ req }) => {
   const session = await getSession({ req });
    const token = await getToken({req})
  if(!session?.id){
    
    return{
      redirect:{
        destination: '/',
        permanent: false
      }
    }
  }

  const tasks = await firebase.firestore().collection('tarefa').orderBy('created', 'asc').get() 

  const data = JSON.stringify(tasks.docs.map(e=> {
    return{
      id: e.id,
      createFormat: format(e.data().created.toDate(), 'dd MMMM yyyy'),
      ...e.data()
    }
  }))

  console.log(data)

  const user = {
    nome: session?.user.name,
    id: session?.id
  }

 

  return{
    props:{
      user,
      data
    }
  }
}