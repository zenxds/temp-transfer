;(function () {
  document.querySelector('#file').addEventListener(
    'change',
    function () {
      var data = new FormData()
      data.append('file', this.files[0])
      data.append('token', window.token)

      fetch('/upload', {
        method: 'POST',
        body: data,
      })
        .then(function (response) {
          if (response.ok) {
            return response.text()
          }

          return response.text().then(function (text) {
            throw new Error(text || '上传失败')
          })
        })
        .then(function (text) {
          var link = location.protocol + '//' + location.host + '/' + text + '?token=' + window.token
          document.querySelector('.container').innerHTML = '<a href="' + link + '" target="_blank">' + link + '</a>'
        })
        .catch(function (err) {
          alert(err.message)
        })
    },
    false,
  )
})()
