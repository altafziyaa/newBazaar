import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
     
name:{
        type: String,
},
locality: {
        type: String,
},
pindcode: {
        type: Number,
},
state:{
        type: String,
},
address:{
        type: String,
},
mobile:{
        type: Number,
}
},{timestamps:true});

const Address = mongoose.model('Address', addressSchema);
export default Address;
