$("#fileinput").hide();
$("#save").hide();
$("#edit").click(() => {
  $("#save").show();
  $("#edit").hide();
  $("input").prop("readonly", false);
});

// $("#save").click(() => {
//   $.ajax({
//     type: "POST",
//     url: "/api/profile",
//     beforeSend: xhr => {
//       xhr.setRequestHeader("Authorization", sessionStorage.getItem("token"));
//     },
//     data: {
//       username: sessionStorage.getItem("username"),
//       country: $("#country").val(),
//       website: $("#website").val(),
//       languages: $("#lang").val(),
//       portfolio: $("#portfolio").val(),
//       youtube: $("#youtube").val(),
//       facebook: $("#facebook").val(),
//       linkedin: $("#linkedin").val(),
//       github: $("#github").val()
//     },
//     dataType: "json"
//   });
//   window.location.href = "/profile.html";
// });
