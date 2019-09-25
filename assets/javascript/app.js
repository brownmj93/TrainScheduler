
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBReCrpoDW69a4LeoIzA20PCEEK6H9QpqM",
    authDomain: "train-ffe64.firebaseapp.com",
    databaseURL: "https://train-ffe64.firebaseio.com",
    projectId: "train-ffe64",
    storageBucket: "train-ffe64.appspot.com",
    messagingSenderId: "1023504599787",
    appId: "1:1023504599787:web:8b742c63e6b70cd2ec0cae"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var currentTime = moment().format("HH:mm");
var secondTrain;
var diff;
var totalMinutes;
var nextTrain;
var nextTrainFormatted;
var minutesAway;

$("#submitBtn").on("click", function (event) {
    event.preventDefault();

    var train = $("#train_input").val().trim();
    var destination = $("#destination_input").val().trim();
    var first_train = moment($("#train_time_input").val().trim(), "HH:mm");
    var frequency = parseInt($("#frequency_input").val().trim());


    secondTrain = moment(first_train).add(frequency, 'm');
    //console.log(secondTrain);

    if (moment(secondTrain).isSameOrBefore(moment())) {
        diff = moment.duration(moment().diff(first_train)).as('minutes');
        //console.log(diff);
        totalMinutes = ((Math.floor(diff / frequency)) + 1) * frequency;
        //console.log(totalMinutes);

        nextTrain = moment(first_train).add(totalMinutes, 'm');
        nextTrainFormatted = moment(nextTrain._d).format('LT');
        //console.log(nextTrainFormatted);

        minAway();
    }
    else {
        console.log("second train didn't happen");
        nextTrain = moment(first_train).add(frequency, 'm');
        nextTrainFormatted = moment(nextTrain._d).format('LT');
        minAway();
    }

    function minAway() {
        minutesAway = moment.duration(nextTrain.diff(moment())).as('minutes');
        roundedMinutes = Math.ceil(minutesAway);

        console.log(minutesAway);
        console.log(roundedMinutes);
    }

    //Push data to the database
    database.ref().push({
        train: train,
        destination: destination,
        trainTime: nextTrainFormatted,
        frequency: frequency,
        minutesAway: roundedMinutes
    })

    $("#train_input").val("");
    $("#destination_input").val("");
    $("#train_time_input").val("");
    $("#frequency_input").val("")

});

database.ref().on("child_added", function (childSnapshot) {
    //console.log(childSnapshot.val());

    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().trainTime;
    var trainFrequency = childSnapshot.val().frequency;
    var trainAway = childSnapshot.val().minutesAway;

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(trainTime),
        $("<td>").text(trainAway)
    );

    // Append the new row to the table
    $("#schedule-table > tbody").append(newRow);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});