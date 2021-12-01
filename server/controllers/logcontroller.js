let Express = require('express');
let router = Express.Router();
const validateSession = require("../middleware/validate-session");
const { LogModel } = require('../models');

/*
    ===============
    Log Create
    ===============
*/

router.post("/create", validateSession, async (req, res) => {
    let { description, definition, result } = req.body.log;
    let { id } = req.user;
    let logEntry = {
        description,
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


/*
    ================
    Get all Log
    ================
*/
router.get('/', async (req, res) => {
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error:err });
    }
});
/*
    =====================
    Get Log By Title
    =====================
*/

router.get("/:description", async (req, res) => {
    const { description } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { description: description }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});
/*
    ================
    Update a Log
    ================
*/

router.put("/update/:id", validateSession, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;

    const query = {
        where: {
            id: logId,
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
    ================
    Delete a Log
    ================
*/

router.delete("/delete/:id", validateSession, async (req, res) => {
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message:"Log Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})


module.exports = router;
