## PRIMA
Repository for the module "Prototyping interactive media-applications and games" in SoSe 23 - SoSe 24

## Final Project
- Title: Bunny-Mania
- Author: Ulla Herrmann, Matrikelnr. 263559
- Year and season: summer semester 2024
- Curriculum and semester: MKB 7
- Course: PRIMA
- Professor: Prof. Jirka Dell'Oro-Friedl
- Fellow/Contributor:	Lukas Scheuerle
- Executable application: https://lum7n.github.io/Prima/p4_BunnyMania/index.html
- Source code: https://github.com/Lum7n/Prima/tree/main/p4_BunnyMania
- Design document: https://github.com/Lum7n/Prima/tree/main/p4_BunnyMania/Bunny-Mania_DesignDocument.pdf

### Description for the users on how to interact
Use WASD or the Arrow-Keys to move, while moving the Character "Bunny" through the Maze. The Goal of the game is to collect all the stars in the maze. After collecting all the stars, a key to get you out of the maze spawns. Collecting stars awards you points, which are visible in the VUI. Additionally, you can collect different Items, which have different effects. Lives give you back one heart, if you have been hit by an enemy. PowerUps increase your speed and make it possible to kill enemies. AdditionalTime increases the time left on a PowerUp. For balancing, Lives are exceptionally rare, followed by PowerUps, which are also quite rare. There are more AdditionalTime Items, since they are only usable with a Powerup.

## Curent status
- Due to issues with the rigidbody and collisions, the enemies can just be killed on their spawn-spot. 
- The AdditionalTime Items don’t add more time to the PowerUp, they just delete time from the previous playing time.
- There could have been more sounds: like for killing a fox, or getting killed by them, or for the winning screen, or game over screen.

## Checklist for the final assignment
The extended version of this list and explanations can be found in the Design document linked above.

| Nr | Criterion | Explanation | 
| :---: | :---: | --- | 
| 1 | Units and Positions | 0 = the start of the maze in the top left corner, as that is where the game starts. Placing it in the middle of the maze or somewhere else would make it so that the items would have to be generated in both positive and negative x and z directions. 1 = the measurement of one block in width and height.
| 2 | Hierarchy | The Main-Elements are the Maze, the Character and the Audio.
The Maze is keeping the Border, the Level-Cubes, the Ground, the Roof and the Items. The Character has its Geometry and the Camera Node. The Audio keeps the Sounds. The Hierarchy goes from the smaller Elements to the bigger ones, but actually it doesn't play that big of a role. The Building-Cubes are sorted from left to right and top to bottom. The Items are just sorted by type.  <br>

Blue = star nodes are added via code, the amount is random decided  <br>
Green = nodes are added via editor but disabled and then via code enabled, but not all of them, just a random decided percentage. <br>
<br> <ul> <li> Game </li> <ul> <li> Track </li> <ul> <li> Bottom Track </li> <li> Top Track </li> <li> Bridge </li> </ul> <li> Collectables </li> <ul> <li> Star </li> <li> Coin </li> <li> … </li> </ul> <li> Character </li> <ul> <li> Pingu (components via code) </li> <li> Camera </li> </ul> <li> Light </li> <li> Background </li> <li> Sound </li> <li> Igloo </li> </ul> </ul> |
| 3 | Editor | Visual Editor: <ul> <li> Hierarchy with all Parent Nodes for all needed elements </li> <li> Track Elements and their components, as they stay during the whole game and stay the same at any time </li> <li> Other elements that don’t need further adjustments like the background, the light and the sound nodes </li> </ul> Code: <ul> <li> Creation of the collectables that need to be deleted after collection and need different methods </li> <li> Character as there are many aspects that need to be adjusted </li> </ul> | 
| 4 | Scriptcomponents | Scriptcomponent to calculate and determine the positions of the obstacles based on how many collectables exist, so they get spread out evenly in the game. <br> It brought me the advantage of needing those code part only once in the scriptcomponent and not twice in each collectable class. | 
| 5 | Extend | I derived classes for the Pingu-Character, the Coins and the Stars as ƒ.Nodes from Fudge Core. <br> This was very useful for me as I could use the classes to set the methods which are needed in the game. | 
| 6 | Sound | I used sounds for the collection of stars, collection of coins, when Pingu is jumping as well as at the end of the game in case of loosing and winning. <br> I choose to not use a background music as it is unnecessary for a game like this in my opinion. | 
| 7 | VUI | The VUI shows the remaining time of the game, the amount of collected stars and coins. In front of every number is the description what exactly it is. | 
| 8 | Event-System | Custom event “checkGameEnd” that gets triggered in a case where the game ends. Those cases are: <ul> <li> timer has reached 0 </li> <li> Pingu falls down </li> <li> Pingu has reached the igloo after collecting three stars. </ul> The detail of the event contains the reasons why the game ended. <br> The use of the event system was useful, as it was an easy way to be used in all kinds of game end cases. | 
| 9 | External Data | External data to load the amount of stars, amount of coins and the game duration into the application. <br> This is useful as they can be easily adjusted this way to make the game harder or easier. | 
| A | Light | I choose an ambient light for Pingu Run, as there is no need for shadows in a 2D Game. | 
| B | Physics | <ul> <li> The Pingu character has a dynamic rigidbody. All track elements and the stars have static rigidbodies so they can create collisions with Pingu. The track elements block him from moving into that direction when he hits them. The stars send an event to their state machine when a collection is detected and thus transit into another job. </li> <li> For the jumping movement of Pingu I used the applyLinearImpulse method of its rigidbody. </li> <li> The bridge track element is a Joint Revolute which swings down when it is hit with enough force by the character. </li> </ul> | 
| ~C~ | ~Net~ | No network functionality is used in PinguRun. | 
| D | State Machines | Component State Machine for the stars as it was easy to distinguish their three stages of live: <ul> <li> Idle (being on the track, waiting to get collected) </li> <li> fly (flying up in the sky after getting collected) </li> <li> shine (being placed above of the track) </li> </ul> | 
| E | Animation | <ul> <li> Animation system to animate the rotation of the coins as well as to animate the flying up of the stars after their collection. </li> <li> Pingu has a Sprite Animation for his sprites so it looks like he is actually walking and not sliding along the track. </li> </ul> |
