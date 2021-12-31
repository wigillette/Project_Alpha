# GAME OVERVIEW #
## SUMMARY ##
Upon entering the server, players will select a section of the map to load/start their creation. In the day time, players will use their set of unlocked assets, which they can purchase with gold, to build their desired creations. After placing an asset, players will receive a certain amount of experience, which they can use to unlock new assets. At night, monsters will attack players and their creations. Players will receive gold as an incentive for killing these monsters, which they can use to purchase weapons/assets. On the other hand, players will lose gold for each asset that is destroyed.
## LEVEL SYSTEM ##
- Players will level up through gaining experience by working on their creations.
- The experience cap is given by `math.ceil(level^(1.5) * 50)`. From this formula, the initial experience cap is 50, and the intitial level is 1.
## BUILDING SYSTEM ##
- Players are allocated a specific area of the map on which to build their creations.
- Players can purchase premade assets from the shop using gold that they receive from killing monsters. 
- At night, monsters will destroy players' creations, causing them to lose a certain amount of gold per every asset destroyed.
- Upon leveling up, players unlock new assets to purchase from the shop.
## GOLD SYSTEM ##
- Players receive gold by defeating monsters, which they can use to purchase either assets or weapons.
- Players will lose a certain amount of gold when a monster destroys one of their assets.
## MONSTER SYSTEM ##
- A random number of monsters will be generated each night. There will be different species of monsters, ranging from low-level monsters to boss monsters.
- Each time a player kills a monster, the respective player will receive gold.
- Monsters will be spread out in random parts of the map using an algorithm.
- The wave of monsters will end after about two to three minutes.

# CLIENT/SERVER NETWORK #
## SUMMARY ##
The frameworks Knit, Roact, and Rodux each control a respective part of the business logic:
- Knit is responsible for installing services on the server-side that manage different aspects of the game. Furthermore, Knit facilitates client-server communication by setting up the controllers for the client-related actions.
- Roact is responsible for the UI JSX components of the client's view. These Roact components contain properties which control certain aspects of the view.
- Rodux is responsible for storing values on the client-side through the Rodux store and updating these values through reducers. Ultimately, on the client, Knit dispatches actions which call on the reducers to update the store with server-sided information regarding the client.
- Roact works with Rodux to map the properties of each component to a state in the store. This allows the Roact components to update themselves each time there is a change in the Rodux store.
## LEVEL SERVICE ##
- On the server-side, the level service controls actions such as adding experience to a user and updating a user's level. The server communicates to the client each time one of these actions occur.
- The client receives the updated user data from the server and dispatches the UpdateProfile action to the Rodux store. The Rodux store then calls on the ProfileReducer to update its respective data.
- The Profile Bar is a Roact component which displays the user's level, experience, and experience cap. The component updates itself with the new user data each time the Rodux store updates.