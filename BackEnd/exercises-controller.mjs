import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());


const validator = (name, reps, weight, unit, date) => {
    if (name === undefined || name === null || name.length <= 0)
        return false;

    if (reps === undefined || reps <= 0 || typeof reps !== Number)
        return false;

    if (weight === undefined || weight <= 0)
        return false;

    if ((unit === undefined) || (unit !== "kgs" && unit !== "lbs" && unit !== "miles"))
        return false;

    if (date === undefined)
        return false;

    else
        return true;
}



// CREATE controller ******************************************
app.post('/exercises', (req, res) => {
    if (req.body.weight <= 0 || req.body.reps <= 0 || req.body.name.length <= 0)
        res.status(400).json({ Error: "Invalid Request" });


    else if (req.body.unit !== "kgs" && req.body.unit !== "lbs" && req.body.unit !== "miles")
        res.status(400).json({ Error: "Invalid Request" });

    else {
        exercises.createExercise(
            req.body.name,
            req.body.reps,
            req.body.weight,
            req.body.unit,
            req.body.date
        )
            .then(exercise => {
                if (req.body.weight > 0 || req.body.reps > 0
                    || req.body.name.length > 0) {
                    res.status(201).json(exercise);
                } else {
                    res.status(400).json({ Error: "Invalid Request" });
                }
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({ error: 'Creation of a document failed due to invalid syntax.' });
            });
    }
});


// RETRIEVE controller ****************************************************
// GET exercises by ID
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        //If promise is resolved, it is set to the value of exercise
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request to retrieve document failed' });
        });

});


// GET exercises filtered by name, reps, weight, unit, and/or date
app.get('/exercises', (req, res) => {
    let filter = {};
    // filter by name
    if (req.query.name !== undefined) {
        filter = { name: req.query.name };
    }
    // filter by reps
    if (req.query.reps !== undefined) {
        filter = { reps: req.query.reps };
    }
    // filter by weight
    if (req.query.weight !== undefined) {
        filter = { weight: req.query.weight };
    }
    // filter by unit
    if (req.query.unit !== undefined) {
        filter = { unit: req.query.unit };
    }
    // filter by date
    if (req.query.date !== undefined) {
        filter = { date: req.query.date };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request to retrieve documents failed' });
        });
});

// DELETE Controller ******************************
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request to delete a document failed' });
        });
});

// UPDATE controller ************************************
app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(
        req.params._id,
        req.body.name,
        req.body.reps,
        req.body.weight,
        req.body.unit,
        req.body.date
    )
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.status(200).json({
                    _id: req.params._id,
                    name: req.body.name,
                    reps: req.body.reps,
                    weight: req.body.weight,
                    unit: req.body.unit,
                    date: req.body.date
                })
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request to update a document failed' });
        });
}
);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});