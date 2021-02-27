// Global Variables
var ctx;
var fps = 100;
var canvas_width=1200;
var canvas_height=600;
const office_h=198;
const office_w=111;
const tower_h=126;
const tower_w=57;
const cloud_w=152;
const cloud_h=112;
const bolt_w=32;
const bolt_h=67;
const human_w=34;
const human_h=85;
const fire_w=140;
const fire_h=128
const newBussBar_w=80;
const newBussBar_h=95;
const oldbussbar_w=172;
const oldbussbar_h=37;
const maxNoCloud=4;


let score = 0;
let counter=0;

let newbtn = document.getElementById('new');
let oldbtn = document.getElementById('old');
let yesbtn =document.getElementById('yes')
let btnbox1 = document.querySelector('#choice-btn')
let btnbox2 = document.querySelector('#choice-btn2')
let newBussBarAction=false;

let boltsFromOldbar=false;

let m=0
let cnt=0

let bolts=[];
let clouds=[];
let missiles=[]
let moveLeft=true;
let moveRight=false;
let ligtening=false;
let mousePos;
let allTowersDamaged=false;
let buildingOnfire=false
let startScreen=true;
let showEndScreen=false;
let SHOOT=false;
let damagedTowerNo=0;

//keyboard constants
const SPACEBAR=32
const LEFTARROW=37
const RIGHTARROW=39
const UPARROW=38
const DOWNARROW=40

//start Game function
function startGame(){
    gameArea.start()

    background = new imageBuilder(0,0,canvas_width,canvas_height,'assets/bg.jpg')
    background2 = new imageBuilder(0,0,canvas_width,canvas_height,'assets/bg2.png')
    office = new imageBuilder(canvas_width-office_w-15,canvas_height-office_h,office_w,office_h,'assets/office.png','office');
    tower1 = new imageBuilder(849,canvas_height-tower_h,tower_w,tower_h,'assets/tower.png','tower')
    tower2 = new imageBuilder(590,canvas_height-tower_h,tower_w,tower_h,'assets/tower.png','tower')
    tower3 = new imageBuilder(327,canvas_height-tower_h,tower_w,tower_h,'assets/tower.png','tower')
    tower4 = new imageBuilder(30,canvas_height-tower_h,tower_w,tower_h,'assets/tower.png','tower')
    tower5 = new imageBuilder(100,canvas_height-tower_h,tower_w,tower_h,'assets/tower.png','tower')
    
    clouds.push(new imageBuilder(canvas_width,20,cloud_w,cloud_h,'assets/cloud.png','cloud'));
    human1 = new SPRITEIMAGE(0,0,754,988,2,tower1.x+tower1.width,canvas_height-human_h,human_w,human_h,'assets/human1sprite.png','human1',false);
    human2 = new SPRITEIMAGE(0,0,1064,1464,2,tower1.x-human_w,canvas_height-human_h,human_w,human_h,'assets/human2sprite.png','human2',false)
    human3 = new SPRITEIMAGE(0,0,676,1053,2,tower3.x+human_w+tower3.width,canvas_height-human_h,human_w,human_h,'assets/human3sprite.png','human3',false)
    human4 = new SPRITEIMAGE(0,0,688,933,2,tower3.x-human_w,canvas_height-human_h,human_w,human_h,'assets/human4sprite.png','human4',false)
    exclamation = new imageBuilder(0,0,60,70,'assets/exclamation.png')
    low_signal = new imageBuilder(0,0,126,80,'assets/lowSignal.png')
    fire =  new SPRITEIMAGE(0,0,327,111,3,office.x-5,office.y-fire_h+50,fire_w,fire_h,'assets/fireSprite.png')
    text = new imageBuilder(office.x+15,office.y-60,70,50,'assets/yourOFFice.png')
    newbussbar = new SPRITEIMAGE(0,0,372,227,2,canvas_width/2-newBussBar_w/2,canvas_height/2-newBussBar_h/2,newBussBar_w,newBussBar_h,'assets/bussbarNewSprite.png');
    oldbussbar = new imageBuilder(canvas_width/2-oldbussbar_w/2,canvas_height/2-oldbussbar_h/2,oldbussbar_w,oldbussbar_h,'assets/bussbarOld.png');

    newbarselect = new imageBuilder(300,191,192,241,'assets/bussbarNew.png')
    oldbarselect = new imageBuilder(684,267,339,78,'assets/bussbarOld.png')
    textimg = new imageBuilder(0,0,canvas_width,canvas_height,'assets/textimg.png');

    yes = new imageBuilder(447,344,95,50,'assets/yes.png');
    no = new imageBuilder(627,344,95,50,'assets/no.png');
  


    window.onkeydown=keyDownHandler;
    window.onkeyup=keyUpHandler;

    newbtn.addEventListener('click',()=>{
        startScreen=false;
        newBussBarAction=true;
       reset()
       newbtn.style.display='none'
       oldbtn.style.display='none'
    })
    oldbtn.addEventListener('click',()=>{
        startScreen=false;
        newBussBarAction=false;
       reset()
       oldbtn.style.display='none'
       newbtn.style.display='none'
    })
    yesbtn.addEventListener('click',()=>{
        yesbtn.style.display='none'
        oldbtn.style.display='block'
       newbtn.style.display='block'
        startScreen=true;
        showEndScreen=false
    })

}


