module.exports = function(app, courseModel){

    app.get("/api/project/courseExtendedInfo/:courseId", getCompleteCourseInfo);


    function getCompleteCourseInfo(req, res)
    {
        console.log("In :getCompleteCourseInfo");
        var courseId = req.params.courseId;
        courseModel.getCompleteCourseInfo(courseId)
            .then(function (courseExtendedInfo) {
               res.json(courseExtendedInfo);
            });

    }

};

