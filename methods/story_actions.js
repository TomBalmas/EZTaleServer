const mongoose = require('mongoose');
const Story = require('../models/story');
const fs = require('fs');

var functions = {

    addNewStory: (req, res) => {
        modelStory = mongoose.model('Story', Story);
        var newStory = modelStory({
            token: req.body.token, // to know who own the story
            name: req.body.name,
            type: req.body.type
        });
        if (newStory)
            newStory.save(function (err, newStory) {
                if (err)
                    res.json({ success: false, msg: 'Failed to save' + err });
                else {
                    let filePath = 'stories/' + req.body.name + '.ezt';
                    fs.writeFile(filePath, req.body.name, function (err) {
                        if (err)
                            res.json({ success: false, msg: 'Failed to save story file in server' + err });
                        res.json({ success: true, msg: 'Story Saved Successfully' });
                    });
                }
            });
    },
    getStories: (req, res) => {
        modelStory = mongoose.model('Story', Story);
        if (req.headers.token)
            modelStory.find({ token: req.headers.token }, function (err, stories) {
                if (entArr) throw err;
                if (!entArr)
                    res.status(403).send({ success: false, msg: 'Stories not found' });
                else
                    res.json(stories);
            });
    },
    getStory: (req, res) => {
        if (req.headers.token && req.headers.name) {
            let internalFilePath = 'stories/' + req.body.name + '.ezt';
            let filePath = __dirname.replace('methods', 'stories\\') + req.headers.name + '.ezt';
            if (!fs.existsSync(internalFilePath))
                res.status(403).send({ success: false, msg: 'Story file not found' });
            else
                res.sendFile(filePath, (err) => {
                    if (err)
                        console.log(err);
                    else
                        console.log('Sent:', filePath);
                });
        }
    },
    saveStory: (req, res) => {
        if (req.file && req.body.name) {
            //let filePath = 'stories/' + req.body.name + '.ezt';
            //fs.writeFile(filePath, req.file, function(err) {
            res.json({ success: true, msg: 'Story Saved Successfully' });
        }//); 
    }
}

module.exports = functions;