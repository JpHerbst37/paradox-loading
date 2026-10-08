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

5. The server addon 1rploading points the server at the page for you
   (https://jpherbst37.github.io/paradox-loading/). Nothing to put in
   server.cfg. To move the page, change URL in
   1rploading/lua/autorun/server/rploading.lua.

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

No YouTube (its player plays adverts nobody can skip). The music is a plain file
in this folder:

1. Put an .mp3 or .ogg next to index.html, e.g. music.mp3 -- UNDER 25 MB
   (GitHub's upload page refuses bigger files; about 20 minutes of music).
2. In config.js set:   MUSIC_FILE: "music.mp3",   and MUSIC_CREDIT for the name.
3. Upload the music file and config.js.

It fades in, loops, and starts somewhere random in the track each time.

Use music you are allowed to put on a website: your own, a track the artist
said yes to, or one with a free licence. A ripped track can get the whole page
taken down.


UPDATING THE WEBSITE
--------------------

1. Open github.com/jpherbst37/paradox-loading
2. Add file > Upload files.
3. Drag in the files you changed. A file with the same name replaces the old one.
4. Commit changes. The page updates in about a minute.


PREVIEW IT ON YOUR PC
---------------------

Opening index.html straight from the folder will not show the scene (browsers
block the other files). Put it online (above), or ask Claude to start the
preview again.
