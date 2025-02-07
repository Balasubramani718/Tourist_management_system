$(document).ready(function() {

    // Automatically update email field based on username input
    $("#username").on("keyup", function() {
        var username = $(this).val();
        if (username.length > 0) {
            $("#gmail").val(username + "@gmail.com");
        } else {
            $("#gmail").val('');
        }
    });

    // Change the heading color to random on double-click
    $("h1").on("dblclick", function() {
        $(this).css("color", getRandomColor());
    });

    // Function to generate a random color
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Validate if passwords match and change the border color accordingly
    $("#confirmPassword").on("keyup", function() {
        var password = $("#password").val();
        var confirmPassword = $(this).val();
        
        if (password !== confirmPassword) {
            $(this).css("border-color", "red");
        } else {
            $(this).css("border-color", "green");
        }
    });

    // Change border color on focus
    $("input").on("focus", function() {
        $(this).css("border-color", "blue");
    });

    // Change border color back on blur (when focus is lost)
    $("input").on("blur", function() {
        $(this).css("border-color", "");
    });

    // Form submission event handling
    $("#registrationForm").on("submit", function(event) {
        event.preventDefault();  // Prevent the form from submitting immediately

        // Validate the form
        if (validateForm()) {
            alert("Form Submitted Successfully!");
            // Uncomment below to allow form submission
            // this.submit();
        } else {
            alert("Please fill in all fields correctly.");
        }
    });

    // Function to validate the form fields
    function validateForm() {
        var username = $("#username").val();
        var dob = $("#dob").val();
        var email = $("#gmail").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        // Check if any required fields are empty
        if (!username || !dob || !email || !password || !confirmPassword) {
            return false;  // Return false if any field is empty
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return false;  // Return false if passwords do not match
        }

        return true;  // Return true if all fields are valid
    }

});
