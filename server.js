import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

async function setupServer(){
  const app = express();
  const defaultData = { resources: [] }
  const db = await JSONFilePreset('data.json', defaultData)
  const { resources } = db.data

  console.log("Data from db.data: ",{resources})
  console.log("Data from json file db.json: ")
  console.log(await db.read())

  app.get('/api/resources',(req,res)=>{
    res.send({resources})
  })

  app.get('/api/resources/:id',(req,res)=>{
    const resourceId = parseInt(req.params.id);
    const resource = resources.find(resource => resource.id === resourceId);
    if (!resource) {
      return res.status(404).send("Post not found");
    }
    res.send(resource);
  })

  app.use((err,req,res,next)=>{
    res.status(500).send({ error: err.message });
  })

  app.listen(3000, () => {
    console.log("Server listening on 3000");
  });
}

setupServer().catch(err => {
  console.error("Error starting server:", err);
});