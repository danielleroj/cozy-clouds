const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Location = require("./location");

const weatherSchema = new Schema(
    {
        location: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        temperature: { type: Number, required: true },
        description: { type: String, required: true },
        fetchedAt: { type: Date, default: Date.now, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Weather", weatherSchema);
