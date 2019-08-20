"use strict";

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "api/profile",
    beforeSend: xhr => {
      xhr.setRequestHeader("Authorization", sessionStorage.getItem("token"));
    },
    success: data => {
      if (data.country) $("#country").val(data.country);
      if (data.website) $("#website").val(data.website);
      if (data.languages) $("#lang").val(data.languages);
      if (data.portfolio) $("#portfolio").val(data.portfolio);
      if (data.social.youtube) $("#youtube").val(data.social.youtube);
      if (data.social.linkedin) $("#linkedin").val(data.social.linkedin);
      if (data.social.facebook) $("#facebook").val(data.social.facebook);
      if (data.social.github) $("#github").val(data.social.github);
      $(".card-img-top").attr(
        "src",
        "http://localhost:3000/api/profile/profilepic/show/" + data.profilepic
      );
    }
  });

  $("#save").hide();

  if (sessionStorage.getItem("token") !== null) {
    $("#user").text(sessionStorage.getItem("username"));

    $("#edit").click(() => {
      $(".profileform input").prop("readonly", false);
      $("#edit").hide();
      $("#save").show();
    });

    $("#usrname").hide();
    $(".picform").hide();
    $("#picEdit").click(() => {
      $("#usrname").val(sessionStorage.getItem("username"));
      $(".picform").show();
      $("#picEdit").hide();
    });
  }
});
