function minutesToTimeString(randomMinutes) {
    // Validate input to ensure it's a positive integer
    if (!Number.isInteger(randomMinutes) || randomMinutes < 0) {
      throw new Error("Input must be a positive integer.");
    }
  
    // Calculate hours and remaining minutes
    const hours = Math.floor(randomMinutes / 60);
    const remainingMinutes = randomMinutes % 60;
  
    // Construct the string based on the values
    let timeString;
    if (hours === 0) {
      timeString = `${remainingMinutes} minutes`;
    } else {
      timeString = `${hours} hours and ${remainingMinutes} minutes`;
    }
  
    return timeString;
  }
  
  
  



async function getTaskDuration() {

    var task_name = document.querySelector(".current-task").textContent;
    var new_duration = document.querySelector(".miutes").textContent;


    const response = await fetch("/new-duration/" + task_name + "/" + new_duration)

    if (response.ok) {
        const task = await response.json();
        document.querySelector(".duration").textContent = minutesToTimeString(task.duration);

    } else {
        console.log(response.status);
    }
}





var counter = document.querySelector(".Counter");
var timerControl = document.querySelector(".timercontrol");

var hours = counter.querySelector(".hours");
var minutes = counter.querySelector(".miutes");
var seconds = counter.querySelector(".seconds");

var startButton = timerControl.querySelector(".start");
var pauseButton = timerControl.querySelector("#pause");
var endButton = timerControl.querySelector(".end");
var addTask = document.querySelector(".add-task");

var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
i = 0;
var isWorking = true;
var isGoing = true;





startButton.addEventListener("click", function () {
    var d = document.querySelector(".duration-input")
    
    const duration = d.value;

    // Check if the value is a valid integer.
    const isInteger = /^\d+$/.test(duration);
    
    if (!isInteger) {
      d.value = "enter a valid number"

    } else {
        var secondsInterval = setInterval(function () {


            if (!isWorking) {
                clearInterval(secondsInterval);
            }
    
            if (!isGoing) {
                clearInterval(secondsInterval);
            }
    
    
            seconds.textContent++;
    
            if (seconds.textContent >= 60) {
                minutes.textContent = numbers[i];
                seconds.textContent = 0;
                i++;
            }
    
            if (minutes.textContent == d.value) {
                clearInterval(secondsInterval);
                seconds.textContent = 0;
                
                
                getTaskDuration();
    
            }
    
        }, 1000);
    }

    




})


endButton.addEventListener("click", function () {
    isWorking = false

    if (minutes.textContent == "00" || "1" || "2" || "3" || "4") {
        alert("less than 5 is not valid");
    } else {
        getTaskDuration();
    }






})














pauseButton.addEventListener("click", function () {
    var d = document.querySelector("duration-input")

    if (pauseButton.textContent === "Pause") {
        isGoing = false
        pauseButton.textContent = "Continue";
    } else if (pauseButton.textContent === "Continue") {
        isGoing = true

        pauseButton.textContent = "Pause";
        var secondsInterval = setInterval(function () {

            if (!isWorking) {
                clearInterval(secondsInterval);
            }

            if (!isGoing) {
                clearInterval(secondsInterval);
            }


            seconds.textContent++;


            if (minutes.textContent == d.value) {
                clearInterval(secondsInterval);
                seconds.textContent = 0;
                getTaskDuration();

            }
            if (seconds.textContent >= 59) {
                minutes.textContent = numbers[i];
                seconds.textContent = 0;
                i++;
            }

        }, 999);

    }




})




