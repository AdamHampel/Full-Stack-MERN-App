import React from 'react';
import Row from './Row';

function Table({ exercises, onDelete, onEdit }) {
    return (
        <table id="exercises">
            <caption>Add and Edit Exercises</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Reps</th>
                    <th>Weight</th>
                    <th>Unit</th>
                    <th>Date</th>
                    <th>Delete</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise, i) =>
                    <Row
                        exercise={exercise}
                        key={i}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />)}
            </tbody>
        </table>
    );
}

export default Table;