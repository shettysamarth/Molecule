module.exports = function(mongoose){
    var userSchema = new mongoose.Schema({
        "firstName": String,
        "lastName": String,
        "password": String,
        "role": String,
        "email": String
    }, {collection:"user"});
    return userSchema;
};