//myGame Area Object
var gameArea = {
    canvas:document.getElementById('gameCanvas'),
   

    start:function(){
        
        this.canvas.width=canvas_width;
        this.canvas.height=canvas_height;

        this.canvas.addEventListener('mousemove',function(evt){ //............Using the calculated mouse position
          mousePos = calculateMousePos(evt);
         // console.log(mousePos.x,mousePos.y)
         if(mousePos.x>=newbarselect.x&&mousePos.y>=newbarselect.y&&mousePos.x<=newbarselect.x+newbarselect.width&&mousePos.y<=newbarselect.y+newbarselect.height){
            newbarselect.image.src='assets/bussbarNewH.png'
             
         }else{
            newbarselect.image.src='assets/bussbarNew.png'
         }
         if(mousePos.x>=oldbarselect.x&&mousePos.y>=oldbarselect.y&&mousePos.x<=oldbarselect.x+oldbarselect.width&&mousePos.y<=oldbarselect.y+oldbarselect.height){
            oldbarselect.image.src='assets/bussbarOldH.png'
         }else{
            oldbarselect.image.src='assets/bussbarOld.png'
         }
    
        });

      
        this.canvas.addEventListener('click',(e)=>{
            mousePos = calculateMousePos(e);
            if(startScreen)//only works on the startScreen
            {
                if(mousePos.x>=newbarselect.x&&mousePos.y>=newbarselect.y&&mousePos.x<=newbarselect.x+newbarselect.width&&mousePos.y<=newbarselect.y+newbarselect.height){
                    // console.log('ok')
                     startScreen=false;
                     newBussBarAction=true;
                     reset()
                 }
                 if(mousePos.x>=oldbarselect.x&&mousePos.y>=oldbarselect.y&&mousePos.x<=oldbarselect.x+oldbarselect.width&&mousePos.y<=oldbarselect.y+oldbarselect.height){
                    // console.log('ok2')
                     startScreen=false
                     newBussBarAction=false;
                     reset()
                 }
            }
            if(showEndScreen)
            {
                if(mousePos.x>=yes.x&&mousePos.y>=yes.y&&mousePos.x<=yes.x+yes.width&&mousePos.y<=yes.y+yes.height){
                    // console.log('ok')
                     startScreen=true;
                     showEndScreen=false
                 }
                 if(mousePos.x>=no.x&&mousePos.y>=no.y&&mousePos.x<=no.x+no.width&&mousePos.y<=no.y+no.height){
                    // console.log('ok')
                     startScreen=true;
                     showEndScreen=false;
                 }
            }
            
        })
        // this.canvas.addEventListener('touchstart',()=>{
        //     mouseClick()
        // })

        this.context=this.canvas.getContext("2d");
        this.frameNo=0;
        this.interval=setInterval(function(){
            drawEverything();
        },1000/fps);
       // document.body.addEventListener("touchstart",moveup);
       // document.body.addEventListener("touchend",motion);
    },
    sound:function(src) {//.......................................created audio constructor function here !!!..........
          this.sound = document.createElement("audio");
          this.sound.src = src;
          this.sound.setAttribute("preload", "auto");
          this.sound.setAttribute("controls", "none");
          this.sound.style.display = "none";
          this.sound.volume=0.1;
          document.body.appendChild(this.sound);
          this.play = function(){
            this.sound.play();
          }
          this.stop = function(){
            this.sound.pause();
          }
      },

    clear:function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop:function(){
        clearInterval(this.interval);
    }
}





