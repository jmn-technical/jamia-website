// import {NextRequest, NextResponse} from "next/server";
 
import cookies from "js-cookie";


export default async (req,res)=>{
    const {method} = req;
    switch (method) {
        case 'GET':
            try {
                const contact = await Auth.find()
                res.status(200).json({success:true,data:contact})
            } catch (error) {
                res.status(400).json({success:false, error:error.message})
               
            }
            break

        case 'POST':
            try {
                const body= await req.body   ;
        
                const { username, password,serverUsername,serverPassword } = body;
               
                const isAuthenticated = await authenticateAdmin(username, password,serverUsername,serverPassword);
                
                if(isAuthenticated){
                    cookies.set("admin",true)
                    console.log(cookies.get('admin'),'dfdfdfdf')  
                    const response = res.json({message: "Welcome!"})
             
                  console.log("itsss>>>> okk")
                  return response
                }
              } catch (error) {
                console.log(error)
            }  
            break
            
            
            default :
            res.status(200).json({status:false})
            
    }
}
 

 


async function authenticateAdmin(username, password,serverUsername,serverPassword) {
 
  if (
    username === serverUsername &&
    password === serverPassword
  ) {
    return true;
  }
}
