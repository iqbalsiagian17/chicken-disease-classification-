const history = [];

function predictImage() {
  const input = document.getElementById('imageInput');
  const resultDiv = document.getElementById('result');
  const previewImage = document.getElementById('previewImage');

  if (input.files.length === 0) {
    resultDiv.innerHTML = "⚠️ Silakan pilih gambar terlebih dahulu.";
    return;
  }

  const file = input.files[0];
  const formData = new FormData();
  formData.append('image', file);

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.hidden = false;

    document.getElementById('loading').hidden = false;
    resultDiv.innerHTML = "🔄 Memprediksi...";

    fetch('https://chicken-disease-classification-production.up.railway.app/predict', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('loading').hidden = true;
      if (data.class_name) {
        resultDiv.innerHTML = `
          <div class="p-3 border border-success rounded bg-light text-success">
            <h5 class="fw-bold">✅ Hasil Prediksi</h5>
            <p>Jenis Penyakit: <span class="badge bg-success">${data.class_name.replaceAll('_', ' ')}</span></p>
            <p>Akurasi: <strong>${Math.round(data.confidence * 100)}%</strong></p>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar bg-success" role="progressbar" style="width: ${Math.round(data.confidence * 100)}%;" aria-valuenow="${Math.round(data.confidence * 100)}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        `;

        updateHistory(data.class_name.replaceAll('_', ' '), data.confidence, e.target.result);

      } else {
        resultDiv.innerHTML = "❌ Gagal memprediksi.";
      }
    })
    .catch(error => {
      document.getElementById('loading').hidden = true;
      console.error(error);
      resultDiv.innerHTML = "❌ Terjadi kesalahan saat menghubungi server.";
    });
  };

  reader.readAsDataURL(file);
}

function updateHistory(label, confidence, imageUrl) {
  history.push({ label, confidence, imageUrl });

  const historyHtml = history.map((h, i) => `
    <div class="card shadow-sm mb-4 border-0">
      <div class="row g-0">
        <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
          <img src="${h.imageUrl}" class="img-fluid rounded shadow-sm border" alt="Gambar Prediksi ${i+1}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title mb-2">📝 Prediksi ke-${i + 1}</h5>
            <p class="card-text mb-1"><strong>Jenis Penyakit:</strong> <span class="badge bg-success">${h.label}</span></p>
            <p class="card-text mb-2"><strong>Akurasi:</strong> ${Math.round(h.confidence * 100)}%</p>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar bg-success" role="progressbar" style="width: ${Math.round(h.confidence * 100)}%;" aria-valuenow="${Math.round(h.confidence * 100)}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById("historyList").innerHTML = historyHtml;
}
