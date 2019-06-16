class Monster{
	constructor(tile, sprite, hp){
       this.move(tile);
       this.sprite = sprite;
       this.hp = hp;
	}

    update(){
      if(this.stunned){
               this.stunned = false;
               return;
           }
           this.doStuff();
       }
   
       doStuff(){
          let neighbors = this.tile.getAdjacentPassableNeighbors();
          
          neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);
   
          if(neighbors.length){
              neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
              let newTile = neighbors[0];
              this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
          }
      }

	draw(){
       drawSprite(this.sprite, this.tile.x, this.tile.y);
      this.drawHp();
	}

  drawHp(){
       for(let i=0; i<this.hp; i++){
           drawSprite(
               9,
               this.tile.x + (i%3)*(5/16),
               this.tile.y - Math.floor(i/3)*(5/16)
           );
       }
   }    

   tryMove(dx, dy){
       let newTile = this.tile.getNeighbor(dx,dy);
       if(newTile.passable){
           if(!newTile.monster){
               this.move(newTile);
           }else{
               if(this.isPlayer != newTile.monster.isPlayer){
                  this.attackedThisTurn = true;
                  newTile.monster.stunned = true;
                   newTile.monster.hit(1);
               }
           }
           return true;
       }
   }

   hit(damage){
       this.hp -= damage;
       if(this.hp <= 0){
           this.die();
       }
   }

   die(){
       this.dead = true;
       this.tile.monster = null;
       this.sprite = 1;
   }

   move(tile){
       if(this.tile){
           this.tile.monster = null;
       }
       this.tile = tile;
       tile.monster = this;
   }

}



class Player extends Monster{
   constructor(tile){
       super(tile, 0, 3);
       this.isPlayer = true;
   }
   
  tryMove(dx, dy){
     if(super.tryMove(dx,dy)){
         tick();
     }
  }
}

class Bird extends Monster{
     constructor(tile){
         super(tile, 4, 3);
     }
 }
 
class Snake extends Monster{
   constructor(tile){
       super(tile, 5, 1);
   }

   doStuff(){
       this.attackedThisTurn = false;
       super.doStuff();

       if(!this.attackedThisTurn){
           super.doStuff();
       }
   }
}

class Tank extends Monster{
   constructor(tile){
       super(tile, 6, 2);
   }
   
   update(){
       let startedStunned = this.stunned;
       super.update();
       if(!startedStunned){
           this.stunned = true;
       }
   }
}

class Eater extends Monster{
   constructor(tile){
       super(tile, 7, 1);
   }
}

class Jester extends Monster{
   constructor(tile){
       super(tile, 8, 2);
   }
}