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
- The Profile Bar is a Roact component that displays the user's level, experience, and experience cap. The component updates its respective properties with the new user data each time the Rodux store updates.
## GOLD SERVICE ##
- On the server-side, the gold service controls actions such as adding/deducting gold to/from a user. The server communicates to the client each time one of these actions occur.
- The client receives the updated gold amount from the server and dispatches the UpdateGold action to the Rodux store. The Rodux store then calls on the GoldReducer to update the gold amount in the store.
- The Gold Container is a Roact component that displays the user's gold. The component updates its textlabel that displays the user's gold each time the Rodux store updates.
- Additionally, the gold container has a toggle button that handles displays the Shop component.
## SHOP SERVICE ##
- On the server-side, the shop service controls actions such as fetching and purchasing shop items. The server communicates to the client each time one of these actions occur.
- When the FetchedItem function runs, the client receives the fetched items. When the PurchaseItem function runs, the client receives a response from the server displaying the status of the purchase.
- The Shop container is a Roact Component that displays a ShopItem component per every item in its ShopItems property. 
- The ShopItem component allows users to purchase items. After the user presses the purchase button, the component dispatches the onPurchase action, which uses Rodux thunk to call another function that calls the Shop Service's Purchase Item function.
- The Purchase Item function in the Shop Service requests the purchase from the ShopService on the server. 
- On the server-side, the purchase item function in the Shop Service decides if the user can purchase the item by using the Gold and Inventory services. If the purchase is valid, the function calls on the Inventory service to add the item to the user's inventory and returns a successful response to the client.
- If the purchase is rejected by the server, the client receives a failed response from the server, and this is displayed on the respective ShopItem component.
- The list of shop items is found in the shop folder, and its data can be modified to implement new items and new categories of items.
## INVENTORY SERVICE ##
- On the server-side, the inventory service controls actions such as fetching or adding an item to a user's inventory and equipping an item. The server communicates to the client each time one of these actions occur.
- When the FetchInventory function runs, the client receives the user's inventory from the server and dispatches the updateInventory action, calling on the InventoryReducer to update the user's inventory in the Rodux store.
- When the EquipItem function runs, the client receives the user's new equipped items from the server and dispatches the equipItem function, calling on the InventoryReducer to update the user's equipped items in the Rodux store.
- When the AddToInventory function runs, the server adds the new item to the user's inventory. Following that, the client updates the Rodux store by dispatching the updateInventory action.
- The Inventory container is a Roact component that displays an InventoryItem component per every item in its Inventory property. Furthermore, the Inventory container contains InventoryTab components that allow the user to switch between different categories of items in their inventory.
- The InventoryItem component enables the user to equip an item per each category. After the user presses the qeuip button, the component dispatches the onEquip action, which uses Rodux thunk to call another function that calls the Inventory Service's Equip Item function.
- The Equip Item function in the Inventory Service requests the server-sided Inventory Service to update the user's equipped items and receives the user's newly updated items. Then, this function dispatches the equipItem action, which calls on the InventoryReducer to update the user's equipped items in the Rodux store.
- The InventoryItem component then re-renders to display that the user has successfully equipped the respective item.
