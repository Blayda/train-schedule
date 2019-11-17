$(document).ready(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyA0jB1ABHbsgilgHoz_8dkavKa3bpXk8DI",
    authDomain: "zacsfb1.firebaseapp.com",
    databaseURL: "https://zacsfb1.firebaseio.com",
    projectId: "zacsfb1",
    storageBucket: "zacsfb1.appspot.com",
    messagingSenderId: "410713039575",
    appId: "1:410713039575:web:5871d0cc467045440fc692",
    measurementId: "G-BLSTD8BZ40"
  };

  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  $("#addTrain").on("click", function() {
    event.preventDefault();

    name = $("#trainName")
      .val()
      .trim();
    destination = $("#destinationName")
      .val()
      .trim();
    firstTrainTime = $("#firstTrainTime")
      .val()
      .trim();
    frequencyRate = $("#frequencyRate")
      .val()
      .trim();

    database.ref().push({
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequencyRate: frequencyRate
    });

    $("#trainName").val("");
    $("#destinationName").val("");
    $("#firstTrainTime").val("");
    $("#frequencyRate").val("");
  });

  database.ref().on("child_added", function(snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var firstTrainTime = snapshot.val().firstTrainTime;
    var frequencyRate = snapshot.val().frequencyRate;

    var timeFormat = firstTrainTime.split(":");
    // console.log(timeFormat)

    var submittedTime = moment()
      .hours(timeFormat[0])
      .minutes(timeFormat[1]);

    console.log(submittedTime);
    var maxMoment = moment().max(moment(), submittedTime);
    console.log(moment());
    var minutes;
    var arrival;
    if (maxMoment === submittedTime) {
      arrival = submittedTime.format("hh:mm A");
      minutes = submittedTime.diff(moment(), "minutes");
    } else {
      var frequencyMinutes = moment().diff(submittedTime, "minutes");
      var minLeft = frequencyMinutes % frequencyRate;
      minutes = frequencyRate - minLeft;
      arrival = moment()
        .add(minutes, "m")
        .format("hh:mm A");
    }
    console.log(snapshot.val());
    console.log(snapshot.val().name);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrainTime);
    console.log(snapshot.val().frequencyRate);

    var row = $("<tr>").append(
      $("<td>").text(name),
      $("<td>").text(destination),
      $("<td>").text(frequencyRate),
      $("<td>").text(arrival),
      $("<td>").text(minutes)
    );

    $("#trainRow").append(row);
  });
});
