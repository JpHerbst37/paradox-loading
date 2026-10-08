PARADOXVRP LOADING SCREEN
=========================

This folder is a WEB PAGE, not a Garry's Mod addon.
Do NOT upload it to the server's addons folder.

Garry's Mod shows a web page while players join. This page has to be online,
so it goes on GitHub Pages (free).


PUT IT ONLINE (about 10 minutes, once)
--------------------------------------

1. Make a free account at https://github.com  (if you do not have one).

2. Click "New" (new repository).
   Name:  paradox-loading
   Public: yes
   Click "Create repository".

3. Click "uploading an existing file".
   Drag in ALL FOUR files: index.html, config.js, scene.js, clone.jpg
   Click "Commit changes".

4. Open the repository's "Settings", then "Pages" on the left.
   Source: "Deploy from a branch".  Branch: "main", folder "/ (root)".  Save.
   Wait a minute. The page lives at:

       https://YOURNAME.github.io/paradox-loading/

   (YOURNAME = your GitHub name.) Open it in a browser to check.

5. On the game server, in garrysmod/cfg/server.cfg, add this line:

       sv_loadingurl "https://YOURNAME.github.io/paradox-loading/"

6. Restart the server. Join, and you will see it.


CHANGING IT LATER
-----------------

Everything you might want to change is in config.js:
  - the clone's number, the days stranded, the place name
  - the tips at the bottom
  - the music on or off, and how loud
  - SCENE_IMAGE: your own picture instead of the painted scene

Change it, then upload config.js to the repository again (same name, it replaces
the old one). The game picks it up within a minute or two.


USING YOUR OWN PICTURE
----------------------

1. Make your render (1920 x 1080 is best). Save it as campfire.png (or .jpg).
2. Upload it to the repository next to index.html.
3. In config.js set:   SCENE_IMAGE: "campfire.png",
4. Upload config.js again.

The cracked visor, REC, the clock, battery, signal, grain and glitches all stay on
top of your picture.


THE MUSIC
---------

"4 Hours of Post Apocalyptic Acoustic Guitar (S.T.A.L.K.E.R./Metro Inspired with
campfire ambience)" by Joe Mathews, played with YouTube's own player in the
AUDIO LOG window. YouTube's rules say its player must be shown, not hidden,
so it stays visible. It starts at a random point in the four hours each time.

If the video is ever removed or embedding is switched off, the window simply
disappears and the page carries on without music.


PREVIEW IT ON YOUR PC
---------------------

Opening index.html straight from the folder will not show the scene (browsers
block the other files). Put it online (above), or ask Claude to start the
preview again.
