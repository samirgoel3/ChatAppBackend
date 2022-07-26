const  mongoose =  require('mongoose');
const { Schema } = mongoose;

const algoCategoriesSchema = new Schema({
    name:{type:String, require:true, unique:true},
    color:{type:String, require:true, unique:true},
    icon:{type:String, require:true},
    active:{type:Boolean, default:true},
}, {timestamps: true});

algoCategoriesSchema.methods.toJSON = function() {
    var obj = this.toObject();
    // delete obj.password;
    // delete obj._id;
    // delete obj.__v;
    return obj;
}



module.exports = mongoose.model('algo-category', algoCategoriesSchema)
