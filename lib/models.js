module.exports = function (mongoose) {
	var Schema = mongoose.Schema;
	var userSchema = new Schema({
		username:{ type:String, required:true, unique:true},
		email:{ type:String, required:true, unique:true },
		password:{ 
			username: {type:String, required:true},
			email:{ type:String, required:true}
		},
		language:{ type:String, required:false, unique:false },
		token:{	
			hash:{ type:String, required:false},
			last:{ type:Date, required:false}
		},
		loc: { 
			type: {type:String},
			coordinates: { type: [Number] }
		},
		library:[{
			id:{ type: Schema.Types.ObjectId, ref: 'Books'},
			last_updated:{ type:Date, required:false},
			actions:{
				sell: {type:Boolean},
				donate: {type:Boolean},
				lend: {type:Boolean}
			}
		}]
	});
	var bookSchema = new Schema({
		title: {type:String, required:true},
		author: {type:String, required:true},
		subtitle: {type:String, required:false},
		publisher: {type:String, required:false},
		published: {type:Date, required:false},
		language: {type:String, required:false},
		edition: {type:String, required:false},
		volume: {type:String, required:false},
		isbn: {type:Number, required:false},
		users: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
		loc: [{
			coordinates: { type: [Number], index: '2d' }
		}],
		num_users: {type:Number, required:false}
	});

	var models = {
		Users: mongoose.model('UserModel', userSchema),
		Books: mongoose.model('BookModel', bookSchema)
	};
	return models;
};
