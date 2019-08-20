$(document).ready(function() {
  if (sessionStorage.getItem("username") === null) {
    $("#logout").hide();
    $("login").show();
    //$("#user").hide();
  } else {
    $("#login").hide();
    $("#logout").show();
    $("#user").text(sessionStorage.getItem("username"));
  }
  $.get("api/questions", function(data) {
    let l;
    l = data.length;
    for (let i = 1; i <= l; i++) {
      let que = "#q" + i + " a";
      let usr = "#q" + i + " h4 a";
      let question = data[i - 1].tittle;
      let userid = data[i - 1].askby;
      let quesid = data[i - 1]._id;
      $.get("api/profile/userid/" + userid, function(profile) {
        let username = profile.username;
        $(usr).text(username);
        $(usr).attr("href", "api/profile/" + username);
      });
      $(que).text(question);
      $(que).attr("id", quesid);
      $(que).attr("href", "api/questions/find/" + quesid);
    }
  });

  $("#logout a").click(() => {
    sessionStorage.removeItem("username");
  });
});
