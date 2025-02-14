$(document).ready(function() {
    // 1. Load featured destinations dynamically
    function loadFeaturedDestinations() {
        $.ajax({
            url: 'api/featured-destinations.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let featuredHTML = '';
                $.each(data, function(index, destination) {
                    featuredHTML += `
                        <div class="destination-card">
                            <img src="${destination.image}" alt="${destination.name}">
                            <h3>${destination.name}</h3>
                            <p>${destination.description}</p>
                            <span class="price">From $${destination.price}</span>
                            <button class="view-details" data-id="${destination.id}">View Details</button>
                        </div>
                    `;
                });
                $('#featured-destinations').html(featuredHTML);
            },
            error: function() {
                $('#featured-destinations').html('<p class="error">Could not load featured destinations</p>');
            }
        });
    }

    // 2. Handle login form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: 'api/login',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    localStorage.setItem('userToken', response.token);
                    window.location.href = 'dashboard.html';
                } else {
                    $('#login-error').text(response.message).show();
                }
            },
            error: function() {
                $('#login-error').text('An error occurred during login. Please try again.').show();
            }
        });
    });

    // 3. Handle registration form submission
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serialize();

        $.ajax({
            url: 'api/register',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#register-message').removeClass('error').addClass('success')
                        .text('Registration successful! Redirecting to login...').show();
                    setTimeout(function() {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    $('#register-message').removeClass('success').addClass('error')
                        .text(response.message).show();
                }
            },
            error: function() {
                $('#register-message').removeClass('success').addClass('error')
                    .text('An error occurred during registration. Please try again.').show();
            }
        });
    });

    // 4. Search destinations with autocomplete
    $('#search-destination').autocomplete({
        source: function(request, response) {
            $.ajax({
                url: 'api/search-destinations',
                dataType: 'json',
                data: {
                    term: request.term
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 2,
        select: function(event, ui) {
            window.location.href = 'destination-details.html?id=' + ui.item.id;
        }
    });

    // 5. Load user notifications
    function loadNotifications() {
        const token = localStorage.getItem('userToken');
        if (token) {
            $.ajax({
                url: 'api/notifications',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: 'json',
                success: function(data) {
                    if (data.length > 0) {
                        let notificationHTML = '';
                        $.each(data, function(index, notification) {
                            notificationHTML += `
                                <div class="notification ${notification.read ? 'read' : 'unread'}">
                                    <h4>${notification.title}</h4>
                                    <p>${notification.message}</p>
                                    <span class="time">${notification.time}</span>
                                </div>
                            `;
                        });
                        
                        $('#notification-count').text(data.filter(n => !n.read).length);
                        $('#notifications-container').html(notificationHTML);
                    } else {
                        $('#notification-count').text('0');
                        $('#notifications-container').html('<p>No new notifications</p>');
                    }
                },
                error: function() {
                    console.error('Failed to load notifications');
                }
            });
        }
    }

    // 6. Submit newsletter subscription
    $('#newsletter-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#newsletter-email').val();
        
        $.ajax({
            url: 'api/subscribe-newsletter',
            type: 'POST',
            data: { email: email },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#newsletter-message').removeClass('error').addClass('success')
                        .text('Thank you for subscribing!').show();
                    $('#newsletter-email').val('');
                } else {
                    $('#newsletter-message').removeClass('success').addClass('error')
                        .text(response.message).show();
                }
            },
            error: function() {
                $('#newsletter-message').removeClass('success').addClass('error')
                    .text('An error occurred. Please try again later.').show();
            }
        });
    });

    // 7. Load and switch between user saved trips
    function loadSavedTrips() {
        const token = localStorage.getItem('userToken');
        if (token) {
            $.ajax({
                url: 'api/saved-trips',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: 'json',
                success: function(data) {
                    if (data.length > 0) {
                        let tripsHTML = '';
                        $.each(data, function(index, trip) {
                            tripsHTML += `
                                <div class="trip-card" data-id="${trip.id}">
                                    <img src="${trip.image}" alt="${trip.destination}">
                                    <h3>${trip.destination}</h3>
                                    <p>${trip.dates}</p>
                                    <button class="view-trip">View Details</button>
                                    <button class="delete-trip" data-id="${trip.id}">Delete</button>
                                </div>
                            `;
                        });
                        $('#saved-trips').html(tripsHTML);
                    } else {
                        $('#saved-trips').html('<p>No saved trips found. Start planning your adventure!</p>');
                    }
                },
                error: function() {
                    $('#saved-trips').html('<p class="error">Could not load saved trips</p>');
                }
            });
        }
    }

    // 8. Handle trip deletion
    $(document).on('click', '.delete-trip', function() {
        const tripId = $(this).data('id');
        const token = localStorage.getItem('userToken');
        
        if (confirm('Are you sure you want to delete this trip?')) {
            $.ajax({
                url: 'api/delete-trip',
                type: 'DELETE',
                data: { id: tripId },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        $(`.trip-card[data-id="${tripId}"]`).fadeOut(300, function() {
                            $(this).remove();
                            if ($('#saved-trips').children().length === 0) {
                                $('#saved-trips').html('<p>No saved trips found. Start planning your adventure!</p>');
                            }
                        });
                    } else {
                        alert(response.message);
                    }
                },
                error: function() {
                    alert('An error occurred while trying to delete the trip. Please try again.');
                }
            });
        }
    });

    // 9. Load weather information for selected destination
    function loadDestinationWeather(destinationId) {
        $.ajax({
            url: `api/destination-weather/${destinationId}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let weatherHTML = `
                    <div class="weather-info">
                        <h3>Current Weather in ${data.location}</h3>
                        <div class="weather-details">
                            <img src="${data.icon}" alt="${data.condition}">
                            <div class="temp">${data.temperature}°C</div>
                            <div class="condition">${data.condition}</div>
                        </div>
                        <div class="forecast">
                            <h4>5-Day Forecast</h4>
                            <div class="forecast-days">
                `;
                
                $.each(data.forecast, function(index, day) {
                    weatherHTML += `
                        <div class="forecast-day">
                            <div class="day-name">${day.day}</div>
                            <img src="${day.icon}" alt="${day.condition}">
                            <div class="temp-range">${day.min}° - ${day.max}°</div>
                        </div>
                    `;
                });
                
                weatherHTML += `
                            </div>
                        </div>
                    </div>
                `;
                
                $('#destination-weather').html(weatherHTML);
            },
            error: function() {
                $('#destination-weather').html('<p class="error">Weather information is currently unavailable</p>');
            }
        });
    }

    // 10. Submit and load reviews for destinations
    function loadDestinationReviews(destinationId) {
        $.ajax({
            url: `api/destination-reviews/${destinationId}`,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.length > 0) {
                    let reviewsHTML = '<div class="reviews-container">';
                    
                    $.each(data, function(index, review) {
                        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
                        reviewsHTML += `
                            <div class="review">
                                <div class="review-header">
                                    <span class="reviewer">${review.user}</span>
                                    <span class="review-date">${review.date}</span>
                                    <div class="rating">${stars}</div>
                                </div>
                                <p class="review-text">${review.comment}</p>
                            </div>
                        `;
                    });
                    
                    reviewsHTML += '</div>';
                    $('#destination-reviews').html(reviewsHTML);
                } else {
                    $('#destination-reviews').html('<p>No reviews yet. Be the first to leave a review!</p>');
                }
            },
            error: function() {
                $('#destination-reviews').html('<p class="error">Could not load reviews</p>');
            }
        });
    }

    // 11. Submit a new review
    $('#review-form').on('submit', function(e) {
        e.preventDefault();
        const destinationId = $(this).data('destination-id');
        const rating = $('#review-rating').val();
        const comment = $('#review-comment').val();
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            alert('Please log in to submit a review');
            return;
        }
        
        $.ajax({
            url: 'api/submit-review',
            type: 'POST',
            data: {
                destinationId: destinationId,
                rating: rating,
                comment: comment
            },
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#review-message').removeClass('error').addClass('success')
                        .text('Your review has been submitted successfully!').show();
                    $('#review-comment').val('');
                    // Reload reviews to show the new one
                    loadDestinationReviews(destinationId);
                } else {
                    $('#review-message').removeClass('success').addClass('error')
                        .text(response.message).show();
                }
            },
            error: function() {
                $('#review-message').removeClass('success').addClass('error')
                    .text('An error occurred while submitting your review. Please try again.').show();
            }
        });
    });

    // 12. Load currency exchange rates for travel planning
    function loadCurrencyRates() {
        $.ajax({
            url: 'api/currency-rates',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let ratesHTML = '<table class="currency-table"><thead><tr>' +
                    '<th>Currency</th><th>Code</th><th>Rate (USD)</th></tr></thead><tbody>';
                
                $.each(data.rates, function(code, rate) {
                    ratesHTML += `
                        <tr>
                            <td>${data.currencies[code] || code}</td>
                            <td>${code}</td>
                            <td>${rate.toFixed(4)}</td>
                        </tr>
                    `;
                });
                
                ratesHTML += '</tbody></table>';
                $('#currency-rates').html(ratesHTML);
                $('#currency-updated').text(`Last updated: ${data.date}`);
            },
            error: function() {
                $('#currency-rates').html('<p class="error">Could not load currency rates</p>');
            }
        });
    }

    // 13. Currency converter tool
    $('#currency-converter').on('submit', function(e) {
        e.preventDefault();
        const amount = $('#convert-amount').val();
        const fromCurrency = $('#convert-from').val();
        const toCurrency = $('#convert-to').val();
        
        $.ajax({
            url: 'api/convert-currency',
            type: 'GET',
            data: {
                amount: amount,
                from: fromCurrency,
                to: toCurrency
            },
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    $('#conversion-result').html(`
                        <div class="result-box">
                            <p>${amount} ${fromCurrency} = ${data.result.toFixed(2)} ${toCurrency}</p>
                            <p class="rate-info">Rate: 1 ${fromCurrency} = ${data.rate} ${toCurrency}</p>
                        </div>
                    `);
                } else {
                    $('#conversion-result').html(`<p class="error">${data.message}</p>`);
                }
            },
            error: function() {
                $('#conversion-result').html('<p class="error">Currency conversion failed. Please try again.</p>');
            }
        });
    });

    // 14. Progress tracker for booking process
    function updateBookingProgress(currentStep) {
        const totalSteps = 4; // e.g., 1: Selection, 2: Dates, 3: Details, 4: Payment
        const percentage = (currentStep / totalSteps) * 100;
        
        $('#booking-progress-bar').css('width', percentage + '%');
        $('#booking-step-number').text(`Step ${currentStep} of ${totalSteps}`);
        
        // Toggle active state for step indicators
        $('.booking-step').removeClass('active');
        $(`.booking-step:nth-child(-n+${currentStep})`).addClass('active');
    }

    // 15. Submit contact form with validation
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        let hasError = false;
        
        // Simple front-end validation
        $(this).find('input, textarea').each(function() {
            if ($(this).prop('required') && !$(this).val().trim()) {
                $(this).addClass('error-field');
                hasError = true;
            } else {
                $(this).removeClass('error-field');
            }
        });
        
        if (hasError) {
            $('#contact-message').removeClass('success').addClass('error')
                .text('Please fill all required fields').show();
            return;
        }
        
        const formData = $(this).serialize();
        
        $.ajax({
            url: 'api/submit-contact',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#contact-form')[0].reset();
                    $('#contact-message').removeClass('error').addClass('success')
                        .text('Your message has been sent successfully! We will contact you soon.').show();
                } else {
                    $('#contact-message').removeClass('success').addClass('error')
                        .text(response.message).show();
                }
            },
            error: function() {
                $('#contact-message').removeClass('success').addClass('error')
                    .text('An error occurred while sending your message. Please try again later.').show();
            }
        });
    });

    // Initialize functions that should run on page load
    loadFeaturedDestinations();
    loadNotifications();
    
    // Check if we're on the saved trips page
    if ($('#saved-trips').length) {
        loadSavedTrips();
    }
    
    // Check if we're on a destination details page
    const urlParams = new URLSearchParams(window.location.search);
    const destinationId = urlParams.get('id');
    if (destinationId && $('#destination-weather').length) {
        loadDestinationWeather(destinationId);
        loadDestinationReviews(destinationId);
    }
    
    // Check if we're on the currency page
    if ($('#currency-rates').length) {
        loadCurrencyRates();
    }
});