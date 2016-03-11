module.exports = function(mongoose){
    var userSchema = mongoose.Schema({
        "firstName": String,
        "lastName": String,
        "password": String,
        "role": String,
        "email": String
    }, {collection:"user"});
    return userSchema;
};