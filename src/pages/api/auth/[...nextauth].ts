

import NextAuth from 'next-auth';
import GithubProvider from "next-auth/providers/github"
import firebase from "../../../services/firebaseConnection"

export default NextAuth({
  
  providers: [
    
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTE_ID,
      clientSecret: process.env.GITHUB_CLIENTE_SECRET,

     
    }),

  ],
  
  callbacks:{
   async session({session, token, user}){
   
      try{
        const lastDonate = await firebase.firestore().collection('users').doc(String(token.sub)).get().then((snapshot)=> {
          
          if(snapshot.exists){
            
            return snapshot.data().lastDonate.toDate()
            
          }else{
            null
          }
        })

        return{
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate,
          
        }
      }catch{
        return{
          ...session,
          id: null,
          vip: false,
          lastDonate: null
        }
      }

    },
    async signIn({user, account, profile}){
      const { email } = user;
      try{
        return true;
      }catch(err){
        console.log('DEU ERRO: ', err);
        return false;
      }

    }
  }
   
  })