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
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
}

function draw(){
    if(gameState == "running" || gameState == "dead"){  
        ctx.clearRect(0,0,canvas.width,canvas.height);

        screenshake();

        for(let i=0;i<numTiles;i++){
            for(let j=0;j<numTiles;j++){
                getTile(i,j).draw();
            }
        }

        for(let i=0;i<monsters.length;i++){
            monsters[i].draw();
        }

        player.draw();

        drawText("Level: "+level, 30, false, 40, "violet");
        drawText("Score: "+score, 30, false, 70, "violet");

        for(let i=0; i<player.spells.length; i++){
            let spellText = (i+1) + ") " + (player.spells[i] || "");                        
            drawText(spellText, 20, false, 110+i*40, "aqua");        
        }
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

    player.update();

    if(player.dead){    
        addScore(score, false);
        gameState = "dead";
    }

    spawnCounter--;
    if(spawnCounter <= 0){  
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";

    drawText("SUPER", 40, true, canvas.height/2 - 110, "white");
    drawText("BROUGH BROS.", 70, true, canvas.height/2 - 50, "white"); 

    drawScores(); 
}

function startGame(){                                           
    level = 1;
    score = 0;
    numSpells = 1;
    startLevel(startingHp);

    gameState = "running";
}

function startLevel(playerHp, playerSpells){  
    spawnRate = 15;              
    spawnCounter = spawnRate;  

    generateLevel();

    player = new Player(randomPassableTile());
    player.hp = playerHp;
    if(playerSpells){
        player.spells = playerSpells;
    } 

    randomPassableTile().replace(Exit); 
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px monospace";
    let textX;
    if(centered){
        textX = (canvas.width-ctx.measureText(text).width)/2;
    }else{
        textX = canvas.width-uiWidth*tileSize+25;
    }

    ctx.fillText(text, textX, textY);
}

function getScores(){
    if(localStorage["scores"]){
        return JSON.parse(localStorage["scores"]);
    }else{
        return [];
    }
}

function addScore(score, won){
    let scores = getScores();
    let scoreObject = {score: score, run: 1, totalScore: score, active: won};
    let lastScore = scores.pop();

    if(lastScore){
        if(lastScore.active){
            scoreObject.run = lastScore.run+1;
            scoreObject.totalScore += lastScore.totalScore;
        }else{
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);

    localStorage["scores"] = JSON.stringify(scores);
}

function drawScores(){
    let scores = getScores();
    if(scores.length){
        drawText(
            rightPad(["RUN","SCORE","TOTAL"]),
            18,
            true,
            canvas.height/2,
            "white"
        );

        let newestScore = scores.pop();
        scores.sort(function(a,b){
            return b.totalScore - a.totalScore;
        });
        scores.unshift(newestScore);

        for(let i=0;i<Math.min(10,scores.length);i++){
            let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
            drawText(
                scoreText,
                18,
                true,
                canvas.height/2 + 24+i*24,
                i == 0 ? "aqua" : "violet"
            );
        }
    }
}

function screenshake(){
    if(shakeAmount){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount);
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}

function initSounds(){          
    sounds = {
        hit1: new Audio('sounds/hit1.wav'),
        hit2: new Audio('sounds/hit2.wav'),
        treasure: new Audio('sounds/treasure.wav'),
        newLevel: new Audio('sounds/newLevel.wav'),
        spell: new Audio('sounds/spell.wav'),
    };
}

function playSound(soundName){                       
    sounds[soundName].currentTime = 0;  
    sounds[soundName].play();
}