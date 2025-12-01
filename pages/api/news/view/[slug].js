import News from '../../../../models/News'
import dbConnect from  '../../../../utils/dbConnect'
dbConnect();
 

dbConnect();

export default async (req, res) => {
  const {
    query: { slug },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const news = await News.find({slug:slug});
        if (!news) {
          return res.status(400).json({ success: false });
          // console.log("no memebr  >>>>>>>>>>>")
        }

        res.status(200).json({ success: true, data: news });
      } catch (error) {
        res.status(400).json({ status: false, error: error.message });
        console.log("erroo>>>>>>>>>>>",error.message)
      }
      break;

   
    
  }
};