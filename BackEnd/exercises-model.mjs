// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

//mongodb://localhost:3000/exercises
// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if (err) {
        res.status(500).json({ error: '500:Connection to the server failed.' });
    } else {
        console.log('Successfully connected to MongoDB Exercises collection using Mongoose.');
    }
});

/*Define the collection's schema.
Setting "required" to be true, means that if you want to create a new
document into this collection, it must have a name, reps, weight, etc..*/
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true, minLength: 1 },
    reps: { type: Number, required: true, min: 1, max: 100 },
    weight: { type: Number, required: true, min: 1, max: 100 },
    unit: { type: String, required: true, enum: ['kgs', 'lbs'] },
    date: { type: Date, required: true }
});

// Compile the model from the schema.
const Exercise = mongoose.model("Exercise", exerciseSchema);


// CREATE model *****************************************
const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({
        name: name,
        reps: reps,
        weight: weight,
        unit: unit,
        date: date
    });
    return exercise.save();
}


// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const findExercises = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
}

// Retrieve based on the ID and return a promise.
const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}


// DELETE model based on ID  *****************************************
const deleteById = async (_id) => {
    const result = await Exercise.deleteOne({ _id: _id });
    return result.deletedCount;
};


// REPLACE model *****************************************************
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({ _id: _id }, {
        name: name,
        reps: reps,
        weight: weight,
        unit: unit,
        date: date
    });
    return result.modifiedCount;
}



// Export our variables for use in the controller file.
export { createExercise, findExercises, findExerciseById, replaceExercise, deleteById }