async function render() {
  const renderContent = document.getElementById("render-content");
  const canvas = await html2canvas(renderContent);
  const renderedImage = document.getElementById("rendered-image");
  renderedImage.src = canvas.toDataURL("image/jpeg");
}

async function upload() {
  const statusCode = parseInt(document.getElementById("status-code").innerText);
  if (!statusCode) {
    return;
  }
  const uploadButton = document.getElementById("upload-button");
  uploadButton.disabled = true;
  await render();
  fetch(document.getElementById("rendered-image").src)
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((buf) => {
      const filename = `${statusCode}.jpeg`;
      const file = new File([buf], filename, {
        type: "image/jpeg",
      });
      const formData = new FormData();
      formData.append("file", file, filename);
      fetch(`/api/${statusCode}`, {
        method: "POST",
        body: formData,
      }).then(() => {
        uploadButton.disabled = false;
      });
    });
}

const fileInput = document.getElementById("file");
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    document.getElementById("inner-image").src = reader.result;
  };
  reader.readAsDataURL(file);
});
