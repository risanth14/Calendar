// // Select the document elements for handling 
const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    appointmentDay = document.querySelector(".appointment-day"),
    appointmentDate = document.querySelector(".appointment-date"),
    appointmentsContainer = document.querySelector(".appointments"),
    addAppointmentsBook = document.querySelector(".book-appointment-btn");

// Initializing date and calendar variables
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

// Array of month names 
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Array to hold the appointments
let appointmentArr = [];

// Call the get appointment function
getAppointments();

// Initialize and do the first render on the calendar for the current month
function initialCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    date.innerHTML = months[month] + " " + year;

    let days = "";

    // Display the previous month's days
    for (let x = day; x > 0; x--) {
        days += `<div class ="day prev-date">${prevDays - x + 1}</div>`;
    }

    // Display the current month and highlight todays day 
    for (let i = 1; i <= lastDate; i++) {
        let appointment = false;
        appointmentArr.forEach((appointmentObj) => {
            if (
                appointmentObj.day === i &&
                appointmentObj.month === month + 1 &&
                appointmentObj.year === year
            ) {
                appointment = true;
            }
        });

        if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            activeDay = i;
            getActiveDay(i);
            updateAppointments(i);

            if (appointment) {
                days += `<div class="day today active appointment">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } else {
            if (appointment) {
                days += `<div class="day appointment">${i}</div>`;
            } else {
                days += `<div class="day">${i}</div>`;
            }
        }
    }

    // Display the next months days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class ="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;
    addListener(); 
}

// Initial call to display the calendar
initialCalendar();

// Function to go to the previous month
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initialCalendar();
}

// Function to go to the next month
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initialCalendar();
}

// Add listener to the next and previous month buttins
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Select the appointment elements for handling 
const bookAppointmentBtn = document.querySelector(".book-appointment"),
    addAppointmentContainer = document.querySelector(".add-appointment-wrapper"),
    addAppointmentCloseBtn = document.querySelector(".close"),
    addAppointmentTitle = document.querySelector(".appointment-name"),
    addAppointmentTime = document.querySelector(".appointment-time"), 
    addAppointmentReason = document.querySelector(".appointment-reason");

// Add the listner so when the button is clicked it will open the add appointment container
bookAppointmentBtn.addEventListener("click", () => {
    addAppointmentContainer.classList.toggle("active");
});

// When the user clicks the x button in the addAppointmentContainer, it will close it and reset the fields
addAppointmentCloseBtn.addEventListener("click", () => {
    addAppointmentContainer.classList.remove("active");
    addAppointmentTitle.value = "";
    addAppointmentTime.value = ""; 
    addAppointmentReason.value = "";
});

// If the user clicks outside of the bookappointment from , close it
document.addEventListener("click", (e) => {
    if (e.target !== bookAppointmentBtn && !addAppointmentContainer.contains(e.target))
        addAppointmentContainer.classList.remove("active");
});

// Limit the user so they can only enter a max of 50 characters for the appointment title
addAppointmentTitle.addEventListener("input", (e) => {
    addAppointmentTitle.value = addAppointmentTitle.value.slice(0, 50);
});

// Add the listeners to each day on the calendar so the user can book appointments for everyday
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);
            getActiveDay(activeDay);
            updateAppointments(Number(e.target.innerHTML));
            days.forEach((d) => {
                d.classList.remove("active");
            });

            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((d) => {
                        if (
                            !d.classList.contains("prev-date") &&
                            d.innerHTML === e.target.innerHTML
                        ) {
                            d.classList.add("active");
                        }
                    });
                    updateAppointments(activeDay);
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((d) => {
                        if (
                            !d.classList.contains("next-date") &&
                            d.innerHTML === e.target.innerHTML
                        ) {
                            d.classList.add("active");
                        }
                    });
                    updateAppointments(activeDay);
                }, 100);
            } else {
                e.target.classList.add("active");
                updateAppointments(activeDay);
            }
        });
    });
}

// Display the selected days day and date
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    appointmentDay.innerHTML = dayName;
    appointmentDate.innerHTML = date + " " + months[month] + " " + year;
}

// Update the appointment list based on which day it is today to display the booked appointments to the user
function updateAppointments(selectedDate) {
    let appointments = "";
    appointmentArr.forEach((appointment) => {
        if (
            selectedDate === appointment.day &&
            month + 1 === appointment.month &&
            year === appointment.year
        ) {
            appointment.appointments.forEach((appt) => {
                appointments += `
                <div class="appointment">
                    <div class="type">
                        <i class="fas fa-circle"></i>
                        <h3 class="appointment-type">${appt.title}</h3> 
                    </div>
                    <div class="appointment-time">
                        <span class="appointment-time">${appt.time}</span>
                    </div>
                    <div class="appointment-reason">
                        <span class="appointment-reason">${appt.reason}</span>
                    </div>
                </div>
                `;
            });
        }
    });

    if (appointments === "") {
        appointments = `
        <div class="no-appointment">
            <h3>No Appointment</h3>
        </div>`;
    }

    appointmentsContainer.innerHTML = appointments;

    // Call the save appointment function to save appointments to the local storage
    saveAppointments(); 
}

// Add the listener so that when the user selects a day, they can add a appointment to that selected day
addAppointmentsBook.addEventListener("click", () => {
    const appointmentTitle = addAppointmentTitle.value.trim();
    const appointmentTime = addAppointmentTime.value; 
    const appointmentReason = addAppointmentReason.value.trim();

    if (appointmentTitle === "" || appointmentTime === "" || appointmentReason === "") {
        alert("Please respond to all questions");
        return;
    }

    // Check if the time the user is trying to book a appointment for is already booked
    const isTimeBooked = appointmentArr.some((item) => {
        return item.day === activeDay &&
            item.month === month + 1 &&
            item.year === year &&
            item.appointments.some(appt => appt.time === appointmentTime);
    });

    // Tell the user the appointment is already booked
    if (isTimeBooked) {
        alert("This time slot is already booked. Please pick another time.");
        return;
    }
    const newAppointment = {
        title: appointmentTitle,
        time: appointmentTime,
        reason: appointmentReason,
    };

    let appointmentAdded = false;

    // Add the appointment to that day in the appintment array or make a new day entry
    if (appointmentArr.length > 0) {
        appointmentArr.forEach((item) => {
            if (item.day === activeDay && item.month === month + 1 && item.year === year) {
                item.appointments.push(newAppointment);
                appointmentAdded = true;
            }
        });
    }

    if (!appointmentAdded) {
        appointmentArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            appointments: [newAppointment],
        });
    }

    addAppointmentContainer.classList.remove("active");
    addAppointmentTitle.value = "";
    addAppointmentTime.value = "";
    addAppointmentReason.value = "";

    updateAppointments(activeDay);

    const activeDayElem = document.querySelector(".day.active");
    if (!activeDayElem.classList.contains("appointment")) {
        activeDayElem.classList.add("appointment");
    }
});

// Add the listener so if the user clicks on it, it will delete that event on that selected day
appointmentsContainer.addEventListener("click", (e) => {
    const appointmentElement = e.target.closest(".appointment");
    if (appointmentElement) {
        const appointmentTitle = appointmentElement.querySelector(".appointment-type").innerHTML;
        const confirmDelete = confirm("Do you want to delete this appointment?");

        if (confirmDelete) {
            appointmentArr.forEach((appointment) => {
                if (
                    appointment.day === activeDay &&
                    appointment.month === month + 1 &&
                    appointment.year === year
                ) {
                    appointment.appointments.forEach((item, index) => {
                        if (item.title === appointmentTitle) {
                            appointment.appointments.splice(index, 1);
                            if (appointment.appointments.length === 0) {
                                const appointmentIndex = appointmentArr.indexOf(appointment);
                                appointmentArr.splice(appointmentIndex, 1);
                            }
                        }
                    });

                    if (appointment.appointments.length === 0) {
                        appointmentArr.splice(appointmentArr.indexOf(appointment), 1);
                        const activeDayElem = document.querySelector(".day.active");
                        if (activeDayElem.classList.contains("appointment")) {
                            activeDayElem.classList.remove("appointment");
                        }
                    }
                }
            });

            updateAppointments(activeDay);
        }
    }
});

// Save the appointments array to the local storage
function saveAppointments() {
    localStorage.setItem("appointments", JSON.stringify(appointmentArr));
}

// If there is any appointments saved in the local storage get those and add it to the calendar
function getAppointments() {
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) {
        appointmentArr = JSON.parse(savedAppointments);
    }
}
