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

function pull_providers() {
  $.ajax({
    type: 'GET',
    async: false,
    headers: {
      "accept": "application/json",
      "Access-Control-Allow-Origin":"*"
    },
    crossDomain: true,
    url: 'http://localhost:4567/get-action-providers',
    dataType: 'json',
    success: function (data) {
      $.each(data, function(key,value) {
        $('#configurebutton > .modal-dialog > .modal-content > .modal-body > #providers').append(new Option(value['provider_name'], value['provider_name']));
      }); 
    }
  });
}

function pull_actions(provider='null') {
  $.ajax({
    type: 'GET',
    async: false,
    headers: {
      "accept": "application/json",
      "Access-Control-Allow-Origin":"*"
    },
    crossDomain: true,
    url: 'http://localhost:4567/' + provider + '/actions',
    dataType: 'json',
    success: function (data) {
      console.log(data);
      $.each(data, function(key,value) {
        $('#configurebutton > .modal-dialog > .modal-content > .modal-body > #actions').append(new Option(value['readable_name'], value['function_name']));
      });
    }
  });
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
    $('#actions').find('option').remove().end();
    $('#providers').find('option').remove().end();
    pull_providers();
    pull_actions($('#providers').find('option:selected').text());
    $('#configurebutton').modal();
  });

  $('#providers').change(function() {
    $('#actions').find('option').remove().end();
    pull_actions($('#providers').find('option:selected').text());
  });
});