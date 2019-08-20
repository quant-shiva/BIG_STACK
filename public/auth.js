"use strict";

$(document).ready(function() {
  //handling login

  $(".loginform").on("submit", function() {
    event.preventDefault();

    var email = $("#email").val();
    var password = $("#password").val();

    if (email && password) {
      $.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        function(data) {
          sessionStorage.setItem("username", data.username);
          console.log(sessionStorage.getItem("username"));
        }
      )
        .fail(function(data) {
          console.log(data);
        })
        .done(function() {
          $("#msg").text("login successful !");
          window.location.href = "/";
        });
    } else {
      if (!email) $("#msg").text("please enter your email !");
      else $("#msg").text("please enter your password !");
    }
    return false;
  });

  //handeling registration

  $(".registerform").on("submit", function() {
    event.preventDefault();
    let username = $("#username").val();
    var name = $("#name").val();
    var email = $("#email0").val();
    var password = $("#password0").val();

    if (email && password && name && username) {
      $.post(
        "http://localhost:3000/api/auth/register",
        {
          username: username,
          name: name,
          email: email,
          password: password
        },
        function(data) {
          console.log(data);
        }
      )
        .fail(function(data) {
          $("#0msg").text("some error occured! please try again.");
          if (data.status == 400) {
            $("#0msg").text("this email already registered !");
          }
          //console.log(data);
        })
        .done(function() {
          $(".loginform").show("slow");
          $(".registerform").hide("slow");
          $("#msg").text("registration successful,please login !");
        });
    } else {
      if (!username) $("#0msg").text("please enter username !");
      else if (!name) $("#0msg").text("please enter your name !");
      else if (!email) $("#0msg").text("please enter your email !");
      else $("#0msg").text("please enter your password !");
    }
    return false;
  });
});
