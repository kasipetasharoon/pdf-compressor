async function compressPDF() {
  const input = document.getElementById("pdfInput");
  const status = document.getElementById("status");
  const link = document.getElementById("downloadLink");

  if (!input.files[0]) {
    alert("Select a PDF first!");
    return;
  }

  status.textContent = "Compressing...";
  link.style.display = "none";

  const formData = new FormData();
  formData.append("file", input.files[0]);

  const res = await fetch("/compress", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    status.textContent = "Compression failed!";
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.style.display = "block";
  status.textContent = "Done!";
}
