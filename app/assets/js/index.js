;(function () {
  document.body.addEventListener(
    'dragover',
    function (e) {
      e.preventDefault()
    },
    false,
  )

  document.body.addEventListener(
    'drop',
    function (e) {
      e.preventDefault()

      uploadFile(e.dataTransfer.files[0])
    },
    false,
  )

  document.querySelector('#file').addEventListener(
    'change',
    function () {
      uploadFile(this.files[0])
    },
    false,
  )

  function uploadFile(file) {
    var data = new FormData()
    data.append('file', file)
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
        var link =
          location.protocol +
          '//' +
          location.host +
          '/' +
          text +
          '?token=' +
          window.token
        document.querySelector('.container').innerHTML =
          '<a href="' + link + '" target="_blank">' + link + '</a>'

        navigator.clipboard.writeText(link)
      })
      .catch(function (err) {
        alert(err.message)
      })
  }
})()
