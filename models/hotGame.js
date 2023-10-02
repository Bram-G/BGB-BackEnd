const { Schema, model } = require('mongoose');

const hotGameSchema = new Schema(
    {
        hotGame: {
            type: [String],
            default: [],
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: true,
    }
)