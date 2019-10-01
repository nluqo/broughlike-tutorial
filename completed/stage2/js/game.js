function setupCanvas(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = tileSize*(numTiles+uiWidth);
    canvas.height = tileSize*numTiles;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y){
    ctx.drawImage(
        spritesheet,
        sprite*16,
        0,
        16,
        16,
        x*tileSize,
        y*tileSize,
        tileSize,
        tileSize
    );
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<numTiles;i++){
        for(let j=0;j<numTiles;j++){
            getTile(i,j).draw();
        }
    }

    drawSprite(0, x, y);
}