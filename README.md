# CLPuddle

### **Description:**

Command Line tool for Puddle discord bot. Intended for testing, designing and managing osu puddles. Osu puddles are collections of user created map-pools that store leaderboard data. The intention is to create a system for groups of leaderboards for friends.

### **Goals:**

- Create a system for storing custom leaderboards and pools for OSU
- Command Line tool for accesing the Puddle API
- Puddle Discord BOT **(Future Project)**

### **Planned Features:**

- Each user has a personal pool for local leaderboards, along with up to TBD # of pools at their disposal to host collections of leaderboards for tournaments/challenges ect...
- Baisc Display system for displaying pools & leaderboards with sorting attributes (possible image manipulation)
- OSU APIV2 integration, to validate and upload scores to leaderboards.

### **TODO:**

- Add leaderboard model
- Add score model

### **Current:**

- Create APIHandler for the puddle application to interact with the OSU api. Mainly to learn the structure of the OSUAPI to format the puddle database accordingly.
- Convert the Project into a JS CLI, possibly rust or bash based script for the future.
