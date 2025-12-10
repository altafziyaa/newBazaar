import mongoose, { Schema } from "mongoose";
import HomeCategorySection from "../domain/HomeCategorySection.js";


const homecategorySchema= new Schema({
    name:{
        type:String,
        required:true,

    },
    image:{
        type:String,
        required:true,
    },
    categoryId:{
        type:String,
        required:true
    },
    section:{
        type:String,
        enum:Object.values(HomeCategorySection),
        required:true
    }
},
{
    timestamps:true,
})

const HomeCategory=mongoose.model('homeCategory',homecategorySchema)

export default HomeCategory