//drawEverything function
function drawEverything()
{
   if(startScreen)
   { 
       gameArea.clear()
      
       background2.draw()
       newbarselect.draw()
       oldbarselect.draw()
       textimg.draw()
	   yesbtn.style.display='none'
	    newbtn.style.display='block'
       oldbtn.style.display='block'

       return
   }
   if(showEndScreen)
   {
       gameArea.clear()

       background2.draw()
       let msg1 = new TEXT(504,161,'Your Score : '+score)
       let msg2 =new TEXT(435,218,"Do You Want To Play Again?")
       msg1.draw()
       msg2.draw()
       yes.draw()
       no.draw()
       yesbtn.style.display='block'
	    newbtn.style.display='none'
       oldbtn.style.display='none'
       return;
   }

   gameArea.frameNo++;
   gameArea.clear()
   background.draw()
   scoredraw()
   

  
   
if(newBussBarAction){
         oldbussbar.x=0;
         oldbussbar.y=-100;
       
        newbussbar.MovementControl()
        newbussbar.staticdraw()
   
   
  
   //newbuss bar shooting control
   if(SHOOT){
    if(everyinterval(18)){
        missiles.push(new imageBuilder(newbussbar.x+newBussBar_w/2-4,newbussbar.y-30,8,30,'assets/missile.png'))
    }
     
   }
   missiles.forEach(missile=>{
       missile.draw()
       missile.upward()
   })

   missiles.forEach((missile,i,arr1)=>//shooting bolts with newbussbar
   {
      bolts.forEach((bolt,j,arr2)=>
       {
           if(missile.crashWith(bolt))
           {
               arr1.splice(i,1);
               arr2.splice(j,1);
               score+=10;
           }
       })
       clouds.forEach((cloud,k,arr3)=>{
           if(missile.crashWith(cloud))
           {   
               arr1.splice(i,1)
               cloud.hitPoint--;
             //  console.log(cloud.hitPoint)
               if(cloud.hitPoint<=0){
                arr3.splice(k,1);
                score+=30;
               }
               
           }
       })
   })
   //console.log(missiles.length)
   missiles.forEach((missile,i,arr)=>{
       if(missile.y<0){
             arr.splice(i,1);
       }
   })
}
  
 
   office.draw()
   text.draw()
   if(buildingOnfire)fire.draw()
   tower1.draw()
   tower2.draw()
   tower3.draw()
   tower4.draw()
   tower5.draw()

   if(clouds.length<maxNoCloud){
    if(everyinterval(1000))///arrival of new clouds 1000=10 secs
    {
        clouds.push(new imageBuilder(canvas_width,20,cloud_w,cloud_h,'assets/cloud.png','cloud'))
    }
   }
 
 
  
   if(everyinterval(getRndInteger(80,190))){//lightening control
       
       clouds.forEach(cloud=>{
           cloud.random=getRndInteger(0,3)
           if(cloud.random==0){
            bolts.push(new imageBuilder(cloud.x+cloud.width/2-26,cloud.y+cloud.height/2,bolt_w,bolt_h,'assets/boltL.png','boltL'))
           }
           if(cloud.random==1){
            bolts.push(new imageBuilder(cloud.x+cloud.width/2-26,cloud.y+cloud.height/2,bolt_w,bolt_h,'assets/boltR.png','boltR'))
           }
           if(cloud.random==2){
            bolts.push(new imageBuilder(cloud.x+cloud.width/2-26,cloud.y+cloud.height/2,bolt_w,bolt_h,'assets/bolt.png','boltS'))
           }
        
       })
     
      
   }

  // console.log(bolts.length)
   bolts.forEach((bolt,i,arr)=>//deleteing bots if they go out of the screen and when in contact with the buss bar
   {
       if(bolt.y>=canvas_height||bolt.crashWith(newbussbar))
       {
           arr.splice(i,1);
           
       }
       if(bolt.crashWith(newbussbar))
       {
           score+=10;
       }

       if(bolt.crashWith(oldbussbar))
       {
           
          
           if(m==0){
               if(bolt.type='boltL'){
                bolts.push(new imageBuilder(oldbussbar.x+oldbussbar.width/2-26,oldbussbar.y+oldbussbar.height/2,bolt_w,bolt_h,'assets/boltR.png','boltR'))
               }
             else{
                bolts.push(new imageBuilder(oldbussbar.x+oldbussbar.width/2-26,oldbussbar.y+oldbussbar.height/2,bolt_w,bolt_h,'assets/boltR.png','boltL'))
              }
            
           }
         m++
           //arr.splice(i,1)
           
       }
    
   })

   if(m>0){
       cnt++
       if(cnt>40){
           m=0;
           cnt=0
       }
   }

   bolts.forEach((bolt,i,arr)=>{//bolt interaction control
       bolt.y+=2;
       if(bolt.type=='boltL'){
           bolt.x-=1.5;
        
       }
       if(bolt.type=='boltR'){
           bolt.x+=1.5;
       }
       
       bolt.draw()

       if(bolt.crashWith(tower1)){
           tower1.damaged=true;
           damagedTowerNo=1;
        
            arr.splice(i,1);
            
          
       }
       if(bolt.crashWith(tower2)){
        tower2.damaged=true;
        damagedTowerNo=2
        arr.splice(i,1);
        
       
       }
       if(bolt.crashWith(tower3)){
        tower3.damaged=true;
        damagedTowerNo=3
        arr.splice(i,1);
        
        
       }
       if(bolt.crashWith(tower4)){
        tower4.damaged=true;
        damagedTowerNo=4
        arr.splice(i,1);
        
       
       }
       if(bolt.crashWith(tower5)){
        tower5.damaged=true;
        damagedTowerNo=5
        arr.splice(i,1);
        
       
       }
   })


   if(!newBussBarAction)
   {
       newbussbar.x=0;
       newbussbar.y=-100;

       oldbussbar.draw()
       oldbussbar.MovementControl()
   }

   


 //Drawing all the humans
  human1.staticdraw()
  human2.staticdraw()
  human3.staticdraw()
  human4.staticdraw()

if(!allTowersDamaged)//people movement control
{ 
    human1.movement(tower1.x+tower1.width,office.x)
    human2.movement(tower2.x+tower2.width+human_w,tower1.x-human_w)
    human3.movement(tower3.x+human_w+tower3.width,tower2.x-human_w)
    human4.movement(tower4.x+tower4.width+human_w,tower3.x-human_w)
   
}
if(buildingOnfire)//countdown to end the game  and pull up endscreen!
{
    counter++
    if(counter>=250)
    {
        showEndScreen=true;
        gameArea.frameNo=0;
        score=0
        
    }
}


if(tower1.damaged||tower2.damaged||tower3.damaged||tower4.damaged||tower5.damaged)//damaged towers and people reaction control
{

    if(tower1.damaged){
     
        peopleReacts(human1,1)
        human1.timer++;
        if(human1.timer>=500){
           // console.log('change image')
          peopleReactsWFire(human1,'assets/human1_w_t_sprite.png')
        }
        //peopleReacts(human2,0)
    }
    if(tower2.damaged){
      
        peopleReacts(human2,0)
        human2.timer++;
        if(human2.timer>=500){
           // console.log('change image')
         peopleReactsWFire(human2,'assets/human2_w_t_sprite.png')
        }
       // peopleReacts(human3,1)
    }
    if(tower3.damaged){
      
        peopleReacts(human3,1)
        human3.timer++;
        if(human3.timer>=500){

           peopleReactsWFire(human3,'assets/human3_w_t_sprite.png')
        }
       // peopleReacts(human4,0)
    }
    if(tower4.damaged)
    {
      
        human4.timer++;
        if(human4.timer>=500){
           peopleReactsWFire(human4,'assets/human4_w_t_sprite.png')
        }
        peopleReacts(human4,0)
    }
    if(tower5.damaged)
    {
      
        human4.timer++;
        if(human4.timer>=500){
           peopleReactsWFire(human4,'assets/human4_w_t_sprite.png')
        }
        peopleReacts(human4,0)
    }

}
if(tower1.damaged&&tower2.damaged&&tower3.damaged&&tower4.damaged&&tower5.damaged)//after all towers are damaged
{
   // console.log('all towers damaged!')
    allTowersDamaged=true;
    
    human1.moveTowardsOffice(0)
    human2.moveTowardsOffice(20)
    human3.moveTowardsOffice(30)
    human4.moveTowardsOffice(40)

    if(human1.fireup==true&&human2.fireup==true&&human3.fireup==true&&human4.fireup==true){
      buildingOnfire=true
    }
}
 
  
   clouds.forEach(cloud=>{//clouds draw and move control
       cloud.draw()
       cloud.move()
   })
  

   

}




