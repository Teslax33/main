// // Google Maps Initialization
// let map;

// async function initMap() {
//     const { Map } = await google.maps.importLibrary("maps");

//     map = new Map(document.getElementById("map"), {
//         center: { lat: -34.397, lng: 150.644 },
//         zoom: 8,
//     });
// }

// initMap();

document.addEventListener('DOMContentLoaded', function() {
    var bookingModal = document.getElementById("book_card"); // Assuming "book_card" is the ID of your pop-up element

    function showBookingPopup() {
        bookingModal.style.display = "block";
    }

    // Add an event listener to the element that triggers the pop-up
    // For example, if it's a button:
    var showBookingButton = document.getElementById("show_booking_button"); // Replace "show_booking_button" with the ID of your button
    showBookingButton.addEventListener("click", function() {
        showBookingPopup();
    });
});



    document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("userInfoModal");
    var userInfoButton = document.getElementById("userInfoButton");
    var closeButton = document.querySelector(".modal .close");

    function isFormFilled() {
        var origin = document.getElementById("from").value.trim();
        var destination = document.getElementById("to").value.trim();
        return origin !== "" && destination !== "";
    }

    function showModal() {
        var origin = document.getElementById("from").value.trim();
        var destination = document.getElementById("to").value.trim();
        
        document.getElementById("from_res").value = origin;
        document.getElementById("to_res").value = destination;
        
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    document.getElementById("from").addEventListener("input", function() {
        userInfoButton.disabled = !isFormFilled();
    });

    document.getElementById("to").addEventListener("input", function() {
        userInfoButton.disabled = !isFormFilled();
    });

    userInfoButton.addEventListener("click", function() {
        if (isFormFilled()) {
            showModal();
        }
    });

    closeButton.addEventListener("click", function() {
        closeModal();
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
});

// Code for the calender modal in the dahboard page //


document.addEventListener("DOMContentLoaded", () => {
    const currentDate = document.querySelector(".current-date"),
        daysTag = document.querySelector(".days"),
        prevNextIcon = document.querySelectorAll(".icons span"),
        dateInput = document.getElementById("date"); // Get the date input field

    let date = new Date(),
        currYear = date.getFullYear(),
        currMonth = date.getMonth();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const renderCalendar = () => {
        let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(),
            lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
            lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate(),
            liTag = "";

        for (let i = firstDayOfMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateOfMonth; i++) {
            let isToday = i === date.getDate() && currMonth === date.getMonth() && currYear === date.getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}" data-date="${currMonth + 1}/${i}/${currYear}">${i}</li>`;
        }

        currentDate.innerText = `${months[currMonth]} ${currYear}`;
        daysTag.innerHTML = liTag;
    };

    renderCalendar();

    daysTag.addEventListener("click", (event) => {
        if (event.target.tagName === "LI" && !event.target.classList.contains("inactive")) {
            const selectedDate = event.target.dataset.date;
            dateInput.value = selectedDate; // Update the date input field with the selected date
        }
    });

    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0) {
                currMonth = 11;
                currYear -= 1;
            }
            if (currMonth > 11) {
                currMonth = 0;
                currYear += 1;
            }

            renderCalendar();
        });
    });
});
