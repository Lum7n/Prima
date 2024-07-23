namespace Script {
    import ƒ = FudgeCore;
    import ƒUI = FudgeUserInterface;

    export class GameInterface extends ƒ.Mutable {
        public points: number = 0;
        public lives: number = 0;
        public time: number = 0;

        static visualUIdiv: HTMLDivElement;
        static lastLifeAmount: number = 3;

        public constructor(_initialLives: number) {
            super();
            GameInterface.visualUIdiv = document.querySelector("div#visualUI");
            GameInterface.visualUIdiv.style.display = "block";
            let visualUIController: ƒUI.Controller = new ƒUI.Controller(this, GameInterface.visualUIdiv);
            console.log("UI-Controller: " + visualUIController)
            // this.time = _time;
            this.lives = _initialLives;
            for (let index = 0; index < _initialLives; index++) {
                this.addLifeImg();
            }
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void { /* */ }

        updateUserInterface(): void {
            // points
            let pointsSpan: HTMLSpanElement = GameInterface.visualUIdiv.querySelector("#points");
            pointsSpan.innerHTML = "" + this.points + "";

            // lives
            if (this.lives != GameInterface.lastLifeAmount) {
                if (this.lives - GameInterface.lastLifeAmount > 0) {
                    console.log("life added");
                    this.addLifeImg();
                    GameInterface.lastLifeAmount = this.lives;
                } else if (this.lives - GameInterface.lastLifeAmount < 0) {
                    console.log("life killed");
                    this.killLifeImg();
                    GameInterface.lastLifeAmount = this.lives;
                    if (this.lives == 0) {
                        timer.active = false;
                        this.showEndscreen(this.points, this.time);
                        won = true;
                    }
                }
            }

            // time
            let timeSpan: HTMLSpanElement = GameInterface.visualUIdiv.querySelector("#time");
            if (this.time > 0) {
                timeSpan.innerHTML = this.displayTime(this.time);
            } else {
                timeSpan.innerHTML = "00:00";
            }
        }

        addLifeImg(): void {
            let randomNumber: number = 0;
            while (randomNumber == 0) {
                randomNumber = Math.round(Math.random() * 6);
            }
            let newLifeImg: HTMLImageElement = document.createElement("img");
            newLifeImg.src = "Assets/life" + randomNumber + ".png";
            let livesSpan: HTMLSpanElement = GameInterface.visualUIdiv.querySelector("#lives");
            livesSpan.appendChild(newLifeImg);
        }

        killLifeImg(): void {
            let livesSpan: HTMLSpanElement = GameInterface.visualUIdiv.querySelector("#lives");
            let livesSpanChildren: HTMLCollectionOf<HTMLImageElement> = livesSpan.getElementsByTagName("img");
            let livesSpanChild: HTMLImageElement = livesSpanChildren[0];
            console.log(livesSpanChildren);
            livesSpan.removeChild(livesSpanChild);
        }

        displayTime(_time: number) {
            let seconds = Math.floor(_time) % 60;
            // console.log("s " + seconds);
            let minutes = Math.floor(_time / 60) % 60;
            // console.log("m " + minutes);
            return this.pad(minutes) + ":" + this.pad(seconds); // format display time
        }

        pad(number: number) {
            // adds a zero if the number is less than 10
            return (number < 10 ? "0" : "") + number;
        }

        showEndscreen(_finalPoints: number, _finalTime: number): void {
            let endScreenDiv: HTMLDivElement = document.querySelector("div#endScreen");
            endScreenDiv.style.display = "block";

            if (won != true) {
                let titelH1: HTMLHeadingElement = endScreenDiv.querySelector("h1");
                titelH1.innerHTML = "Game Over"
                let titelH2: HTMLHeadingElement = endScreenDiv.querySelector("h2");
                titelH2.innerHTML = "You lost!"
            }

            let finalPointsSpan: HTMLSpanElement = endScreenDiv.querySelector("#finalPoints");
            finalPointsSpan.innerHTML = "" + _finalPoints;
            
            let finalTimeSpan: HTMLSpanElement = endScreenDiv.querySelector("#finalTime");
            if (this.time > 0) {
                finalTimeSpan.innerHTML = this.displayTime(_finalTime);
            } else {
                finalTimeSpan.innerHTML = "00:00";
            }
        }
    }
}