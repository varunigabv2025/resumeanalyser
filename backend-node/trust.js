const express = require("express");
const fs = require("fs");
const router = express.Router();

const { generateReport } = require("../services/trustScore");

const users = JSON.parse(
    fs.readFileSync("./data/fake_users.json", "utf8")
);

router.get("/:name", (req, res) => {

    const user = users.find(
        u => u.name.toLowerCase() === req.params.name.toLowerCase()
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(generateReport(user));
});

module.exports = router;