//constructor functions
class imageBuilder{
    constructor(x,y,width,height,color,type)
    {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.image = new Image();
        this.image.src = color;  
        this.type=type; 
        this.damaged=false;
        this.MOVELEFt=false;
        this.random=0
        this.hitPoint=30;

        this.pushUp=false;
        this.pushDown=false;
        this.pushLeft=false;
        this.pushRight=false;
       
    }
   
    draw()
    {   
        ctx=gameArea.context;
        if(!this.damaged){
            ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
        }else{
            this.image.src='assets/damagedTower.png'
            ctx.drawImage(this.image,this.x, this.y+50, this.width+15, this.height-50);
        }
      
    }
   
    move()
    {
        if(this.MOVELEFt){
            this.x-=1.5;
            if(this.x<0)this.MOVELEFt=false;
        }else{
            this.x+=1.5;
            if(this.x+this.width>canvas_width)this.MOVELEFt=true;
        }  
    }
    MovementControl(){//Oldbussbar movement control
        if(this.pushDown){
            this.y+=2;
            if(this.y+this.height>canvas_height)
            {
                this.y=canvas_height-this.height
            }
        }
        if(this.pushUp){
            this.y-=2;
            if(this.y<0)
            {
                this.y=0
            }
        }
        if(this.pushRight){
            this.x+=2;
            if(this.x+this.width>canvas_width)
            {
                this.x=canvas_width-this.width
            }
        }
        if(this.pushLeft){
            this.x-=2;
            if(this.x<0){
                this.x=0
            }
        }
    }
    upward()
    {
        this.y-=4;
    }
    crashWith(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
 
}

class SPRITEIMAGE{
    constructor(srcX,srcY,spritewidth,spriteheight,col,x,y,width,height,src,type,bool){
        this.srcX=srcX;
        this.srcY=srcY;
        this.swidth=spritewidth/col;
        this.sheight = spriteheight;
        this.x=x;
        this.y=y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = src;
        this.type = type;
        this.moveleft=bool;

        this.pushUp=false;
        this.pushDown=false;
        this.pushLeft=false;
        this.pushRight=false;
    
        this.curFrame = 0;
        this.frameCount = col;

        this.timer=0;
        this.fireup=false;
      
    }
    draw(){
     this.updateFrame()
       ctx=gameArea.context;
       ctx.drawImage(this.image,this.srcX,this.srcY,this.swidth,this.sheight,this.x,this.y,this.width,this.height)
      
    }
    staticdraw(){
       ctx=gameArea.context;
       ctx.drawImage(this.image,this.srcX,this.srcY,this.swidth,this.sheight,this.x,this.y,this.width,this.height)
    }
        
