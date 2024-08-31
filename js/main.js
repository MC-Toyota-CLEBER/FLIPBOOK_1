// URL del PDF
var pdfUrl = 'pdf/my-document.pdf';

// Configuración de PDF.js
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

// Cargar el PDF
var loadingTask = pdfjsLib.getDocument(pdfUrl);
loadingTask.promise.then(function(pdf) {
    var flipbook = document.getElementById('flipbook');

    // Iterar sobre cada página
    for (var pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then(function(page) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            // Definir dimensiones del viewport
            var viewport = page.getViewport({scale: 1.5});
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Renderizar página en el canvas
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext).promise.then(function() {
                // Crear un div para cada página y agregarlo al flipbook
                var div = document.createElement('div');
                div.appendChild(canvas);
                flipbook.appendChild(div);

                // Inicializar el flipbook después de que todas las páginas se han cargado
                if (flipbook.children.length === pdf.numPages) {
                    $('#flipbook').turn({
                        width: 800,
                        height: 600,
                        autoCenter: true
                    });
                }
            });
        });
    }
});
