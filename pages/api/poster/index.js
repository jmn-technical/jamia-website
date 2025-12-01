import Poster from '../../../models/Poster'
import dbConnect from  '../../../utils/dbConnect'
dbConnect();
 

 export default async (req,res)=>{
    const {method} = req;
    switch (method) {
        case 'GET':
            try {
                const poster = await Poster.find().sort({'timeStamp': -1})
                res.status(200).json({success:true,data:poster})
            } catch (error) {
                res.status(400).json({success:false, error:error.message})
               
            }
            break

        case 'POST':
            try {
                const poster = await Poster.create(req.body)
               
                res.status(200).json({success:true,data:poster})
            } catch (error) {
                res.status(400).json({success:false,error:error.message})
            }    
            break
            
            
            default :
            res.status(200).json({status:false})
            
    }
}


    