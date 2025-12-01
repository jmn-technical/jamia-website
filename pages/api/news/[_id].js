import News from '../../../models/News'
import dbConnect from  '../../../utils/dbConnect'
dbConnect();
 

dbConnect();

export default async (req, res) => {
  const {
    query: { _id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const news = await News.findById(_id);
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

    case "PUT":
      try {
         
        const news = await News.findByIdAndUpdate(
            _id,
          { $set: req.body },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!news) {
          res.status(400).json({ success: false });
          console.log('at one  >>>>>>>>>>>' )
        }
        res.status(200).json({ success: true, data: news });
      } catch (error) {
        res.status(400).json({ success: false, error });
      console.log('error message >>>>',error.message)
      }
      break;

    case "DELETE":
      try {
        const delNews = await News.deleteOne({ _id: _id });

        if (!delNews) {
          res.status(400).json({ staus: false });
        }
        res.status(200).json({ status: true, data: {} });
      } catch (error) {
        res.status(400).json({ status: false });
      }
  }
};