// CareerAI Frontend JavaScript

console.log("CareerAI frontend loaded successfully.");


// Resume file selection

const resumeFile = document.getElementById("resume-file");

if (resumeFile) {

    resumeFile.addEventListener("change", function () {

        if (resumeFile.files.length > 0) {

            const fileName = resumeFile.files[0].name;

            console.log("Selected resume:", fileName);

        }

    });

}