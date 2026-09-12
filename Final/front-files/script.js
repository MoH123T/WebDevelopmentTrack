// Determine base API URL (handles both Live Server and Laragon Apache)
var baseUrl = window.location.origin.includes(':5500')
  ? 'https://localhost/myappfirst/Final'
  : window.location.origin.startsWith('http')
    ? window.location.origin + '/myappfirst/Final'
    : 'https://localhost/myappfirst/Final';

var api = baseUrl + '/employee/allemployees.php';

$('#view-employees').on('click', function () {
  var button = $(this);
  $.ajax({
    url: api,
    method: 'GET',
    cache: false,
    dataType: 'json',
  })
    .always(function () {
      $(button).html('Load Employees Data...');
    })
    .done(function (evt) {
      // Disable button
      $(button).prop('disabled', true);
      // Set timeout for lazy loading
      setTimeout(function () {
        var result = typeof evt === 'string' ? JSON.parse(evt) : evt;

        var html = '<h2>Data Employees</h2>';
        html += '<div class="tables-employees-content">';
        console.log(result);
        if (result && Array.isArray(result)) {
          html +=
            '<table class="table">' +
            '<thead>' +
            '<tr>' +
            '<th scope="col">Nama</th>' +
            '<th scope="col">Dep</th>' +
            '<th scope="col">Exp</th>' +
            '<th scope="col">Salary</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';

          for (var i = 0; i < result.length; i++) {
            html +=
              '<tr>' +
              '<td scope="row">' +
              (result[i].name || '') +
              '</td>' +
              '<td>' +
              (result[i].position || '') +
              '</td>' +
              '<td>' +
              (result[i].experience || '') +
              '</td>' +
              '<td>' +
              (result[i].salary || '') +
              '</td>' +
              '</tr>';
          }
          html += '</tbody></table>';
        }

        html += '</div>';

        // Set all content
        $('.table-employees').html(html);
      }, 1000);
    })
    .fail(function (xhr, status, error) {
      console.error('API Error:', status, error, xhr.responseText);
      alert('Error : Failed to reach API Url or check your connection');
      $(button).prop('disabled', false);
      $(button).html('View Employees');
    })
    .then(function (evt) {
      setTimeout(function () {
        $(button).css({ 'background-color': '#ccc' }).hide();
      }, 1000);
    });
});

$('#create-new').on('click', function (e) {
  e.preventDefault();
  let sampleForm = document.getElementById('sample-form');
  // Get the entire form fields
  let formFields = new FormData(sampleForm);

  var settings = {
    url: baseUrl + '/employee/create.php',
    method: 'POST',
    timeout: 0,
    processData: false,
    contentType: false,
    data: formFields,
  };

  $.ajax(settings)
    .done(function (response) {
      console.log(response);

      if (typeof swal === 'function') {
        swal(
          {
            title: 'Sweet!',
            text: 'created.',
            imageUrl: 'https://i.imgur.com/4NZ6uLY.jpg',
          },
          function () {
            window.location.href = 'index.html';
          },
        );
      } else {
        alert('Created successfully!');
        window.location.href = 'index.html';
      }
    })
    .fail(function (xhr, status, error) {
      console.error('Create error:', status, error, xhr.responseText);
      alert('Failed to create employee. Check console for details.');
    });
});
