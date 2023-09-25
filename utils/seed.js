const connection = require("../config/connection");
const { user } = require("../models");
const {demoU1, demoU2, demoU3} = require("./seedData")

connection.once("open", async () => {
        console.log("connected...");

        // reset database
        await user.deleteMany({});
        console.log("database reset...")

        // Create demo seed collections
        const users = [demoU1, demoU2, demoU3]

        // Add the users to the db
        for (i=0; i < users.length; i++){
                await user.create(users[i])
        }


        console.log("database seeded!")
})