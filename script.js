
//Variablen-------------------------------------------------------------------------------------------------------
var Points = 0; //Punkte --> Werden beim spiel hinzugefügt.
var Prog = 10; //Prog-Bar --> Füllt sich je nach Stand --> Wird aus den Punkten errechnet.
var MarginTopFigur = 450; //Aktuelles Level des Spielballs in Pixel
var MarginTopFigurLevel = 1; //Die Start Höhe ist auf "Level" 1
var MarginTopFigurSaveLevel1 = 450; //Level1 der Höhe in Pixel
var MarginTopFigurSaveLevel2 = 400; //Level2 der Höhe in Pixel
var MarginTopFigurSaveLevel3 = 350; //Level3 der Höhe in Pixel
var MarginTopFigurSaveLevel4 = 300; //Level4 der Höhe in Pixel
var MarginTopFigurSaveLevel5 = 250; //Level5 der Höhe in Pixel
var SaveLevel = 0; //Das Höhen-Level wird beim Überqueren eines Hindernisses gespeichert.
var InGame = false; //Ist das Game offen oder Pause bzw. aus
var IsPlaying = false; //Keyboard ist aktiviert
var IsJump = false; //Ist im Jump
var CountDown = 3; //Countdown
var SoundOnOff = true; //Settings Sound
var DevMode = false; //Settings DevMode
var NumberObstacles = 20; //Anzahl der Hindernisse (wird für die Schleife benötigt)
var LastObstacle = ""; //Zwischen Variable in der der Name des Hindernisses gespeichert wird, welches als letztes überquert wurde.

//Jumpmechanik Variablen
var JumpCode = 1; //Für Jumpvariable (Für die Schleife)
var RotationBlock = 0; //Rotation der Spielfigur
var RotateStopJump = false; //Rotation stopped alle 90°


var RunCode = 1; //Variable wird zum Fortlauf der Map benötigt
var RunMargin = 0; //Variable zeigt die Verschiebung der Map nach links an


//Hindernis Variablen
var InAreaOfObstacle = false; //Befindet sich die Spielfigur im Raum (x-Richtung) eines Hindernisses
var IsOnFloor = false; //Befindet sich die Spielfigur auf einem Floor bzw. auf dessen Höhe
var FallCode = 1; //Wird für das Fallen von einem Hinderniss benötigt


let root = document.documentElement; //Root eingriff für css einbindung.

var r = document.querySelector(':root');
var IconS = document.getElementsByTagName('link')[0];

//----------------------------------------------------------------------------------------------------------------



//Grund-Functions-------------------------------------------------------------------------------------------------

//Öffnet die Gameview
function OpenGame(){
    Default();
    document.getElementById("GameScreen").style.display="block";
    document.getElementById("GameOverScreen").style.display = "none";
    document.getElementById("StartScreen").style.display="none";
    AddProg();
    InGame=true;
    StartGC();
}

//Öffnet die Settingsview
function OpenSettings(){
    document.getElementById("SettingsScreen").style.display="block";
    document.getElementById("StartScreen").style.display="none";
    UpdateSwitches();
}


//function Default Werte --> Stellt nach einem GameOver die Grund-Werte, wieder auf Anfang

function Default(){
    Points = 0;
    Prog = 10;
    MarginTopFigur = MarginTopFigurSaveLevel1;
    InGame = false;
    IsPlaying = false;
    IsJump = false;
    JumpCode = 1;
    RotationBlock = 0;
    RotateStopJump = false;
    RunCode = 1;
    RunMargin = 0;
    CountDown = 3;
    MarginTopFigurLevel = 1;
    FallCode = 1;
    InAreaOfObstacle = false;
    IsOnFloor = false;
    SaveLevel = 0;
    ChangePoints();
    ChangeProg();
    document.getElementById("GameFigur").style.transform = 'rotate(' + RotationBlock + 'deg)';
    document.getElementById("GameFigur").style.marginTop = MarginTopFigur + "px";
    document.getElementById("Map1").style.marginLeft = RunMargin + "px";
}




//Methode um Punkte zu adden
function AddPoints(){
    Points = Points+1;
    if((Points % 2)==0){ //Alle Zwei Punkte wird etwas zur Progbar hinzugefügt.
        AddProg();
    }
    ChangePoints();
}