    updateFrame(){
        if(this.curFrame>=this.frameCount){
            this.curFrame=0;     
        }
        this.srcX = this.curFrame*this.swidth;
        this.curFrame++;
    }

    changeFrame(n){
        this.curFrame=n;
        this.srcX = this.curFrame*this.swidth;
       
    }
    movement(limitL,limitR)
    {
       if(this.moveleft){
           this.x-=0.6
           if(this.x<limitL){
               this.changeFrame(0)
               this.moveleft=false;}
       }
       else{
           this.x+=0.6
           if(this.x+this.width>limitR)
           {   this.changeFrame(1)
               this.moveleft=true;}
       }
    }
    moveTowardsOffice(n)
    {
        this.x+=0.9;
        this.changeFrame(0)
        this.timer=500
        if(this.x+this.width+n>=office.x){
            this.x=office.x-this.width-n;
            return this.fireup=true;
        }
    }
   MovementControl(){//newbussbar movement control
       if(this.pushDown){
           this.y+=4.5;
           if(this.y+this.height>canvas_height)
           {
               this.y=canvas_height-this.height
           }
       }
       if(this.pushUp){
           this.y-=4.5;
           if(this.y<0)
           {
               this.y=0
           }
       }
       if(this.pushRight){
           this.x+=4.5;
           if(this.x+this.width>canvas_width)
           {
               this.x=canvas_width-this.width
           }
       }
       if(this.pushLeft){
           this.x-=4.5;
           if(this.x<0){
               this.x=0
           }
       }
   }
    Rotate(n){

        this.changeFrame(n);
    }
 }




//other necessary fucntioons

function everyinterval(n) {
    return ((gameArea.frameNo / n) % 1 == 0) ?  true : false;
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
function peopleReacts(humanNo,y){
   
    if(y==1){
       exclamation.x=humanNo.x;
       exclamation.y=humanNo.y-exclamation.height;
       exclamation.draw()
    }
    if(y==0){
       low_signal.x=humanNo.x-10;
       low_signal.y=humanNo.y-low_signal.height;
       low_signal.draw()
    }  
}

function peopleReactsWFire(human,src)
{
    human.image.src=src
    if(human.moveleft){
      human.changeFrame(1)
    }else{
     human.changeFrame(0) 
    }
    
    human.swidth=566;
    human.sheight=934;
    human.width=human_w+25;
    human.height=human_h+10;
    human.y=canvas_height-human.height
   
 
}

function scoredraw(){///score draw
    ctx = gameArea.context;
    ctx.font = "30px Arial";
    
    ctx.fillText("Score : "+score,10,50);
} 

function calculateMousePos(evt){//............................Calculating mouse position.................................
    var rect = gameArea.canvas.getBoundingClientRect();
  //  var root = document.documentElement;
    var mouseX=evt.clientX - rect.left 
    var mouseY= evt.clientY - rect.top 
     return{
     x:mouseX,
     y:mouseY
   };

}
// function storeGuess(event) {
//     var mouseX = event.offsetX;
//     var mouseY = event.offsetY;
//     return{
//         x:mouseX,
//         y:mouseY
//     }
   
//    // console.log("x coords: " + guessX + ", y coords: " + guessY);
// }

function reset()
{    
    gameArea.clear()
    counter=0
    m=0
    cnt=0
    buildingOnfire=false;
    allTowersDamaged=false;
    tower1.damaged=false;
    tower2.damaged=false;
    tower3.damaged=false;
    tower4.damaged=false;
    tower5.damaged=false;
    human1.timer=0;
    human2.timer=0;
    human3.timer=0;
    human4.timer=0;
    human1 = new SPRITEIMAGE(0,0,754,988,2,tower1.x+tower1.width,canvas_height-human_h,human_w,human_h,'assets/human1sprite.png','human1',false);
    human2 = new SPRITEIMAGE(0,0,1064,1464,2,tower1.x-human_w,canvas_height-human_h,human_w,human_h,'assets/human2sprite.png','human2',false)
    human3 = new SPRITEIMAGE(0,0,676,1053,2,tower3.x+human_w+tower3.width,canvas_height-human_h,human_w,human_h,'assets/human3sprite.png','human3',false)
    human4 = new SPRITEIMAGE(0,0,688,933,2,tower3.x-human_w,canvas_height-human_h,human_w,human_h,'assets/human4sprite.png','human4',false)
    tower1.image.src='assets/tower.png'
    tower2.image.src='assets/tower.png'
    tower3.image.src='assets/tower.png'
    tower4.image.src='assets/tower.png'
    tower5.image.src='assets/tower.png'
    newbussbar = new SPRITEIMAGE(0,0,372,227,2,canvas_width/2-newBussBar_w/2,canvas_height/2-newBussBar_h/2,newBussBar_w,newBussBar_h,'assets/bussbarNewSprite.png');
    oldbussbar = new imageBuilder(canvas_width/2-oldbussbar_w/2,canvas_height/2-oldbussbar_h/2,oldbussbar_w,oldbussbar_h,'assets/bussbarOld.png');
   clouds=[];
   bolts=[]
   clouds.push(new imageBuilder(canvas_width,20,cloud_w,cloud_h,'assets/cloud.png','cloud'));
}

class TEXT
{   
    constructor(x,y,text)
    {
        this.x=x;
        this.y=y;
        this.text= text;
    }
    draw()
    {
        ctx.font='25px Gerogia'
        ctx.fillStyle='white'
        ctx.fillText(this.text,this.x,this.y,)
    }
   

}

//keyboard handler

function keyDownHandler(e){
    switch (e.keyCode){
        case SPACEBAR:newbussbar.Rotate(1);
                       SHOOT=true;
                        break;
        case LEFTARROW:newbussbar.pushLeft=true;
                        oldbussbar.pushLeft=true;
                       break;
        case RIGHTARROW:newbussbar.pushRight=true;
                         oldbussbar.pushRight=true; 
                         break;
        case UPARROW:newbussbar.pushUp=true;
                      oldbussbar.pushUp=true;
                      break;
        case DOWNARROW:newbussbar.pushDown=true;
                      oldbussbar.pushDown=true;
                        break;
    }
  }

 function keyUpHandler(e){
   switch(e.keyCode){//capital c is must camel case
         case SPACEBAR:newbussbar.Rotate(0);
                        SHOOT=false;
                         break;
         case LEFTARROW:newbussbar.pushLeft=false;
                         oldbussbar.pushLeft=false;
                        break;
         case RIGHTARROW:newbussbar.pushRight=false;
                          oldbussbar.pushRight=false; 
                          break;
         case UPARROW:newbussbar.pushUp=false;
                       oldbussbar.pushUp=false;
                       break;
         case DOWNARROW:newbussbar.pushDown=false;
                       oldbussbar.pushDown=false;
                         break;
   }
 }
