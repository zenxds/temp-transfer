;(function () {
  document.querySelector('#file').addEventListener(
    'change',
    function () {
      var data = new FormData()
      data.append('file', this.files[0])

      fetch('/upload?token=' + window.token, {
        method: 'POST',
        body: data,
      })
        .then(function (response) {
          if (response.ok) {
            return response.text()
          }

          throw new Error('上传失败')
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