//Edeitiert die Progbar
function AddProg(){
    Prog = Prog+1;
    ChangeProg();
}

//Updatet die Points
function ChangePoints(){
    document.getElementById("Points").innerHTML=Points;
}

//Updatet die Progbar
function ChangeProg(){
    document.getElementById("Progbar").style.width= Prog + "px"
}


//Map Start mit Countdown


function StartGC(){
    setTimeout(function(){StartGCText("3")},500); 
    
}

function StartGCText(TextGC){
    document.getElementById("StartCountDown").innerHTML=TextGC;

    if(CountDown>1){
        setTimeout(function(){StartGCText(CountDown)},500);
    }
    else if(CountDown == 1){
        setTimeout(function(){StartGCText("GO!")},500);
    }

    if(TextGC === "GO!"){
        setTimeout(function(){StartGCText("")},500);
        setTimeout(function(){IsPlaying=true},500);
        setTimeout(function(){RunMap()},500);
    }
    
    CountDown = CountDown - 1;
    
}

//Game wird Pausiert 
function PauseGame(){
    InGame = false;
    document.getElementById("PauseScreen").style.display = "block";
}

//Resume Pause wird aufgehoben und das Spiel läuft weiter
function PauseStop(){
    InGame = true;
    document.getElementById("PauseScreen").style.display="none";
    RunMap();
}

//Man verlässt das Game und landet wieder im Hauptmenu
function PauseHome(){
    document.getElementById("StartScreen").style.display="block";
    document.getElementById("GameScreen").style.display="none";
    document.getElementById("PauseScreen").style.display="none";
    document.getElementById("SettingsScreen").style.display="none";
    Default();
}


//GameOver-Screen wird sichtbar und das Spiel Stoppet
function GameOver(){
    InGame = false;
    document.getElementById("GameOverScreen").style.display = "block";
}

//Nach GameOver wieder neustarten
function Restart(){
    OpenGame();
}

//Registriert die Keys
document.addEventListener('keydown', (event) => {
    if (event.key == 'e') {
        //Wenn man 'e' drückt kommt man in oder aus dem Pausescreen
        if(InGame==true){
            PauseGame();
        }
        else if(document.getElementById("PauseScreen").style.display === "block" && InGame == false){
            PauseStop();
        }
    }

    //Mit Space bzw. Leertaste springt man
    if (event.code == 'Space') {
        if(IsPlaying==true){   
            if(IsJump==false){
                JumpCode = 1;
                JumpOn(); //Sprung Methode

                // Abspielen eines Sounds (wird noch überarbeitet Sounddatei ist zu lang)
                document.getElementById('audiofile').play();
                //Lautstärkeanpassung, je nach Einstellung
                if(SoundOnOff == true){
                    document.getElementById('audiofile').volume=0.5; //Standart Lautstärke
                }
                else{
                    document.getElementById('audiofile').volume=0; //Lautstärke aus
                }
                
            }
        }
    }
});



//----------------------------------------------------------------------------------------------------------------


//JumpMechanik----------------------------------------------------------------------------------------------------

        
//Diese Schleife erzeugt eine Bewegung, welche später, dann auch mit einem Geschwindigkeitsparameter beeinflussbar ist(noch nicht hinzugefügt)
function JumpOn() {         
  setTimeout(function() {   
    Jump(JumpCode);   
    JumpCode++;                    
    if (JumpCode < 240) {           
      JumpOn();             
    }                       
  }, 0.25) //Delay --> Nach diesem Delay wir die Methode Jump aufgerufen und das immer wieder, bis die schleife endet.
}



