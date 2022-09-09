async function render() {
  const renderContent = document.getElementById("render-content");
  const imageContent = document.getElementById("image-content");
  const canvas = await html2canvas(renderContent, {
    width: imageContent.offsetWidth,
    height: imageContent.offsetHeight,
    scale: 1,
  });
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
  const imageResponse = await fetch(document.getElementById("rendered-image").src);
  const buffer = await imageResponse.arrayBuffer();
  const filename = `${statusCode}.jpeg`;
  const file = new File([buffer], filename, {
    type: "image/jpeg",
  });
  const formData = new FormData();
  formData.append("file", file, filename);
  await fetch(`/api/${statusCode}`, {
    method: "POST",
    body: formData,
  });
  uploadButton.disabled = false;
}

document.getElementById("file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    document.getElementById("inner-image").style.backgroundImage = `url("${reader.result}")`;
  };
  reader.readAsDataURL(file);
});
