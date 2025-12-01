import Auth from "../../../models/Auth";
import dbConnect from  '../../../utils/dbConnect'
dbConnect();
 

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
                const contact = await Auth.create(req.body)
                console.log("g>>>>>>>>",req.body)
                res.status(200).json({success:true,data:contact})
            } catch (error) {
                res.status(400).json({success:false,error:error.message})
            }    
            break
            
            
            default :
            res.status(200).json({status:false})
            
    }
}


    