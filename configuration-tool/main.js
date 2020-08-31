function update_grid_columns() {
  var cols = $("#columns").val();
  $(".htmlgrid").css("grid-template-columns", "repeat(" + cols + ", 1fr)");
  clear_grid()
}

function update_grid_rows() {
  var rows = $("#rows").val();
  $(".htmlgrid").css("grid-template-rows", "repeat(" + rows + ", 1fr)");
  clear_grid()
}

function clear_grid() {
  $(".htmlgrid").empty();
}

function initialize_grid() {
  var rows = $("#rows").val();
  var cols = $("#columns").val();
  update_grid_rows();
  update_grid_columns();
  for (i=0; i < (rows * cols); i++) {
    $('.htmlgrid').append('<div class="button" id="' + i + '"></div>');
  }
}

$(document).ready(function() {
  initialize_grid();
  $("#rows").change(function() {
    update_grid_rows();
    initialize_grid();
  });

  $("#columns").change(function() {
    update_grid_columns();
    initialize_grid();
  });

  $('.button').click(function() {
    $('#configurebutton').modal();
    $.ajax({
      type: 'GET',
      headers: {
        "accept": "application/json",
        "Access-Control-Allow-Origin":"*"
      },
      crossDomain: true,
      url: 'http://localhost:4567/get-action-providers',
      dataType: 'json',
      success: function (data) {
        console.log(data);
        $('#configurebutton > .modal-dialog > .modal-content > .modal-body > #services').append(new Option(data['name'], data['name']));
      }
    });
  });

  $('#actions').change(function() {
    $.ajax({
      type: 'GET',
      headers: {
        "accept": "application/json",
        "Access-Control-Allow-Origin":"*"
      },
      crossDomain: true,
      url: 'http://localhost:8000/get-action-categories',
      dataType: 'json',
      success: function (data) {
        console.log(data);
        $('#configurebutton > .modal-dialog > .modal-content > .modal-body > #services').append(new Option(data['name'], data['name']));
      }
    });
  });
});