//Der Eigentliche Sprung an sich
function Jump(NumberJumping){



    var jumplevel = 0; //Variable wird benötigt um nach dem Springen, dei Figur wieder zurück auf ihre Ursprungshöhe zubringen.
    //Dieses wird benötigt, damit mach auch Springen gedrückthalten kann.
    if(MarginTopFigurLevel == 1){
        jumplevel = MarginTopFigurSaveLevel1;
    }
    else if(MarginTopFigurLevel == 2){
        jumplevel = MarginTopFigurSaveLevel2;
    }
    else if(MarginTopFigurLevel == 3){
        jumplevel = MarginTopFigurSaveLevel3;
    }
    else if(MarginTopFigurLevel == 4){
        jumplevel = MarginTopFigurSaveLevel4;
    }
    else if(MarginTopFigurLevel == 5){
        jumplevel = MarginTopFigurSaveLevel5;
    }
    



    IsJump = true; //Somit kann man in der Luft nicht nochmal springen
    //Je nachdem, in welchem Bereich man sich innerhalb des Sprungs befindet bewegt sich die Figur anders.
    //Unter 100 rotiert die Figur auch noch (nur aus Optischen Gründen)
    if(NumberJumping<100){
        MarginTopFigur = MarginTopFigur - 1.25;

        if(RotateStopJump == false){
            RotationBlock = RotationBlock + 1;
        }

        if(RotationBlock == 90){
            RotateStopJump = true;
            //RotationBlock = 0;
        }

        if(RotationBlock == 180){
            RotateStopJump = true;
        }

        if(RotationBlock == 270){
            RotateStopJump = true;
        }

        if(RotationBlock == 360){
            RotateStopJump = true;
            RotationBlock = 0;
        }
        
    }

    //Je nach Übergebender Zahl geht die Figur nach oben bzw. nach Unten
    //Dabei wird der MarginTop-Wert der GameFigur verändert
    if(NumberJumping>=100){
        MarginTopFigur = MarginTopFigur - 0.25;
    }

    if(NumberJumping>120){
        MarginTopFigur = MarginTopFigur + 1.25;
    }

    if(NumberJumping>=220){
        MarginTopFigur = MarginTopFigur + 0.25;
    }

    //Bei einem Übergebenen Wert von 239 setzt das Stoppen ein
    if(NumberJumping==239){
        MarginTopFigur = MarginTopFigur + 5;
        IsJump = false;
        RotateStopJump = false;
        
    }

    //Bei einem Übergebenen Wert von 240 stopt die Figur und wird auf das letzte Höhenlevel zurückgesetzt
    if(NumberJumping==240){
        MarginTopFigur = MarginTopFigur + 1.5;
        RotateStopJump = false;
        IsJump = false;
        if(IsOnFloor == true){
            MarginTopFigur = SaveLevel;
        }
        else{
            MarginTopFigur = jumplevel;
        }
    }
    
    

    
    document.getElementById("GameFigur").style.transform = 'rotate(' + RotationBlock + 'deg)'; //Rotation wird geändert
    document.getElementById("GameFigur").style.marginTop = MarginTopFigur + "px"; //Position wird geändert

}

//----------------------------------------------------------------------------------------------------------------




//Run-Mechanik----------------------------------------------------------------------------------------------------

//Map is Running-----



//Gleche Schleife, wei beim Jump nur ein längerer Wert
//Dieses dient dabei aber zum Fortlauf der Map
function RunMap(){
    setTimeout(function() {   
        MapRun();   
        RunCode++;                    
        if (RunCode < 30000 && InGame == true) {           
          RunMap();             
        }                       
    }, 0.5) //Delay
}


//Map wird passend verschoben
function MapRun(){
    RunMargin = RunMargin - 1; //Wert der Verscheibung wird geändert
    document.getElementById("Map1").style.marginLeft = RunMargin + "px"; //Verschiebung wird auch in HTML verändert

    if(((RunMargin * (-1))%200)==0){ //Punkte werden geaddet
        AddPoints();
    }

    CheckAllObstacle(); //Bei jeder bewegung wird überprüft, ob die Figur mit irrgendetwas kollidiert
    
}




