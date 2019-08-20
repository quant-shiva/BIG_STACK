"use strict";

$(document).ready(() => {
  $("#post").click(() => {
    $.ajax({
      type: "POST",
      url: "/api/questions",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", sessionStorage.getItem("token"));
      },
      data: {
        tittle: $("#questiontittle").val(),
        question: $("#questiontext").val(),
        code: $("#questioncode").val()
      },
      dataType: "json",
      success: data => {
        console.log(data);
        console.log(sessionStorage.getItem("token"));
        window.location.href = "/";
      }
    });
  });
});
