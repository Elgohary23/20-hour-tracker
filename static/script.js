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






// Data organization function




function organizeTasks(tasks) {
  const taskList = document.querySelector(".tasks");
  taskList.innerHTML="";
  tasks.forEach(task => {
    const taskElement = document.createElement("article");
    taskElement.classList.add("task");


    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.task_name;
    taskElement.appendChild(taskTitle);

    const taskControl = document.createElement("div");
    taskControl.classList.add("task-control");

    const taskTag = document.createElement("span");
    taskTag.textContent = task.tag;
    taskTag.classList.add("task-tag");

    // Set background color based on task priority
    if (task.priority === "low") {
      taskTag.style.backgroundColor = "#FBF36C";
    } else if (task.priority === "medium") {
      taskTag.style.backgroundColor = "#ff8b3d";
    } else {
      taskTag.style.backgroundColor = "#FF523D";
    }

    taskControl.appendChild(taskTag);

    // Create delete button
    var deleteTask = document.createElement("div");
    deleteTask.classList.add("delete");
    deleteTask.textContent = "X";

    // Add event listener for task deletion
    deleteTask.addEventListener("click", function () {
      fetch("/delete-task/" + taskTitle.textContent, {
        method: 'DELETE'
      })
      .then(response => {
        // Check for successful response
        if (!response.ok) {
          console.error("Error deleting task:", response.statusText);
          return; // Exit if something went wrong
        }
        return response.json(); // Parse JSON response
      })
      .then(data => {
        console.log("Tasks after deletion:", data.tasks);
        organizeTasks(data.tasks);

      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
    });
    

    taskControl.appendChild(deleteTask);
    taskElement.appendChild(taskControl);
    taskList.appendChild(taskElement);

    // Add event listener for task details
    taskElement.addEventListener("click", function () {
      var currentTask = document.querySelector(".current-task");
      var duration = document.querySelector(".duration");
      currentTask.textContent = task.task_name;
      duration.textContent = minutesToTimeString(task.duration);
    });
  });
}

// Fetch tasks from the server
function fetchTasks() {
  const getTasks = async () => {
    const response = await fetch("/tasks");


    if (response.status === 200) {
      const tasks = await response.json();
      return tasks;
    } else {
      throw new Error(response.statusText);
    }
  };

  getTasks()
    .then(responseData => {
      const tasks = responseData.tasks;
      organizeTasks(tasks);
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });
}

// Remove visualizer if exists
const volumeBoosterVisualizer = document.getElementById("volume-booster-visusalizer");
if (volumeBoosterVisualizer) {
  volumeBoosterVisualizer.remove();
}

// Fetch tasks on page load
fetchTasks();

// Toggle task insertion container visibility
addTask.addEventListener("click", function () {
  const taskInsertion = document.querySelector("#task-insertion");
  taskInsertion.classList.toggle("disappear");
});

