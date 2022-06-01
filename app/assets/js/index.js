;(function () {
  var file = document.querySelector('#file')

  file.addEventListener(
    'change',
    function () {
      var data = new FormData()
      data.append('file', this.files[0])

      fetch('/upload?token=' + window.token, {
        method: 'POST',
        body: data,
      })
        .then(function (response) {
          return response.text()
        })
        .then(function (text) {
          var link = location.protocol + '//' + location.host + '/' + text
          document.querySelector('.container').innerHTML = '<a href="' + link + '" target="_blank">' + link + '</a>'
        })
        .catch(function (err) {
          alert(err.message)
        })
    },
    false,
  )
})()
