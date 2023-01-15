import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration =new Configuration({
    apiKey:process.env.OPENAI_API_KEY
})
 
const openai= new OpenAIApi(configuration)
const app=express()
app.use(cors()) 
app.use(express.json()) //for sending json data from frontend to backend


app.get("/",async(req,res)=>{
    res.status(200).send({
        message:"Hello World from Messi_X"
    })
})
app.post('/',async(req,res)=>{
    try{
        const prompt=req.body.prompt
        const response=await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.5,
            max_tokens: 3200,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })
        res.status(200).send({
            bot:response.data.choices[0].text
        })
    }catch(error)
    {
        console.log(error)
        res.status(500).send(error || "Something went Wrong")
    }
})
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
