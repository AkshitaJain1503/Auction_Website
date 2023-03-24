# Auction Website

* This is an online auction website that allows sellers to post their products with details, and schedule the auction. Buyers can buy the products by placing bids.
* The web app comes with a **calendar view** using which the users can see all the deals in a calendar setting, making it easier for them to match their schedule with the auction timings. 
* Products can be sorted according to various **filters** , making it easy for buyers to grab the deals of their choice. 
* An **Auction Space** for every product allows users to see what bids are being placed for the product and various other stats while the auction is going on. 
* Buyers can view the **seller's profile** to see their *past posts* as well as *past purchases* , giving transparency and confidence. 
* There is a **watchlist** where users can add products whose auctions they wish to be notified about. An *email* will be sent to the user once the auction of that product starts. 
* The **real-time chat** feature is enabled to make communication between buyer and seller effective and effortless. 
* In the **My profile** section, the users can view and edit their details such as username/address, etc, and can also view their own past purchases as well as posts.

[Link to the website](https://add_link_here.com)

## Few screenshots from the website: 

Home Page :

![localhost_3000_ (4)](https://user-images.githubusercontent.com/121486345/227543201-ae2baf25-de04-4f40-b55d-0fe3cd3b91f5.png)


Product Details :

![Screenshot (154)](https://user-images.githubusercontent.com/121486345/227550862-2c4371f3-1b10-4bcb-99ec-d5321c8efa9f.png)


Auction Space For a Product :

![Screenshot (159)](https://user-images.githubusercontent.com/121486345/227543518-3389440f-e6ef-4c4f-bb8d-5a4395e56c91.png)


WatchList :

![Screenshot (153)](https://user-images.githubusercontent.com/121486345/227544631-3f91d406-a797-4842-a7ae-6f1b36361156.png)


MyProfile/UserProfile :

![Screenshot (163)](https://user-images.githubusercontent.com/121486345/227552240-445c87d2-9927-4e76-81e3-25ad8670f002.png)


SearchResults : 

![Screenshot (168)](https://user-images.githubusercontent.com/121486345/227552662-9bfce7bf-ff19-4fa8-bf1f-7e8d342a01ca.png)


## Setting up the project on local System:

### Requirements:  
One must have nodeJs installed on the system.  
Download Link: https://nodejs.org/en/download/ (Download the LTS version)

Clone the git repository from the following link : https://github.com/AkshitaJain1503/Auction_Website.git 
Open the project folder on the local system and open three terminals. Run the following commands:  

On the first terminal :
``` 
cd .\server\
npm i
npm start
```

On the second terminal :
``` 
cd .\client\ 
npm i
npm start
```

On the third terminal :
```
cd .\socket\ 
npm i
node index.js
```
