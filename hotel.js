//gets current time
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// all 6 room states
let Rooms = {
    1: { book: [], locked: false },
    2: { book: [], locked: false },
    3: { book: [], locked: false },
    4: { book: [], locked: false },
    5: { book: [], locked: false },
    6: { book: [], locked: false }
};

let MasterHistory = [];

// the history function/ format for how it looks
function addToHistory(action, guestName, roomNum) {
    const logEntry = {
        action: action,
        name: guestName,
        room: roomNum,
        time: getCurrentTime()
    };
    MasterHistory.unshift(logEntry); // puts newest adds at the top of the list
    renderHistory();
}

//the actual function to list the adds and removes
function renderHistory() {
    const list = document.getElementById("masterHistoryList");
    list.innerHTML = "";
    MasterHistory.forEach(log => {
        const li = document.createElement("li");
        // makes it green for added and red for the removed
        li.style.borderLeft = log.action === "Added" ? "4px solid #2ecc71" : "4px solid #bc002d";
        li.textContent = `[${log.time}] ${log.action}: ${log.name} — Room ${log.room}`;
        list.appendChild(li);
    });
}
//clear function
function ClearHistory() {
    //checks to make sure if you want to clear it before it actaully removes everything
    if(confirm("Are you sure you want to wipe the history log?")) {
        MasterHistory = [];
        renderHistory();
    }
}

// guests function to show the guests in the room
function showGuests(roomNum) {
    // Finds the HTML element (usually a <ul> or <ol>) where the guests will be listed
    const list = document.getElementById(`guestList${roomNum}`);
    // Clears any existing text or list items inside that element
    list.innerHTML = "";
    // Loops through the 'book' array (the list of guest objects) for that specific room
    Rooms[roomNum].book.forEach(g => {
        // Creates a new 'li' (list item) element in memory
        let li = document.createElement("li");
        // Sets the text of the list item to show the guest's name and their check-in time
        li.textContent = `${g.name} (${g.time})`;
        // Adds the newly created list item into the actual HTML list on the page
        list.appendChild(li);
    });
}


// add function / the logic that adds guests
function AddGuest(roomNum) {
    // If the room's 'locked' property is true, show an alert and stop the function immediately
    if (Rooms[roomNum].locked) return alert("This room is locked!");
    
    // Finds the input text field where the user typed the guest's name
    let input = document.getElementById(`GuestName${roomNum}`);
    // Gets the value from the input and removes any accidental spaces at the start or end
    let name = input.value.trim();
    
    // If the name field is empty after trimming, stop the function
    if (name === "") return;
    // If the room already has 4 or more guests, show an alert and stop the function
    if (Rooms[roomNum].book.length >= 4) return alert("Room capacity reached (Max 4)!");

    // Adds a new object containing the name and current time to the room's 'book' array
    Rooms[roomNum].book.push({ name: name, time: getCurrentTime() });
    
    // Calls a helper function to log this action in the history log
    addToHistory("Added", name, roomNum);
    // Refreshes the visual list on the screen to show the new guest
    showGuests(roomNum);
    // Clears the input field so it's ready for the next name
    input.value = "";
}

//remove guest funciton

// Defines a function to remove a specific guest by name
function RemoveGuest(roomNum) {
    // Finds the input field where the user typed the name they want to remove
    let input = document.getElementById(`Removename${roomNum}`);
    // Trims any whitespace from that name
    let nameToRemove = input.value.trim();
    
    // Checks the room's array to see if any guest object has a name matching the input
    const guestExists = Rooms[roomNum].book.some(g => g.name === nameToRemove);

    // If the guest was found in the array
    if (guestExists) {
        // Re-writes the array to include only guests whose names do NOT match the one to remove
        Rooms[roomNum].book = Rooms[roomNum].book.filter(g => g.name !== nameToRemove);
        // Logs the removal in the history section
        addToHistory("Removed", nameToRemove, roomNum);
        // Refreshes the visual list on the screen
        showGuests(roomNum);
    // If the guest wasn't found (and the user didn't just leave the box empty)
    } else if (nameToRemove !== "") {
        // Show an error message
        alert("Guest not found in this room.");
    }
    // Clear the removal input field
    input.value = "";
}

// Defines a function to kick everyone out of a room at once
function RemoveAllGuests(roomNum) {
    // If the room is already empty, do nothing and stop
    if (Rooms[roomNum].book.length === 0) return;
    
    // Show a pop-up asking for confirmation; if user clicks "OK"
    if(confirm(`Clear all guests from Room ${roomNum}?`)) {
        // Log the mass removal in the history
        addToHistory("Cleared Room", "All Guests", roomNum);
        // Set the room's guest array to be completely empty
        Rooms[roomNum].book = [];
        // Refresh the visual list on the screen
        showGuests(roomNum);
    }
}

//locking stufffs

// Defines a function to prevent more guests from being added
function LockRoom(num) {
    // Sets the room's internal state to locked
    Rooms[num].locked = true;
    // Disables the "Add" button so it can't be clicked
    document.getElementById(`buttonadd${num}`).disabled = true;
    // Disables the name input field so nothing can be typed
    document.getElementById(`GuestName${num}`).disabled = true;
    // Updates the text on the screen to show a locked message
    document.getElementById(`status-message${num}`).innerText = "🔒 Room Locked";
    // Changes the text color of the status message to a reddish hue
    document.getElementById(`status-message${num}`).style.color = "#bc002d";

}

// Defines a function to allow guest additions again
function UnlockRoom(num) {
    // Sets the room's internal state to unlocked
    Rooms[num].locked = false;
    // Re-enables the "Add" button
    document.getElementById(`buttonadd${num}`).disabled = false;
    // Re-enables the name input field
    document.getElementById(`GuestName${num}`).disabled = false;
    // Removes the "Room Locked" text from the screen
    document.getElementById(`status-message${num}`).innerText = "";
}


// Listens for whenever a user releases a key anywhere on the page
document.addEventListener("keyup", function(event) {
    // If the key released was the "Enter" key
    if (event.key === "Enter") {
        // Figure out which element currently has the blinking cursor (is focused)
        const activeId = document.activeElement.id;
        // Use a Regular Expression to strip away letters and keep only the number from the ID
        const roomNum = activeId.replace(/\D/g, ""); 
        
        // If the focused element doesn't have a number in its ID, stop here
        if (!roomNum) return;

        // If the user was typing in an "Add Guest" box, trigger the AddGuest function
        if (activeId.includes("GuestName")) AddGuest(roomNum);
        // If the user was typing in a "Remove Guest" box, trigger the RemoveGuest function
        if (activeId.includes("Removename")) RemoveGuest(roomNum);
    }
});