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
  
    // Preview gambar
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.hidden = false;
    };
    reader.readAsDataURL(file);
  
    resultDiv.innerHTML = "🔄 Memprediksi...";

    document.getElementById('loading').hidden = false;

  
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('loading').hidden = true;
      if (data.class_name) {
        resultDiv.innerHTML = `
        <div style="padding: 20px; border: 2px solid #28a745; border-radius: 10px; background-color: #f0fff4; color: #155724;">
          <h3>✅ Hasil Prediksi</h3>
          <p style="font-size: 18px; margin-bottom: 5px;">Jenis Penyakit:</p>
          <span style="display: inline-block; padding: 8px 16px; background-color: #28a745; color: white; border-radius: 20px; font-weight: bold; font-size: 16px;">
            🐔 ${data.class_name.replaceAll('_', ' ')}
          </span>
          <p style="margin-top: 15px;">Akurasi: <strong>${Math.round(data.confidence * 100)}%</strong></p>
          <div style="margin-top:10px; height: 20px; width: 100%; background-color: #ddd; border-radius: 10px;">
            <div style="width: ${Math.round(data.confidence * 100)}%; height: 100%; background-color: #28a745; border-radius: 10px;"></div>
          </div>
        </div>
      `;
      

      } else {
        resultDiv.innerHTML = "❌ Gagal memprediksi.";
      }
    })
    
    .catch(error => {
      document.getElementById('loading').hidden = true;
      console.error(error);
      resultDiv.innerHTML = "❌ Terjadi kesalahan saat menghubungi server.";
    });
  }
  

  const history = [];

function updateHistory(label, confidence) {
  history.push({ label, confidence });

  const historyHtml = history.map((h, i) => 
    `<li>${i+1}. ${h.label} - ${Math.round(h.confidence * 100)}%</li>`
  ).join('');

  document.getElementById("historyList").innerHTML = `<ul>${historyHtml}</ul>`;
}
