import { MongoClient } from "mongodb";

const uri=process.env.MONGODB_URL
console.log(uri);

const client = new MongoClient(uri!, {
    connectTimeoutMS: 30000, 
  });
 
 const db = client.db("db1");
  const Users = db.collection("User");
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SignUp {
  name: string;
  password: number;
  userType: string;
  namespaces?:{
    docName:string
  }[]
}

 export default Users     