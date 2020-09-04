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
    $('.htmlgrid').append('<div class="button" id="' + i + '"><p class="button_text center"></p></div>');
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

function hide_or_show_tracks_field() {
  if ($('#providers').find('option:selected').text() == 'Reaper') {
    $('.track').show();
  } else {
    $('.track').hide();
  }
}

function reset_modal() {
  $('#actions').find('option').remove().end();
  $('#providers').find('option').remove().end();
  $('#tracks').find('option').remove().end();
  $('#buttontext').val('');
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
      $.each(data, function(key,value) {
        if (key == 'actions') {
          $.each(data['actions'], function(key, value) {
            console.log(value);
            $('#configurebutton > .modal-dialog > .modal-content > .modal-body > #actions').append(new Option(value['readable_name'], value['function_name']));
          });
        }

        if (key == 'tracks') {
          $.each(data['tracks'], function(key, value){
            console.log(value);
            $('#configurebutton > .modal-dialog > .modal-content > .modal-body > #track').append(new Option(value['track_name'], value['track_number']));
          }); 
        }
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

  $("#configurebutton").on('hide.bs.modal', function(event) {
    var button_id = $('#buttonId').val();
    $('#' + button_id + ' > p').text($('#buttontext').val());
    reset_modal();
  });

  $('.button').click(function() {
    pull_providers();
    pull_actions($('#providers').find('option:selected').text());
    hide_or_show_tracks_field();
    $('#buttonId').val($(this).attr('id'));
    $('#configurebutton').modal();
  });

  $('#providers').change(function() {
    pull_actions($('#providers').find('option:selected').text());
    hide_or_show_tracks_field();
  });
});