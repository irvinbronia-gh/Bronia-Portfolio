// EMAIL FUNCTION 
function sendMail() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    if (name === "" || email === "" || message === "") {
        alert("Please fill in all fields before submitting.");
        return;
    }

    var params = { name, email, message };

    emailjs.send("service_oenbbue", "template_px0ftns", params)
        .then(() => {
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
            alert("Message Sent Successfully");
        })
        .catch(err => console.error(err));
}

//WEATHER FUNCTION
document.addEventListener("DOMContentLoaded", function () {
    // Load default city
    loadWeather("Daet,PH");

    // Event listener for search
    document.getElementById("get-weather-btn").addEventListener("click", function () {
        const city = document.getElementById("city-input").value.trim();
        if (city) loadWeather(city);
    });
});

// Global map & marker
let map;
let marker;

// OpenWeather API key
const weatherApiKey = "a74022d2a3de3e8afdd8c47f67da73f8";

// Function to load weather & update map
function loadWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                document.getElementById("weather-location").textContent =
                    "Weather unavailable (check city name or API key)";
                document.getElementById("weather-temp").textContent = "";
                document.getElementById("weather-desc").textContent = "";
                console.error(data);
                return;
            }

            // Display weather info
            document.getElementById("weather-location").textContent =
                `${data.name}, ${data.sys.country}`;
            document.getElementById("weather-temp").textContent =
                `Temperature: ${data.main.temp}°C`;
            document.getElementById("weather-desc").textContent =
                `Condition: ${data.weather[0].description}`;

            // Update map
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            updateMap(lat, lon);
        })
        .catch(err => console.error(err));
}

// Initialize / update Leaflet map
function updateMap(lat, lon) {
    if (!map) {
        // First time: initialize map
        map = L.map('map').setView([lat, lon], 10);

        // Base map layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // OpenWeather tiles overlay (temperature example)
        L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.5
        }).addTo(map);

        // Marker
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        // Update existing map
        map.setView([lat, lon], 10);
        marker.setLatLng([lat, lon]);
    }
}


function loadQuote() {
    const quoteText = document.getElementById("quote-text");
    const loading = document.getElementById("quote-loading");
    const button = document.getElementById("quote-btn");

    // Start loading UI
    loading.style.display = "block";
    button.disabled = true;
    button.textContent = "Loading...";

    // Add cache-buster to avoid API caching issue
    fetch("https://api.adviceslip.com/advice?timestamp=" + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        })
        .then(data => {
            quoteText.textContent = `"${data.slip.advice}"`;
        })
        .catch(error => {
            console.error("Quote error:", error);
            quoteText.textContent = "Unable to load quote. Try again.";
        })
        .finally(() => {
            loading.style.display = "none";
            button.disabled = false;
            button.textContent = "New Quote";
        });
}

const paymentDetails = document.getElementById("payment-details");
const statusBox = document.getElementById("payment-status");

// Show fields based on payment method
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener("change", function () {
        paymentDetails.innerHTML = "";

        if (this.value === "gcash") {
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <h5>GCash Number:</h5>
                    <input type="text" id="gcash-number" class="form-control" placeholder="09XXXXXXXXX">
                </div>
            `;
        }

        if (this.value === "paypal") {
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <h5>PayPal Email:</h5>
                    <input type="email" id="paypal-email" class="form-control" placeholder="example@email.com">
                </div>
            `;
        }

        if (this.value === "card") {
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <h5>Card Number:</h5>
                    <input type="text" id="card-number" class="form-control" placeholder="XXXX XXXX XXXX XXXX">
                </div>
                <div class="form-group">
                    <h5>Expiry Date:</h5>
                    <input type="month" id="card-expiry" class="form-control">
                </div>
            `;
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {

    const paymentDetails = document.getElementById("payment-details");
    const statusBox = document.getElementById("payment-status");

    // Function to show dynamic fields
    function showPaymentFields(method) {
        if (method === "gcash") {
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <h5>GCash Number:</h5>
                    <input type="text" id="gcash-number"
                           class="form-control number-only"
                           placeholder="09XXXXXXXXX" maxlength="11">
                </div>
            `;
        } else if (method === "paypal") {
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <h5>PayPal Email:</h5>
                    <input type="email" id="paypal-email"
                           class="form-control"
                           placeholder="example@email.com">
                </div>
            `;
        } else if (method === "card") {
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <h5>Card Number:</h5>
                    <input type="text" id="card-number"
                           class="form-control number-only"
                           placeholder="XXXX XXXX XXXX XXXX" maxlength="16">
                </div>
                <div class="form-group">
                    <h5>Expiry Date:</h5>
                    <input type="month" id="card-expiry" class="form-control">
                </div>
            `;
        }
    }

    // Listen for radio changes
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener("change", function () {
            showPaymentFields(this.value);
        });
    });

    // Highlight selected card
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.payment-card')
                .forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            const method = this.querySelector('input[name="payment-method"]').value;
            showPaymentFields(method);
        });
    });

    // Restrict number-only fields
    document.addEventListener("input", function (e) {
        if (e.target.classList.contains("number-only")) {
            // Remove all non-numeric characters
            e.target.value = e.target.value.replace(/\D/g, "");
        }
    });

    // Handle payment submission
    document.getElementById("pay-btn").addEventListener("click", function () {
        const name = document.getElementById("pay-name").value.trim();
        const email = document.getElementById("pay-email").value.trim();
        const amount = document.getElementById("pay-amount").value.trim();
        const method = document.querySelector('input[name="payment-method"]:checked');

        statusBox.className = "donation-status";
        statusBox.textContent = "";

        // Validation
        if (!name || !email || !amount || !method) {
            statusBox.textContent = "Please complete all required fields.";
            statusBox.classList.add("error");
            return;
        }

        if (amount <= 0) {
            statusBox.textContent = "Amount must be greater than zero.";
            statusBox.classList.add("error");
            return;
        }

        if (method.value === "gcash" && !document.getElementById("gcash-number")?.value) {
            statusBox.textContent = "Please enter your GCash number.";
            statusBox.classList.add("error");
            return;
        }

        if (method.value === "paypal" && !document.getElementById("paypal-email")?.value) {
            statusBox.textContent = "Please enter your PayPal email.";
            statusBox.classList.add("error");
            return;
        }

        if (method.value === "card" && !document.getElementById("card-number")?.value) {
            statusBox.textContent = "Please enter card details.";
            statusBox.classList.add("error");
            return;
        }

        // Simulate payment
        statusBox.textContent = "Processing payment...";
        statusBox.classList.add("processing");

        setTimeout(() => {
            const transactionId = "TXN-" + Math.floor(Math.random() * 1000000);
            statusBox.className = "donation-status success";
            statusBox.innerHTML = `
                Payment Successful! <br>
                Transaction ID: <b>${transactionId}</b><br>
                Amount Paid: ₱${amount}<br>
                Method: ${method.value.toUpperCase()}
            `;
        }, 2000);
    });

});
