$(document).ready(function() {
    // Add global error message styles to head
    $("<style id='error-message-styles'>.validation-error { color: #ff6b6b; font-size: 14px; font-weight: bold; margin: 2px 0; } #error-message, #success-message { font-size: 18px; font-weight: bold; } </style>").appendTo("head");
    
    // Fade in form when page loads with improved animation
    $("#registrationForm").hide().fadeIn(1200, function() {
        // Add a subtle scale effect after fade-in
        $(this).css("transform", "scale(1)");
    });

    // Enhanced username validation and email autofill
    $("#username").on("keyup", function() {
        var username = $(this).val();
        
        // Email auto-generation with validation
        if (username.length > 0 && /^[a-zA-Z0-9_]+$/.test(username)) {
            $("#gmail").val(username + "@gmail.com");
            $(this).css("border-color", "green");
        } else if (username.length > 0) {
            // Invalid username format
            $(this).css("border-color", "red");
            // Don't update email if username has invalid characters
            $("#gmail").val('');
        } else {
            $("#gmail").val('');
            $(this).css("border-color", "");
        }
    });

    // Change the heading color randomly on hover + click
    let colorTimer;
    $("h1").on("mouseenter", function() {
        const $this = $(this);
        colorTimer = setInterval(function() {
            $this.css("color", getRandomColor());
        }, 1000);
    }).on("mouseleave", function() {
        clearInterval(colorTimer);
    }).on("click", function() {
        $(this).css("color", getRandomColor());
        $(this).css("text-shadow", "2px 2px 4px rgba(0,0,0,0.3)");
    });

    // Improved random color function with better contrast
    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 70;
        const lightness = Math.floor(Math.random() * 30) + 35;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // Enhanced password validation with real-time feedback
    $("#confirmPassword").on("keyup", function() {
        var password = $("#password").val();
        var confirmPassword = $(this).val();
        
        if (password === "" || confirmPassword === "") {
            $(this).css("border-color", "");
            return;
        }
        
        // Show visual and textual feedback
        if (password !== confirmPassword) {
            $(this).css("border-color", "red");
            if (!$("#password-match-error").length) {
                $("<div id='password-match-error' class='validation-error'>Passwords do not match</div>").insertAfter(this);
            }
        } else {
            $(this).css("border-color", "green");
            $("#password-match-error").remove();
        }
    });

    // Enhanced input focus effects with transition
    $("input").on("focus", function() {
        $(this).css({
            "border-color": "blue",
            "box-shadow": "0 0 5px rgba(0,0,255,0.5)",
            "transition": "all 0.3s ease"
        });
    }).on("blur", function() {
        $(this).css({
            "border-color": "",
            "box-shadow": "",
            "transition": "all 0.3s ease"
        });
    });

    // Improved password strength checker with visual indicator
    $("#password").on("keyup", function() {
        var password = $(this).val();
        var result = checkPasswordStrength(password);
        
        // Remove any existing strength indicator
        $("#password-strength-meter").remove();
        
        if (password.length > 0) {
            // Create and insert strength meter
            $("<div id='password-strength-meter' style='height:5px;transition:all 0.5s ease;margin-top:2px;'></div>").insertAfter(this);
            
            if (result.strength === "Weak") {
                $("#password-strength-meter").css({
                    "background-color": "red",
                    "width": "30%"
                });
            } else if (result.strength === "Medium") {
                $("#password-strength-meter").css({
                    "background-color": "orange",
                    "width": "60%"
                });
            } else {
                $("#password-strength-meter").css({
                    "background-color": "green",
                    "width": "100%"
                });
            }
            
            // Add text feedback
            if (!$("#password-strength-text").length) {
                $("<div id='password-strength-text' style='font-size:14px;font-weight:bold;margin:2px 0;'></div>").insertAfter("#password-strength-meter");
            }
            $("#password-strength-text").text(result.message).css("color", result.color);
        } else {
            $("#password-strength-text").remove();
        }
    });

    // Enhanced password checker with detailed feedback
    function checkPasswordStrength(password) {
        if (password.length <6) {
            return {
                strength: "Weak",
                message: "Password is too short (minimum 6 characters)",
                color: "#ff6b6b"
            };
        }
        
        let score = 0;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^A-Za-z0-9]/)) score++;
        
        if (score <= 2) {
            return {
                strength: "Medium",
                message: "Add uppercase, numbers or special characters",
                color: "#ffa502"
            };
        }
        
        return {
            strength: "Strong",
            message: "Password strength is good",
            color: "#2ed573"
        };
    }

    // Improved smooth scroll with easing
    $("a[href='#registrationForm']").on("click", function(event) {
        event.preventDefault();
        $("html, body").animate({
            scrollTop: $("#registrationForm").offset().top - 20
        }, 1200, "easeOutQuart");
    });

    // Add form animation on submit button hover
    $("#sb").hover(
        function() {
            $("#registrationForm").css({
                "box-shadow": "0 0 15px rgba(0,255,0,0.3)",
                "transition": "all 0.5s ease"
            });
        },
        function() {
            $("#registrationForm").css({
                "box-shadow": "",
                "transition": "all 0.5s ease"
            });
        }
    );

    // Enhanced form validation with detailed feedback
    function validateForm() {
        let isValid = true;
        $(".validation-error").remove();
        
        // Username validation
        const username = $("#username").val();
        if (!username) {
            addError("#username", "Username is required");
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            addError("#username", "Username must be 3-20 characters and contain only letters, numbers, and underscores");
            isValid = false;
        }
        
        // Date of birth validation
        const dob = $("#dob").val();
        if (!dob) {
            addError("#dob", "Date of birth is required");
            isValid = false;
        } else {
            // Check if user is at least 13 years old
            const dobDate = new Date(dob);
            const today = new Date();
            const minAge = 13;
            const maxAge = 120;
            
            if (getAge(dobDate) < minAge) {
                addError("#dob", `You must be at least ${minAge} years old to register`);
                isValid = false;
            } else if (getAge(dobDate) > maxAge) {
                addError("#dob", "Please enter a valid date of birth");
                isValid = false;
            }
        }
        
        // Email validation
        const email = $("#gmail").val();
        if (!email) {
            addError("#gmail", "Email is required");
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            addError("#gmail", "Please enter a valid email address");
            isValid = false;
        }
        
        // Password validation
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();
        if (!password) {
            addError("#password", "Password is required");
            isValid = false;
        } else if (password.length <6) {
            addError("#password", "Password must be at least 6 characters long");
            isValid = false;
        }
        
        if (!confirmPassword) {
            addError("#confirmPassword", "Please confirm your password");
            isValid = false;
        } else if (password !== confirmPassword) {
            addError("#confirmPassword", "Passwords do not match");
            isValid = false;
        }
        
        return isValid;
    }
    
    function addError(selector, message) {
        $(`<div class="validation-error">${message}</div>`)
            .insertAfter(selector);
        
        // Reduce spacing between fields with errors
        $(selector).css("margin-bottom", "1px")
                   .next(".validation-error").css("margin-bottom", "1px");
    }
    
    function getAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Enhanced AJAX form submission with better error handling and loading indicator
    $("#registrationForm").on("submit", function(event) {
        event.preventDefault();

        if (!validateForm()) {
            // Apply shake effect only to invalid fields for better UX
            $(".validation-error").closest(".container").effect("shake", { times: 2, distance: 5 }, 300);
            return;
        }

        // Show loading indicator
        if (!$("#loading-indicator").length) {
            $("<div id='loading-indicator' style='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.8);padding:20px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.2);z-index:1000;'><span style='display:inline-block;width:20px;height:20px;border:3px solid #ccc;border-radius:50%;border-top-color:#3498db;animation:spin 1s infinite linear;'></span> Processing your registration...</div>").appendTo("body");
        }
        
        // Add animation keyframes for loading spinner
        if (!$("#spin-animation").length) {
            $("<style id='spin-animation'>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>").appendTo("head");
        }

        // Collect extended form data with additional validation
        var formData = {
            username: $("#username").val().trim(),
            dob: $("#dob").val(),
            email: $("#gmail").val().trim(),
            password: $("#password").val(),
            userType: $("#userType").val(),
            registrationDate: new Date().toISOString()
        };

        // Enhanced AJAX request with better error handling
        $.ajax({
            type: "POST",
            url: "register.php",
            data: formData,
            dataType: "json",
            timeout: 15000, // 15 second timeout
            success: function(response) {
                $("#loading-indicator").remove();
                if (response.success) {
                    // Show success message with animation
                    $("<div id='success-message' style='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(39,174,96,0.9);color:white;padding:20px;border-radius:10px;box-shadow:0 0 20px rgba(0,0,0,0.3);z-index:1000;'>Registration Successful! Redirecting you...</div>").appendTo("body").hide().fadeIn(500);
                    
                    // Store user data in local storage for welcome page
                    localStorage.setItem("userRegistrationData", JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        registrationDate: formData.registrationDate
                    }));
                    
                    // Redirect after success with delay
                    setTimeout(function() {
                        window.location.href = "welcome.html";
                    }, 2500);
                } else {
                    // Show specific error message
                    showErrorMessage(response.message || "Registration failed. Please try again.");
                }
            },
            error: function(xhr, status, error) {
                $("#loading-indicator").remove();
                if (status === "timeout") {
                    showErrorMessage("Request timed out. Please check your internet connection and try again.");
                } else if (xhr.status === 0) {
                    showErrorMessage("Cannot connect to the server. Please check your internet connection.");
                } else {
                    showErrorMessage("Error in registration: " + (xhr.responseJSON?.message || error || "Unknown error occurred"));
                }
            }
        });
    });
    
    function showErrorMessage(message) {
        // Remove any existing error messages
        $("#error-message").remove();
        
        // Create and show new error message with updated styling
        $("<div id='error-message' style='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,107,107,0.9);color:white;padding:20px;border-radius:10px;box-shadow:0 0 20px rgba(0,0,0,0.3);z-index:1000;'>" + message + "</div>")
            .appendTo("body")
            .hide()
            .fadeIn(500);
        
        // Auto-hide error message after 5 seconds
        setTimeout(function() {
            $("#error-message").fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);
    }

    // Add browser support check for HTML5 features
    if (typeof window.localStorage === 'undefined' || 
        typeof window.sessionStorage === 'undefined' ||
        !window.history || 
        !window.FormData) {
        $("body").prepend('<div style="background:#FFF3CD;color:#856404;padding:10px;text-align:center;border:1px solid #FFEEBA;font-size:16px;font-weight:bold;">Your browser may not support all features. Please upgrade to a modern browser for the best experience.</div>');
    }

    // Add responsive design handling
    $(window).on("resize", function() {
        if ($(window).width() < 768) {
            // Mobile view adjustments
            $(".container").css("width", "90%");
            $("input").css("width", "100%");
        } else {
            // Desktop view
            $(".container").css("width", "");
            $("input").css("width", "");
        }
    }).trigger("resize");

    // Add offline/online detection
    $(window).on("online", function() {
        $("#offline-message").fadeOut(500, function() {
            $(this).remove();
        });
    }).on("offline", function() {
        if (!$("#offline-message").length) {
            $("<div id='offline-message' style='position:fixed;bottom:20px;right:20px;background:rgba(0,0,0,0.7);color:white;padding:10px 20px;border-radius:5px;z-index:1000;font-size:16px;font-weight:bold;'>You are currently offline. Some features may not work.</div>")
                .appendTo("body")
                .hide()
                .fadeIn(500);
        }
    });
    
    // Reset normal spacing after form submission
    $("#registrationForm").on("reset", function() {
        $("input").css("margin-bottom", "");
        $(".validation-error").remove();
    });
});