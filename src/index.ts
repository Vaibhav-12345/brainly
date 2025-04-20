import express from "express";
import mongoose from "mongoose";
import { Contenmodel, Linksmodel, Usermodel } from "./db";
// import z from "zod";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { userMiddelware } from "./middelware";
import { random } from "./utils";

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{

    res.send('hello');
})

app.post("/api/v1/signup", async (req, res) => {
  // const requestBody = z.object({
  //   username: z
  //     .string()
  //     .min(4, { message: "username have alteast 4 character" }),
  //   password: z.number().min(3),
  // });

  const username = req.body.username;
  const password = req.body.password;
  // console.log(username,password)
  
  // ye mere ek try catch ke tarah kam karega (zod)
//   const parseDatawithSuccess = requestBody.safeParse(req.body);

//   console.log(parseDatawithSuccess)
//   if (!parseDatawithSuccess.success) {
//     res.status(403).json({
//       message: "Invalid Credentaial",
//       error: parseDatawithSuccess.error.issues[0].message,
//     });
//     return;
//   }


  //   bcrypt hashing password
  // const hashPassword = await bcrypt.hash(password, 5);

  //   check if user already signup or not
  // const finduseralreadyExist = await Usermodel.findOne({
  //   username,
  // });

  // if (finduseralreadyExist) {
  //   res.status(200).json({
  //     message: "user already exist in the db",
  //   });
  //   return;
  // }


  try {
    await Usermodel.create({
      username: username,
      password: password,
    });
  
    res.status(200).json({
      message: "user sign up successful",
    });
   } catch (e) {
    res.json({
      message:'User already exist'
    })
   }
});

app.post("/api/v1/signin", async(req, res) => {

  const username=req.body.username;
  const password=req.body.password;


  const User =await Usermodel.findOne({
    username,
    password
  })

  // console.log(typeof User?.password)

  if(!User){
    res.status(403).json({
      message: "Invalid credential",
    });
    return;
  }

  console.log(User)
  
// const passwordVerify=await bcrypt.compare( password,
//   User?.password)

if(User){

  const token =jwt.sign({
    id: User._id,
  },JWT_SECRET)

  res.header('token',token)

  res.json({
    token:token
  })
}
else{
  res.json({
    message:'Incorrect credential'
  })
}

  
});


app.post("/api/v1/content", userMiddelware, async (req, res) => {
  // auth se jo user aaaya hai 
  // const currentUser=req.body.userId;

  const title=req.body.title;
  const link=req.body.link;
  

  await Contenmodel.create({
    title:title,
    link:link,
    tags:[],
    // userId:currentUser
    // @ts-ignore 
     userId:req.userId
  })

  res.json({
    message:'content added'
  })

  
});

app.get("/api/v1/content", userMiddelware, async(req, res) => {
  // @ts-ignore 
  const userId=req.userId
  const content=await Contenmodel.find({
    userId:userId
  }).populate('userId','username')
 
  res.json({
    content
  })


});

app.delete('/api/v1/content',userMiddelware,async(req,res)=>{
  

  const contentId=req.body.contentId

  await Contenmodel.deleteMany({
    contentId,
    // @ts-ignore 
    userId:req.userId
  })

  res.json({
    message:'delete the content'
  })
  
})

app.post("/api/v1/brain/share",userMiddelware, async(req, res) => {
  const share=req.body.share;
  // share ki value true hogi then generate the shareble link 
  if(share){
   
    const existingLink=await Linksmodel.findOne({
      // @ts-ignore 
      userId:req.userId
    })

    if(existingLink){
      res.json({
        hash:existingLink.hash
      })
      return 
    }


    const hash=random(10);
   await Linksmodel.create({
      hash:hash,
      // @ts-ignore 
      userId:req.userId
    })

    res.json({
      hash
    })
  }
  else{
     await Linksmodel.deleteOne({
       // @ts-ignore 
      userId:req.userId 
     })

     res.json({
      message:'Remove sharable link'
    })
  } 

  

});

app.get("/api/v1/brain/:shareLink", async(req, res) => {
  const hash=req.params.shareLink;
  
  const link=await Linksmodel.findOne({
    hash:hash
  })
  
  if(!link){
    res.status(403).json({
      message:'sorry incorrect input means hash random string are generated '
    })
    return;
  }
  //userId
  const content = await Contenmodel.find({
    userId:link.userId
  })
  
  const users=await Usermodel.findOne({
    _id:link.userId
  })


  if(!users){
    res.status(403).json({
      message:'user not found ,error should ideall not happen '
    })
    return;
  }


  res.json({
    username:users.username ,
    content:content
  })

});

async function main() {
  await mongoose.connect(
    "mongodb+srv://vaibhavmgs99:vaibhav12345@cluster0.gsenu21.mongodb.net/brainly"
  );
  app.listen(3000);
}

main();