function CheckAllObstacle(){
     
    var myElement2 = document.querySelector("#GameFigur"); //Get Element from ID (Hier die GameFigur)
    var style2 = window.getComputedStyle(myElement2); //Get Style from ID (Hier die GameFigur)
    var StringOfElement0 = style2.getPropertyValue("margin-left").split("px")[0]; //Remove px
    var Marginfigur = parseInt(StringOfElement0); //Wird in Int umgewandelt, somit erhällt man den Margin-Left-Wert, falls man später das Spiel grundlegend verändern möchte.


    //Mit Hilfe dieser Schleife werden jedesmal alle Hindernisse aufgerufen und überprüft
    for(i=0;i<=NumberObstacles;i++){

        //Get Velue of Margin
        
        var myElement1 = document.querySelector("#Obstacle" + i); //Get Element from ID (Entsprechendem Hinderniss)
        var style1 = window.getComputedStyle(myElement1); //Get Style from ID (Entsprechendem Hinderniss)
 
        // getting 250 and removing the "px" part of the value
        var StringOfElement1 = style1.getPropertyValue("margin-left").split("px")[0]; //Remove px
        var StringOfElement2 = style1.getPropertyValue("width").split("px")[0]; //Remove px
        var StringOfElement3 = style1.getPropertyValue("height").split("px")[0]; //Remove px
 
        var MarginObstacle = parseInt(StringOfElement1); //Man erhällt MarginLeft vom Hinderniss
        var MarginObstacleMinus = parseInt(StringOfElement2); //Man erhällt die Breite vom Hinderniss
        var MarginObstacleHight = parseInt(StringOfElement3); //Man erhällt die Höhe vom Hinderniss
        MarginObstacle = MarginObstacle - MarginObstacleMinus; //Wert wird passend zur Rechnung später verändert.
        MarginObstacleMinus = MarginObstacleMinus *(-1); //Wird später für die Rechnung zum Negativen wert.
        var ObstacleID = "Obstacle" + i; //ID des Hindernisses wird definiert.


        //Aktuelles Margin bzw. HöhenLevel wird überprüft und zwischengespeichert.
        var MarginLevel = 0;
        if(MarginTopFigurLevel == 1){
            MarginLevel = MarginTopFigurSaveLevel1;
        }
         else if(MarginTopFigurLevel == 2){
            MarginLevel = MarginTopFigurSaveLevel2;
        }
        else if(MarginTopFigurLevel == 3){
            MarginLevel = MarginTopFigurSaveLevel3;
        }
        else if(MarginTopFigurLevel == 4){
            MarginLevel = MarginTopFigurSaveLevel4;
        }
        else if(MarginTopFigurLevel == 5){
            MarginLevel = MarginTopFigurSaveLevel5;
        }

        
        
        //Ruft die CheckMethode auf und übergibt die passenden Werte 
        CheckObstacle(Marginfigur, MarginObstacle, MarginObstacleHight, MarginObstacleMinus, MarginLevel, ObstacleID);
    }
}


