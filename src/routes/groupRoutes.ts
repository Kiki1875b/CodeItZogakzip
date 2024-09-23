import express from 'express';
import {createGroup} from '../controllers/groupController';
import {getGroups} from '../controllers/getGroups';

const router = express.Router();

router.post('/groups', async(req,res) =>{
  try{
    const newGroup = await createGroup(req.body);
    res.status(201).json(newGroup);
  }catch(error){
    res.status(400).json({message : 'Error Creating Group'});
  }
});


router.get('/groups', async(req, res) => {
  try{
    
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const sortBy = req.query.sortBy as string || 'latest';
    const keyword = req.query.keyword as string || '';
    const isPublic = true;

    const groups = await getGroups({page,pageSize,sortBy, keyword, isPublic});

    res.status(200).json(groups);
  }catch(error){
    res.status(400).json({message : 'Error Fetching Groups', error});
  }
});

export default router;