var fileInput  = document.querySelector( ".input-file" ),  
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");
      
button.addEventListener( "keydown", function( event ) {  
    if ( event.keyCode == 13 || event.keyCode == 32 ) {  
        fileInput.focus();  
    }  
});
button.addEventListener( "click", function( event ) {
   fileInput.focus();
   return false;
});  
fileInput.addEventListener( "change", function( event ) {  
    the_return.innerHTML = this.value;  
});

document.getElementById('upload').addEventListener('change', function(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            processImage(img);
        }
    };
    reader.readAsDataURL(file);
});
///////////////////////// Зрение ////////////////////////////////////
function processImage(img) {
    // Инициализация canvas
    let canvas = document.getElementById('canvasOutput');
    let ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Создание матрицы с помощью OpenCV
    let src = cv.imread(canvas);
    let hsv = new cv.Mat();
    cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV);

    // Устанавливаем границы цвета
    let lowerGreen = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [40, 40, 40, 0]);
    let upperGreen = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [80, 255, 255, 255]);
    let mask = new cv.Mat();
    cv.inRange(hsv, lowerGreen, upperGreen, mask);
    // Применяем морфологическое преобразование (замыкание)
    let kernel = cv.Mat.ones(5, 5, cv.CV_8U);
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel);
    // Поиск контуров
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(mask, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    // Фильтрация контуров по параметрам
    let totalArea = 0;
    for (let i = 0; i < contours.size(); ++i) {
        let contour = contours.get(i);
        let area = cv.contourArea(contour);
        if (area > 500) {
            let perimeter = cv.arcLength(contour, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(contour, approx, 0.02 * perimeter, true);
            if (approx.size().height > 5) { // Фильтрация по форме
                cv.drawContours(src, contours, i, [0, 255, 0, 255], 2);
                totalArea += area;
            }
            approx.delete();
        }
    }

    // Вывод результата на canvas
    cv.imshow('canvasOutput', src);
    // alert(`КОЛИЧЕСТВО: ${contours.size()}, ВЕС: ${totalArea}`);
    document.getElementById('result1').innerHTML = `КОЛ-ВО: ${contours.size()}`
    document.getElementById('result2').innerHTML = `ВЕС : ${totalArea}`
    // Очистка памяти
    src.delete();
    hsv.delete();
    mask.delete();
    lowerGreen.delete();
    upperGreen.delete();
    kernel.delete();
    contours.delete();
    hierarchy.delete();
}