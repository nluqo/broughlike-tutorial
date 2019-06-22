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
  if(gameState == "running" || gameState == "dead"){
     ctx.clearRect(0,0,canvas.width,canvas.height);

     for(let i=0;i<numTiles;i++){
         for(let j=0;j<numTiles;j++){
             getTile(i,j).draw();
         }
     }
     

     for(let i=0;i<monsters.length;i++){
         monsters[i].draw();
     }

     player.draw();
   }
}
   
function tick(){
   for(let k=monsters.length-1;k>=0;k--){
       if(!monsters[k].dead){
           monsters[k].update();
       }else{
           monsters.splice(k,1);
       }
   }

   if(player.dead){    
       gameState = "dead";
   }

    spawnCounter-=2;                                                                //ADD
    if(spawnCounter <= 0){                                                      //ADD       
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

function showTitle(){                                          
   ctx.fillStyle = 'rgba(0,0,0,.75)';
   ctx.fillRect(0,0,canvas.width, canvas.height);

   gameState = "title";
}

function startGame(){                                           
   level = 1;
   startLevel(startingHp);

   gameState = "running";
}

function startLevel(playerHp){     
  spawnRate = 22;              
  spawnCounter = spawnRate;      

   generateLevel();

   player = new Player(randomPassableTile());
   player.hp = playerHp;
}