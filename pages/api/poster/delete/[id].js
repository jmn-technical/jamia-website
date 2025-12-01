import Poster from '../../../../models/Poster'
import dbConnect from  '../../../../utils/dbConnect'
dbConnect();
 

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
 
    
    case "DELETE":
      try {
        const delPoster = await Poster.deleteOne({ _id: id });

        if (!delPoster) {
          res.status(400).json({ staus: false });
        }
        res.status(200).json({ status: true, data: {} });
      } catch (error) {
        res.status(400).json({ status: false });
      }
  }
};