//Methode zum Überprüfen ob die Figur kollidiert oder in die Nähe kommt
function CheckObstacle(Marginfigur, MarginObstacle, MarginObstacleHight, MarginObstacleMinus, MarginLevel, ObstacleID){
    //Berührt die Figur ein Hinderniss der Klasse Obstecle, dann ist sofort GameOver
    //If-Abrfrage:
    //((VerscheibungDerMap(im Negativen)NachLinks + MarginDerFigur) +  Abstand des Hindernisses) Muss kleinerGleich Null sein
    //Ebenso ((VerscheibungDerMap(im Negativen)NachLinks + MarginDerFigur) +  Abstand des Hindernisses) Muss GrößerGleich länge des Hindernisses sein
    //Ebenso Muss die Höhe der Figur größer als das Marginlevel - Höhe des Hindernissses sein, somit kollediert es auch damit.
    //Ebenso Muss das Hinderniss die Klasse Obstacle haben
    if(((RunMargin + Marginfigur) + MarginObstacle)<=0 && ((RunMargin + Marginfigur) + MarginObstacle)>= MarginObstacleMinus && MarginTopFigur > (MarginLevel- MarginObstacleHight) && document.getElementById(ObstacleID).className === "Obstacle"){
        GameOver();
        IsOnFloor = false;
        alert(ObstacleID);
    }

    //Wenn Figur auf Hinderniss landet
    //If-Abfrage:
    //((VerscheibungDerMap(im Negativen)NachLinks + MarginDerFigur) +  Abstand des Hindernisses) Muss kleinerGleich Null sein
    //Ebenso ((VerscheibungDerMap(im Negativen)NachLinks + MarginDerFigur) +  Abstand des Hindernisses) Muss GrößerGleich länge des Hindernisses sein    
    //Ebenso Muss die Höhe der Figur größer als das Marginlevel - Höhe des Hindernissses sein, somit kollediert es auch damit.
    //Ebenso Muss das Hinderniss die Klasse Floor haben
    //Ebenso Muss die Höhe kleinerGleich Marginlevel -45 (Ein Level sind immer 50, deshalb 5 für Karenz)
    else if(((RunMargin + Marginfigur) + MarginObstacle)<=0 && ((RunMargin + Marginfigur) + MarginObstacle)>= MarginObstacleMinus && MarginTopFigur > (MarginLevel- MarginObstacleHight) && document.getElementById(ObstacleID).className === "Floor" && MarginTopFigur <= MarginLevel -45 ){
        
        
        
        //Jump wird vorzeitig beendet
        //Je nach Höhe des Hindernisses wird dann das jeweilige Höhenlevel geändert, sodass die Figur auf dem Hinderniss weiterläuft.
        JumpCode = 239;
        if(MarginObstacleHight == 50){
            MarginTopFigur = MarginLevel -50;
            SaveLevel = MarginLevel - 50;
        }

        if(MarginObstacleHight == 100){
            MarginTopFigur = MarginLevel -100;
            SaveLevel = MarginLevel - 100;
        }

        if(MarginObstacleHight == 150){
            MarginTopFigur = MarginLevel -150;
            SaveLevel = MarginLevel - 150;
        }

        if(MarginObstacleHight == 200){
            MarginTopFigur = MarginLevel -200;
            SaveLevel = MarginLevel - 200;
        }

        if(MarginObstacleHight == 250){
            MarginTopFigur = MarginLevel -250;
            SaveLevel = MarginLevel - 250;
        }

        IsOnFloor = true; //IsOnFloor wird true gesetzt
        JumpCode = 240; //Jump wird endgültig beendet
        LastObstacle = ObstacleID; //Letztes Hinderniss wird zudem Hinderniss gesetzt, aufdem sich die Figur befindet

        document.getElementById("GameFigur").style.marginTop = MarginTopFigur + "px"; //Zur Sicherheit wird hier nochmal die Figur an die Richtige Stelle gesetzt
        //alert(MarginTopFigur + " " + MarginObstacle + " " + MarginObstacleHight+ " "+ MarginObstacleMinus+" " + MarginLevel + " " + ObstacleID);
        
    }

    //Wenn Figur nicht auf Hinderniss landet sondern crashed
    //If-Abfrage:
    //((VerscheibungDerMap(im Negativen)NachLinks + MarginDerFigur) +  Abstand des Hindernisses) Muss kleinerGleich Null sein
    //Ebenso ((VerscheibungDerMap(im Negativen)NachLinks + MarginDerFigur) +  Abstand des Hindernisses) Muss GrößerGleich länge des Hindernisses sein    
    //Ebenso Muss die Höhe der Figur größer als das Marginlevel - Höhe des Hindernissses sein, somit kollediert es auch damit.
    //Ebenso Muss das Hinderniss die Klasse Floor haben
    //Ebenso Muss die Höhe größer Marginlevel -55 (Ein Level sind immer 50, deshalb 5 für Karenz)
    else if(((RunMargin + Marginfigur) + MarginObstacle)<=0 && ((RunMargin + Marginfigur) + MarginObstacle)>= MarginObstacleMinus && MarginTopFigur > (MarginLevel- (MarginObstacleHight - 1)) && document.getElementById(ObstacleID).className === "Floor" && MarginTopFigur > MarginLevel -55){
        GameOver();
        IsOnFloor = false;
        //alert(ObstacleID);
    }

    //Methode zur Überprüfung ob die Figur fallen muss
    CheckObstacleLevel(Marginfigur, MarginObstacle, MarginObstacleMinus, ObstacleID);
    
}


function CheckObstacleLevel(Marginfigur, MarginObstacle, MarginObstacleMinus, ObstacleID){
    //Checkt ob GameFigur innerhalb Gebiet eines Hindernisses oder erhöhten Floors ist
    if(((RunMargin + Marginfigur) + MarginObstacle)<=0 && ((RunMargin + Marginfigur) + MarginObstacle)>=MarginObstacleMinus && LastObstacle == ObstacleID){
        InAreaOfObstacle = true; //Figur befindet sich im x-Breich eines Hindernisses
        FallCode = 1;
        
    }
    else{
        InAreaOfObstacle = false;
        
    }
    //Sollte eine Figur nicht im Raum eines Hindernisses Sein und trotzdem in der Luft fällt die Figur
    if(InAreaOfObstacle == false && IsOnFloor == true && IsJump == false && LastObstacle == ObstacleID){
        //alert(ObstacleID + LastObstacle);
        
        FallFloor();
    }

    
}









