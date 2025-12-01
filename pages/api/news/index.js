import News from '../../../models/News'
import dbConnect from  '../../../utils/dbConnect'
dbConnect();
 

 export default async (req,res)=>{
    const {method} = req;
    switch (method) {
        case 'GET':
            try {
                const news = await News.find().sort({'publishedAt': -1})
                
                res.status(200).json({success:true,data:news})
            } catch (error) {
                res.status(400).json({success:false, error:error.message})
               
            }
            break

        case 'POST':
            try {
                const news = await News.create(req.body)
               
                res.status(200).json({success:true,data:news})
            } catch (error) {
                res.status(400).json({success:false,error:error.message})
            }    
            break
            
            
            default :
            res.status(200).json({status:false})
            
    }
}


    