const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://*****************@cluster0.o2ltu.mongodb.net/********?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("mongoose is connected....!");
}).catch((e)=>{
    console.log(e);
})