//fall fixen, dass man nicht Jumpen kann!

//Schleife für die Fall bewegung
function FallFloor(){
    setTimeout(function() {   
        FallMove();   
        
        FallCode++;                    
        if (FallCode < 5 && InGame == true && IsJump == false && IsOnFloor == true) {           
          FallFloor();             
        }                       
    }, 10) //Delay
}


//Fall bewegung
function FallMove(){
    MarginTopFigur = MarginTopFigur + 1;
    //Sollte die Figur wieder am Boden oder auf einem anderen Floor gelandet sein so wird die Schleife unterbrochen und alles wieder auf normal gesetzt
    if(MarginTopFigur >= MarginTopFigurSaveLevel1){
        FallCode = 6;
        MarginTopFigurLevel = 1;
        MarginTopFigur= MarginTopFigurSaveLevel1;
        InAreaOfObstacle = false;
        IsOnFloor = false;
        
    }
    document.getElementById("GameFigur").style.marginTop = MarginTopFigur + "px";
}
//----------------------------------------------------------------------------------------------------------------


//Settings-Functions----------------------------------------------------------------------------------------------

var Primary = "";
var Secondary = "";

function ChangeColorPrimary(ColorName){
    r.style.setProperty('--GameFigurPrimary',ColorName);
    Primary = ColorName;
}

function ChangeColorSecondary(ColorName){
    r.style.setProperty('--GameFigurSecondary',ColorName);
    Secondary = ColorName;
}

function SaveSettings(){
    r.style.setProperty('--GFP', Primary);
    r.style.setProperty('--GFS', Secondary);
}

function ChangeSwitchSound(){
    if(SoundOnOff == false){
        document.getElementById("SwitchButtonSound").style.marginLeft = "230px";
        SoundOnOff = true;

        document.getElementById("SwitchBar1Sound").style.display = "none";
        document.getElementById("SwitchBar2Sound").style.display = "block";
    }
    else{
        document.getElementById("SwitchButtonSound").style.marginLeft = "145px";
        SoundOnOff = false;

        document.getElementById("SwitchBar1Sound").style.display = "block";
        document.getElementById("SwitchBar2Sound").style.display = "none";
    }
    
}


function ChangeSwitchDev(){
    if(DevMode == false){
        document.getElementById("SwitchButtonDev").style.marginLeft = "230px";
        DevMode = true;

        document.getElementById("SwitchBar1Dev").style.display = "none";
        document.getElementById("SwitchBar2Dev").style.display = "block";
    }
    else{
        document.getElementById("SwitchButtonDev").style.marginLeft = "145px";
        DevMode = false;

        document.getElementById("SwitchBar1Dev").style.display = "block";
        document.getElementById("SwitchBar2Dev").style.display = "none";
    }
    
}


function UpdateSwitches(){
    if(SoundOnOff == true){
        document.getElementById("SwitchButtonSound").style.marginLeft = "230px";
        document.getElementById("SwitchBar1Sound").style.display = "none";
        document.getElementById("SwitchBar2Sound").style.display = "block";
    }
    else{
        document.getElementById("SwitchButtonSound").style.marginLeft = "145px";
        document.getElementById("SwitchBar1Sound").style.display = "block";
        document.getElementById("SwitchBar2Sound").style.display = "none";
    }



    if(DevMode == true){
        document.getElementById("SwitchButtonDev").style.marginLeft = "230px";
        document.getElementById("SwitchBar1Dev").style.display = "none";
        document.getElementById("SwitchBar2Dev").style.display = "block";
    }
    else{
        document.getElementById("SwitchButtonDev").style.marginLeft = "145px";
        document.getElementById("SwitchBar1Dev").style.display = "block";
        document.getElementById("SwitchBar2Dev").style.display = "none";
    }
}

//----------------------------------------------------------------------------------------------------------------




