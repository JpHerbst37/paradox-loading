/* ============================================================================
   PARADOXVRP LOADING SCREEN -- THE FOOTAGE

   A clone helmet camera, the visor cracked, lying in the Wasskah jungle (the
   moon over Kashyyyk where the Trandoshans hunted Ahsoka and the
   younglings). Across a campfire a stranded clone sits on a log playing a
   guitar, his rifle against a tree, fog in the trees, fireflies, Kashyyyk
   hanging in a gap in the canopy.

   Everything is painted by this file -- no pictures needed. LOADING.SCENE_IMAGE
   (config.js) swaps the painting for your own picture and keeps the camera
   effects on top.

   Written for old browsers too (Garry's Mod's main branch uses an old one):
   no arrow functions, no let/const.
   ============================================================================ */

var Scene = (function () {

	var W = 1920, H = 1080;

	var canvas, ctx, cw = 0, ch = 0, scale = 1, ox = 0, oy = 0;

	var back, middle, figDark, figLit, hearth, front, visor, cracks, scan, fog;
	var grain = [];

	var photo = null;

	/* a picture was asked for: the painted scene is never drawn, not even while the picture loads */
	var wantPhoto = false;

	var FIRE_X = 960, FIRE_Y = 858;

	var flies = [], embers = [], smoke = [];

	var startedAt = now();

	var glitch = { until: 0, next: now() + 6000, kind: 0 };

	var strum = { bpm: 72, at: 0 };

	function now() { return (window.performance && performance.now) ? performance.now() : new Date().getTime(); }

	function rng(seed) {
		var s = seed >>> 0;

		return function () {
			s = (Math.imul ? (Math.imul(s, 1664525) + 1013904223) : (s * 1664525 + 1013904223)) >>> 0;

			return s / 4294967296;
		};
	}

	function make(w, h) {
		var c = document.createElement("canvas");

		c.width = Math.max(1, Math.floor(w));
		c.height = Math.max(1, Math.floor(h));

		return c;
	}

	/* an offscreen canvas the size of the screen, drawn on in the 1920 x 1080 design space */
	function layer() {
		var c = make(cw, ch);
		var g = c.getContext("2d");

		g.setTransform(scale, 0, 0, scale, ox, oy);

		return { c: c, g: g };
	}

	function ellipse(g, x, y, rx, ry) {
		g.save();
		g.translate(x, y);
		g.scale(rx, ry);
		g.beginPath();
		g.arc(0, 0, 1, 0, Math.PI * 2);
		g.restore();
	}

	function poly(g, pts) {
		g.beginPath();
		g.moveTo(pts[0], pts[1]);

		for (var i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);

		g.closePath();
	}

	/* ------------------------------------------------------------------------
	   THE BACK: sky, Kashyyyk, canopy, trees, fog, ground
	   ------------------------------------------------------------------------ */

	function trunk(g, R, x, w, top, bottom, colour, flare) {
		var lean = (R() - 0.5) * w * 0.4;

		g.fillStyle = colour;
		g.beginPath();
		g.moveTo(x - w / 2 + lean, top);
		g.bezierCurveTo(x - w / 2 + lean * 0.5, (top + bottom) / 2, x - w / 2, bottom - flare * 1.6, x - w / 2 - flare, bottom);
		g.lineTo(x + w / 2 + flare, bottom);
		g.bezierCurveTo(x + w / 2, bottom - flare * 1.6, x + w / 2 + lean * 0.5, (top + bottom) / 2, x + w / 2 + lean, top);
		g.closePath();
		g.fill();

		/* roots spreading over the ground */
		for (var k = 0; k < 4; k++) {
			var side = k % 2 === 0 ? -1 : 1;
			var rx = x + side * (w * 0.3 + R() * w * 0.3);

			g.beginPath();
			g.moveTo(rx - 10, bottom - 30 - R() * 40);
			g.quadraticCurveTo(rx + side * (40 + R() * 60), bottom - 6, rx + side * (90 + R() * 120), bottom + 4);
			g.lineTo(rx + side * (60 + R() * 60), bottom + 6);
			g.quadraticCurveTo(rx + side * 20, bottom - 4, rx + 10, bottom - 20);
			g.closePath();
			g.fill();
		}

		/* bark: long faint grooves */
		g.strokeStyle = "rgba(0,0,0,0.35)";
		g.lineWidth = 2;

		for (var b = 0; b < w / 14; b++) {
			var bx = x - w / 2 + 6 + R() * (w - 12);

			g.beginPath();
			g.moveTo(bx, top + R() * 200);
			g.bezierCurveTo(bx + (R() - 0.5) * 10, top + 300, bx + (R() - 0.5) * 14, bottom - 200, bx + (R() - 0.5) * 8, bottom - 20);
			g.stroke();
		}
	}

	function vine(g, R, x, top, len, colour) {
		g.strokeStyle = colour;
		g.lineWidth = 1.5 + R() * 2;

		var sway = (R() - 0.5) * 50;

		g.beginPath();
		g.moveTo(x, top);
		g.bezierCurveTo(x + sway, top + len * 0.3, x - sway, top + len * 0.7, x + sway * 0.3, top + len);
		g.stroke();

		/* moss hanging off it */
		g.fillStyle = colour;

		for (var i = 0; i < len / 30; i++) {
			var f = i / (len / 30);
			var mx = x + sway * Math.sin(f * 3) * 0.4;

			ellipse(g, mx + (R() - 0.5) * 8, top + f * len, 3 + R() * 5, 6 + R() * 10);
			g.fill();
		}
	}

	function paintBack() {
		var L = layer(), g = L.g, R = rng(1977);

		/* night sky through the trees */
		var sky = g.createLinearGradient(0, 0, 0, 760);

		sky.addColorStop(0, "#050a0e");
		sky.addColorStop(0.55, "#0b171b");
		sky.addColorStop(1, "#10201f");

		g.fillStyle = sky;
		g.fillRect(-200, -200, W + 400, H + 400);

		/* KASHYYYK, hanging over its moon, lit from the upper right */
		var px = 1230, py = 175, pr = 270;

		var body = g.createRadialGradient(px + 120, py - 90, 20, px, py, pr);

		body.addColorStop(0, "rgba(150,196,160,0.55)");
		body.addColorStop(0.45, "rgba(70,118,96,0.42)");
		body.addColorStop(0.85, "rgba(26,52,46,0.30)");
		body.addColorStop(1, "rgba(14,30,28,0.0)");

		g.fillStyle = body;
		g.beginPath();
		g.arc(px, py, pr, 0, Math.PI * 2);
		g.fill();

		/* cloud bands across it */
		g.save();
		g.beginPath();
		g.arc(px, py, pr * 0.97, 0, Math.PI * 2);
		g.clip();

		for (var c = 0; c < 16; c++) {
			g.fillStyle = "rgba(200,225,210," + (0.03 + R() * 0.05) + ")";
			ellipse(g, px - pr + R() * pr * 2, py - pr + R() * pr * 2, 60 + R() * 140, 6 + R() * 14);
			g.fill();
		}

		g.restore();

		/* its atmosphere */
		var halo = g.createRadialGradient(px, py, pr * 0.92, px, py, pr * 1.25);

		halo.addColorStop(0, "rgba(120,190,170,0.16)");
		halo.addColorStop(1, "rgba(120,190,170,0)");

		g.fillStyle = halo;
		g.beginPath();
		g.arc(px, py, pr * 1.25, 0, Math.PI * 2);
		g.fill();

		/* stars between the leaves */
		for (var s = 0; s < 120; s++) {
			g.fillStyle = "rgba(220,235,240," + (0.2 + R() * 0.5) + ")";
			g.fillRect(R() * W, R() * 420, 1.5, 1.5);
		}

		/* FAR TREES, deep in the fog */
		for (var f = 0; f < 11; f++) {
			trunk(g, R, R() * W, 50 + R() * 90, -60, 720 + R() * 30, "#0f1e21", 20);
		}

		/* fog between the far trees and the near ones */
		var mist = g.createLinearGradient(0, 380, 0, 820);

		mist.addColorStop(0, "rgba(110,140,140,0)");
		mist.addColorStop(0.55, "rgba(120,150,150,0.32)");
		mist.addColorStop(1, "rgba(110,140,140,0.06)");

		g.fillStyle = mist;
		g.fillRect(-200, 380, W + 400, 440);

		/* the canopy over everything, with the gap Kashyyyk shows through */
		g.fillStyle = "#020405";

		for (var x = -120; x < W + 120; x += 34) {
			var cy = 40 + R() * 160;

			var dx = x - px, dy = cy - py;

			if (Math.sqrt(dx * dx + dy * dy) < pr * 0.82 + R() * 60) continue;

			ellipse(g, x, cy, 70 + R() * 110, 50 + R() * 90);
			g.fill();
		}

		/* leaf edges round the gap */
		for (var e = 0; e < 260; e++) {
			var a = R() * Math.PI * 2;
			var rr = pr * (0.8 + R() * 0.35);
			var lx = px + Math.cos(a) * rr, ly = py + Math.sin(a) * rr * 0.9;

			if (ly < 380) {
				ellipse(g, lx, ly, 8 + R() * 20, 4 + R() * 8);
				g.fill();
			}
		}

		/* vines and moss hanging into the clearing */
		for (var v = 0; v < 26; v++) {
			vine(g, R, R() * W, 120 + R() * 120, 140 + R() * 380, v % 3 === 0 ? "#0c1a17" : "#050b0b");
		}

		/* FAR AWAY, SO SOFT: the lens is focused on him, not on the forest */
		back = soften(L.c, 5);

		/* THE MIDDLE DISTANCE, a little soft: the trees round the clearing, the ground */
		var M = layer();

		g = M.g;

		/* MID TREES: the clearing's walls */
		var mids = [[150, 240], [520, 120], [1365, 150], [1720, 260], [1040, 70], [760, 60]];

		for (var m = 0; m < mids.length; m++) {
			trunk(g, R, mids[m][0], mids[m][1], -80, 790 + R() * 20, m < 4 ? "#071013" : "#0b1619", 40);
		}

		/* THE GROUND */
		var ground = g.createLinearGradient(0, 740, 0, H);

		ground.addColorStop(0, "#0a1210");
		ground.addColorStop(0.35, "#070b09");
		ground.addColorStop(1, "#020303");

		g.fillStyle = ground;
		g.beginPath();
		g.moveTo(-200, 780);
		g.quadraticCurveTo(W / 2, 735, W + 200, 790);
		g.lineTo(W + 200, H + 200);
		g.lineTo(-200, H + 200);
		g.closePath();
		g.fill();

		/* leaf litter and stones */
		for (var l = 0; l < 500; l++) {
			var gy = 770 + Math.pow(R(), 0.7) * 320;

			g.fillStyle = "rgba(" + Math.floor(20 + R() * 25) + "," + Math.floor(24 + R() * 25) + "," + Math.floor(16 + R() * 14) + "," + (0.25 + R() * 0.4) + ")";
			ellipse(g, R() * W, gy, 2 + R() * 9, 1 + R() * 3);
			g.fill();
		}

		/* ferns along the foot of the trees */
		g.strokeStyle = "#060c0a";

		for (var p = 0; p < 70; p++) {
			var fx = R() * W, fy = 770 + R() * 40;

			if (Math.abs(fx - 900) < 260 && R() < 0.8) continue;

			fern(g, R, fx, fy, 50 + R() * 90, (R() - 0.5) * 1.6, "#06100c");
		}

		middle = soften(M.c, 2);
	}

	/*
		OUT OF FOCUS, the cheap way that works in old browsers too: shrink the
		picture and grow it back, twice, letting the browser's smoothing do
		the blurring.
	*/
	function soften(src, factor) {
		var w1 = Math.max(1, Math.floor(src.width / factor)), h1 = Math.max(1, Math.floor(src.height / factor));
		var w2 = Math.max(1, Math.floor(w1 / 2)), h2 = Math.max(1, Math.floor(h1 / 2));

		var a = make(w1, h1), ag = a.getContext("2d");

		ag.drawImage(src, 0, 0, w1, h1);

		var b = make(w2, h2);

		b.getContext("2d").drawImage(a, 0, 0, w2, h2);

		ag.clearRect(0, 0, w1, h1);
		ag.drawImage(b, 0, 0, w1, h1);

		var out = make(src.width, src.height);

		out.getContext("2d").drawImage(a, 0, 0, src.width, src.height);

		return out;
	}

	function fern(g, R, x, y, len, bend, colour) {
		g.strokeStyle = colour;
		g.fillStyle = colour;
		g.lineWidth = 2;

		var tipX = x + Math.sin(bend) * len, tipY = y - Math.cos(bend) * len;
		var ctlX = x + Math.sin(bend * 0.4) * len * 0.6, ctlY = y - len * 0.8;

		g.beginPath();
		g.moveTo(x, y);
		g.quadraticCurveTo(ctlX, ctlY, tipX, tipY);
		g.stroke();

		for (var i = 1; i < 12; i++) {
			var f = i / 12;
			var qx = (1 - f) * (1 - f) * x + 2 * (1 - f) * f * ctlX + f * f * tipX;
			var qy = (1 - f) * (1 - f) * y + 2 * (1 - f) * f * ctlY + f * f * tipY;
			var leaf = (1 - f) * len * 0.28 + 4;

			ellipse(g, qx - leaf * 0.5, qy + 2, leaf * 0.55, 3);
			g.fill();
			ellipse(g, qx + leaf * 0.5, qy + 2, leaf * 0.55, 3);
			g.fill();
		}
	}

	/* ------------------------------------------------------------------------
	   THE CLONE, his guitar and his rifle -- painted twice: in the dark, and
	   lit by the fire. The frame blends the two as the fire flickers.
	   ------------------------------------------------------------------------ */

	function paintFigure(lit) {
		var L = layer(), g = L.g, R = rng(501);

		var armour = lit ? "#ffd9b0" : "#15191b";
		var shade = lit ? "#c4936a" : "#0f1213";
		var suit = lit ? "#3a2a1e" : "#08090a";
		var mark = lit ? "#6a96d8" : "#0f1828";
		var visorCol = "#05070a";
		var wood = lit ? "#b8703a" : "#140d08";
		var woodDark = lit ? "#5e3416" : "#0b0705";
		var metal = lit ? "#6a5f55" : "#0c0e0f";
		var boot = lit ? "#4a4038" : "#0a0b0c";

		/* THE LOG he sits on */
		g.fillStyle = lit ? "#4a3220" : "#120d09";
		ellipse(g, 880, 776, 215, 24);
		g.fill();
		g.fillRect(665, 752, 430, 24);
		g.fillStyle = lit ? "#6c4a30" : "#1a130d";
		ellipse(g, 1095, 764, 16, 23);
		g.fill();

		/* HIS RIFLE, a DC-15A, leaning into the tree on the right */
		g.save();
		g.translate(1252, 812);
		g.rotate(0.23);
		g.fillStyle = metal;
		poly(g, [-8, 0, 8, 0, 6, -42, -10, -46]);
		g.fill();
		g.fillRect(-9, -112, 18, 70);
		g.fillRect(-20, -92, 11, 30);
		g.fillRect(-6, -188, 12, 78);
		g.fillRect(-3, -214, 6, 28);
		g.fillRect(-5, -220, 10, 7);
		g.fillRect(9, -142, 8, 34);
		g.fillRect(7, -128, 4, 6);
		g.fillStyle = lit ? "rgba(255,190,130,0.35)" : "rgba(255,255,255,0.04)";
		g.fillRect(-6, -186, 2, 74);
		g.fillRect(-9, -110, 2, 66);
		g.restore();

		/* LEGS: knees toward us, shins down behind the fire */
		g.fillStyle = armour;
		poly(g, [838, 726, 872, 726, 868, 786, 826, 786]);
		g.fill();
		poly(g, [892, 726, 928, 726, 940, 786, 898, 786]);
		g.fill();

		g.fillStyle = shade;
		ellipse(g, 846, 792, 20, 13);
		g.fill();
		ellipse(g, 920, 792, 20, 13);
		g.fill();

		g.fillStyle = armour;
		poly(g, [830, 800, 862, 800, 858, 850, 834, 850]);
		g.fill();
		poly(g, [904, 800, 936, 800, 934, 850, 906, 850]);
		g.fill();

		g.fillStyle = boot;
		g.fillRect(828, 848, 36, 15);
		g.fillRect(902, 848, 36, 15);

		/* TORSO, leaning over the guitar */
		g.fillStyle = suit;
		poly(g, [850, 604, 916, 604, 914, 728, 852, 728]);
		g.fill();

		g.fillStyle = armour;
		poly(g, [848, 610, 918, 610, 912, 680, 883, 688, 854, 680]);
		g.fill();

		g.fillStyle = shade;
		poly(g, [882, 614, 885, 614, 884, 684, 881, 684]);
		g.fill();

		g.fillStyle = armour;
		poly(g, [862, 690, 904, 690, 900, 708, 866, 708]);
		g.fill();

		g.fillStyle = lit ? "#2e2a28" : "#0b0d0e";
		g.fillRect(846, 712, 74, 14);

		/* shoulders; his left one in the 501st's blue, faded */
		g.fillStyle = armour;
		ellipse(g, 840, 618, 24, 17);
		g.fill();
		g.fillStyle = mark;
		ellipse(g, 926, 618, 24, 17);
		g.fill();

		/* UPPER ARMS */
		g.fillStyle = armour;
		poly(g, [826, 622, 850, 628, 834, 694, 812, 688]);
		g.fill();
		poly(g, [916, 626, 940, 622, 970, 684, 948, 692]);
		g.fill();

		/* his left forearm, up to the neck of the guitar */
		g.fillStyle = suit;
		ellipse(g, 958, 690, 11, 9);
		g.fill();
		g.fillStyle = armour;
		poly(g, [946, 692, 966, 682, 1004, 662, 992, 654]);
		g.fill();

		/* THE GUITAR across his lap */
		g.save();
		g.translate(846, 728);
		g.rotate(-0.38);

		g.fillStyle = wood;
		ellipse(g, -24, 6, 46, 40);
		g.fill();
		ellipse(g, 28, 0, 34, 30);
		g.fill();
		g.fillRect(-22, -20, 52, 44);

		g.fillStyle = woodDark;
		ellipse(g, 6, 2, 11, 11);
		g.fill();
		g.fillRect(-46, -6, 8, 16);

		g.fillStyle = lit ? "#4a2a14" : "#140b06";
		g.fillRect(58, -6, 152, 12);
		g.fillRect(208, -9, 32, 18);

		g.strokeStyle = lit ? "rgba(255,236,200,0.6)" : "rgba(140,140,140,0.18)";
		g.lineWidth = 0.6;

		for (var s = -3; s <= 3; s++) {
			g.beginPath();
			g.moveTo(-42, s * 1.4);
			g.lineTo(212, s * 1.1);
			g.stroke();
		}

		g.restore();

		/* the hand on the neck */
		g.fillStyle = suit;
		ellipse(g, 1000, 659, 9, 8);
		g.fill();

		/* HEAD, bowed over the strings: a Phase 2 helmet, the dome striped blue */
		g.fillStyle = suit;
		g.fillRect(873, 588, 20, 24);

		g.fillStyle = armour;
		ellipse(g, 884, 566, 29, 32);
		g.fill();
		poly(g, [858, 570, 910, 570, 906, 600, 894, 610, 874, 610, 862, 600]);
		g.fill();

		g.fillStyle = mark;
		poly(g, [879, 535, 889, 535, 890, 566, 878, 566]);
		g.fill();

		g.fillStyle = shade;
		poly(g, [862, 590, 873, 590, 872, 606, 864, 600]);
		g.fill();
		poly(g, [895, 590, 906, 590, 904, 600, 896, 606]);
		g.fill();

		g.fillStyle = visorCol;
		poly(g, [860, 574, 908, 574, 906, 584, 889, 585, 889, 603, 879, 603, 879, 585, 862, 584]);
		g.fill();

		/* wear and dirt */
		g.strokeStyle = lit ? "rgba(70,40,20,0.5)" : "rgba(0,0,0,0.4)";
		g.lineWidth = 1.2;

		for (var d = 0; d < 50; d++) {
			var sx = 830 + R() * 110, sy = 540 + R() * 310;

			g.beginPath();
			g.moveTo(sx, sy);
			g.lineTo(sx + (R() - 0.5) * 9, sy + (R() - 0.5) * 6);
			g.stroke();
		}

		if (lit) {
			/* firelight comes from below and in front: strong low down, gone by the shoulders */
			g.globalCompositeOperation = "source-atop";

			var fall = g.createLinearGradient(0, 520, 0, 870);

			fall.addColorStop(0, "rgba(0,0,0,0.9)");
			fall.addColorStop(0.38, "rgba(0,0,0,0.6)");
			fall.addColorStop(0.7, "rgba(0,0,0,0.15)");
			fall.addColorStop(1, "rgba(255,150,70,0.22)");

			g.fillStyle = fall;
			g.fillRect(600, 500, 800, 400);

			/* a little more light on the side facing the fire (his left, our right) */
			var side = g.createLinearGradient(820, 0, 1000, 0);

			side.addColorStop(0, "rgba(0,0,0,0.25)");
			side.addColorStop(1, "rgba(255,170,90,0.12)");

			g.fillStyle = side;
			g.fillRect(600, 500, 800, 400);

			g.globalCompositeOperation = "source-over";

			/* rim light along the edges the fire catches */
			g.strokeStyle = "rgba(255,190,120,0.55)";
			g.lineWidth = 1.5;

			g.beginPath();
			g.moveTo(862, 601); g.lineTo(874, 611); g.lineTo(894, 611); g.lineTo(906, 601);
			g.moveTo(854, 681); g.lineTo(883, 689); g.lineTo(912, 681);
			g.moveTo(828, 786); g.lineTo(868, 786);
			g.moveTo(898, 786); g.lineTo(940, 786);
			g.moveTo(834, 850); g.lineTo(858, 850);
			g.moveTo(906, 850); g.lineTo(934, 850);
			g.stroke();
		}

		return L.c;
	}

	/* ------------------------------------------------------------------------
	   THE FRONT: big fern fronds close to the camera, and the stones round
	   the fire with its logs
	   ------------------------------------------------------------------------ */

	function paintFront() {
		var L = layer(), g = L.g, R = rng(66);

		/* stones round the fire */
		for (var i = 0; i < 13; i++) {
			var a = i / 13 * Math.PI * 2;
			var sx = FIRE_X + Math.cos(a) * 92, sy = FIRE_Y + 16 + Math.sin(a) * 26;

			var stone = g.createLinearGradient(0, sy - 14, 0, sy + 12);

			stone.addColorStop(0, "#57504a");
			stone.addColorStop(1, "#1b1917");

			g.fillStyle = stone;
			ellipse(g, sx, sy, 18 + R() * 8, 11 + R() * 5);
			g.fill();
		}

		/* the logs in the fire */
		g.fillStyle = "#1a0f08";
		g.save();
		g.translate(FIRE_X, FIRE_Y + 10);
		g.rotate(0.35);
		g.fillRect(-80, -9, 160, 18);
		g.rotate(-0.7);
		g.fillRect(-80, -9, 160, 18);
		g.restore();

		/* glowing charcoal */
		for (var c = 0; c < 40; c++) {
			g.fillStyle = "rgba(255," + Math.floor(70 + R() * 90) + ",20," + (0.4 + R() * 0.5) + ")";
			ellipse(g, FIRE_X + (R() - 0.5) * 120, FIRE_Y + 12 + (R() - 0.5) * 16, 2 + R() * 4, 1 + R() * 2);
			g.fill();
		}

		/* the fire's stones and logs are as far away as he is: sharp */
		hearth = L.c;

		/* fern fronds right in front of the camera: well out of focus */
		var F = layer();

		g = F.g;

		var near = "rgba(3,8,6,0.97)";

		for (var f = 0; f < 9; f++) {
			fern(g, R, 60 + R() * 300, 1120, 260 + R() * 220, -0.2 + R() * 1.0, near);
			fern(g, R, 1560 + R() * 340, 1120, 260 + R() * 220, -0.8 + R() * 1.0, near);
		}

		front = soften(F.c, 7);
	}

	/* ------------------------------------------------------------------------
	   THE HELMET: the inside edges of the visor, and the crack across it
	   ------------------------------------------------------------------------ */

	function paintVisor() {
		var c = make(cw, ch), g = c.getContext("2d");

		/* over a picture the helmet edges are only a hint, so they do not hide it */
		var soft = wantPhoto ? 0.3 : 1;

		/* drawn in screen space: the visor does not sway, the world does */
		var w = cw, h = ch;

		var brow = g.createLinearGradient(0, 0, 0, h * 0.16);

		brow.addColorStop(0, "rgba(0,0,0," + (0.85 * soft) + ")");
		brow.addColorStop(1, "rgba(0,0,0,0)");

		g.fillStyle = brow;
		g.fillRect(0, 0, w, h * 0.16);

		/* the cheek plates either side of the T */
		function cheek(left) {
			var x0 = left ? 0 : w;
			var dir = left ? 1 : -1;

			var grad = g.createLinearGradient(x0, h, x0 + dir * w * 0.3, h * 0.62);

			grad.addColorStop(0, "rgba(0,0,0," + (0.92 * soft) + ")");
			grad.addColorStop(0.55, "rgba(0,0,0," + (0.35 * soft) + ")");
			grad.addColorStop(1, "rgba(0,0,0,0)");

			g.fillStyle = grad;
			g.beginPath();
			g.moveTo(x0, h * 0.5);
			g.quadraticCurveTo(x0 + dir * w * 0.2, h * 0.72, x0 + dir * w * 0.36, h);
			g.lineTo(x0, h);
			g.closePath();
			g.fill();
		}

		cheek(true);
		cheek(false);

		var vig = g.createRadialGradient(w / 2, h * 0.48, h * 0.32, w / 2, h * 0.5, h * 0.95);

		vig.addColorStop(0, "rgba(0,0,0,0)");
		vig.addColorStop(1, "rgba(0,0,0," + (wantPhoto ? 0.5 : 0.7) + ")");

		g.fillStyle = vig;
		g.fillRect(0, 0, w, h);

		visor = c;
	}

	function paintCracks() {
		var c = make(cw, ch), g = c.getContext("2d"), R = rng(7734);

		var k = cw / W;

		var ix = cw * 0.78, iy = ch * 0.27;

		function crackLine(x, y, angle, length, width, branches) {
			var px = x, py = y;

			var steps = Math.floor(length / (14 * k)) + 2;

			g.lineWidth = width;
			g.beginPath();
			g.moveTo(px, py);

			for (var s = 0; s < steps; s++) {
				angle += (R() - 0.5) * 0.35;

				px += Math.cos(angle) * length / steps;
				py += Math.sin(angle) * length / steps;

				g.lineTo(px, py);

				if (branches > 0 && R() < 0.12) {
					g.stroke();

					crackLine(px, py, angle + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.7), length * (0.2 + R() * 0.3), width * 0.7, branches - 1);

					g.lineWidth = width;
					g.beginPath();
					g.moveTo(px, py);
				}
			}

			g.stroke();
		}

		/* a dark shadow under each line, then the bright edge */
		for (var pass = 0; pass < 2; pass++) {
			R = rng(7734);

			g.save();

			if (pass === 0) {
				g.translate(1.5 * k, 1.5 * k);
				g.strokeStyle = "rgba(0,0,0,0.55)";
			} else {
				g.strokeStyle = "rgba(225,240,245,0.32)";
			}

			var spokes = 14;

			for (var i = 0; i < spokes; i++) {
				var a = i / spokes * Math.PI * 2 + R() * 0.3;

				crackLine(ix, iy, a, (60 + R() * 240) * k, 1.3 * k, 2);
			}

			/* the long one across the top of the glass */
			crackLine(ix, iy, Math.PI * 1.03, cw * 0.4, 1.1 * k, 3);

			/* rings round the hit */
			for (var r = 1; r <= 3; r++) {
				g.lineWidth = 1 * k;
				g.beginPath();

				for (var j = 0; j <= 24; j++) {
					var aa = j / 24 * Math.PI * 2;
					var rad = (r * 26 + (R() - 0.5) * 10) * k;

					var qx = ix + Math.cos(aa) * rad, qy = iy + Math.sin(aa) * rad;

					if (j === 0) g.moveTo(qx, qy); else if (R() < 0.75) g.lineTo(qx, qy); else g.moveTo(qx, qy);
				}

				g.stroke();
			}

			g.restore();
		}

		/* the crushed glass at the point of impact */
		var hit = g.createRadialGradient(ix, iy, 0, ix, iy, 36 * k);

		hit.addColorStop(0, "rgba(235,245,250,0.55)");
		hit.addColorStop(1, "rgba(235,245,250,0)");

		g.fillStyle = hit;
		g.beginPath();
		g.arc(ix, iy, 36 * k, 0, Math.PI * 2);
		g.fill();

		/* smudges on the glass */
		for (var s = 0; s < 18; s++) {
			var sm = g.createRadialGradient(0, 0, 0, 0, 0, 1);

			sm.addColorStop(0, "rgba(180,170,150,0.05)");
			sm.addColorStop(1, "rgba(180,170,150,0)");

			g.save();
			g.translate(R() * cw, R() * ch);
			g.scale((40 + R() * 160) * k, (20 + R() * 80) * k);
			g.fillStyle = sm;
			g.beginPath();
			g.arc(0, 0, 1, 0, Math.PI * 2);
			g.fill();
			g.restore();
		}

		cracks = c;
	}

	function paintGrain() {
		grain = [];

		for (var n = 0; n < 4; n++) {
			var c = make(256, 256), g = c.getContext("2d");

			var img = g.createImageData(256, 256), d = img.data;

			for (var i = 0; i < d.length; i += 4) {
				var v = Math.floor(Math.random() * 255);

				d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
			}

			g.putImageData(img, 0, 0);

			grain.push(c);
		}

		scan = make(4, 4);

		var sg = scan.getContext("2d");

		sg.fillStyle = "rgba(0,0,0,0.22)";
		sg.fillRect(0, 0, 4, 1);
	}

	function paintFog() {
		fog = make(1024, 256);

		var g = fog.getContext("2d"), R = rng(4242);

		for (var i = 0; i < 70; i++) {
			var x = R() * 1024, y = 60 + R() * 140, r = 40 + R() * 120;

			var b = g.createRadialGradient(x, y, 0, x, y, r);

			b.addColorStop(0, "rgba(160,185,180,0.16)");
			b.addColorStop(1, "rgba(150,175,170,0)");

			g.fillStyle = b;
			g.fillRect(x - r, y - r, r * 2, r * 2);

			/* wrap round so it tiles */
			g.save();
			g.translate(x < 512 ? 1024 : -1024, 0);
			g.fillRect(x - r, y - r, r * 2, r * 2);
			g.restore();
		}
	}

	/* ------------------------------------------------------------------------
	   THINGS THAT MOVE
	   ------------------------------------------------------------------------ */

	function seedLife() {
		var R = rng(99);

		flies = [];

		for (var i = 0; i < 55; i++) {
			flies.push({
				x: R() * W, y: 300 + R() * 560,
				vx: (R() - 0.5) * 12, vy: (R() - 0.5) * 8,
				phase: R() * 10, speed: 0.6 + R() * 1.6, size: 1.5 + R() * 2.2
			});
		}
	}

	function flame(t, i) {
		var spread = (i - 3) * 17;
		var x = FIRE_X + spread;

		var h = 70 + 46 * Math.sin(t * 6.3 + i * 1.7) * Math.sin(t * 2.1 + i) + 40 * Math.abs(Math.sin(t * 11 + i * 3.1));

		h *= 1 - Math.abs(i - 3) * 0.17;

		var sway = Math.sin(t * 3.4 + i) * 9 + Math.sin(t * 7.1 + i * 2) * 4;

		var w = 26 - Math.abs(i - 3) * 3;

		return { x: x, h: h, sway: sway, w: w };
	}

	function drawFire(g, t, glowK) {
		g.save();
		g.globalCompositeOperation = "lighter";

		/* the light it throws on everything */
		var r = 560 * glowK;

		var glow = g.createRadialGradient(FIRE_X, FIRE_Y - 30, 10, FIRE_X, FIRE_Y - 30, r);

		glow.addColorStop(0, "rgba(255,150,60,0.42)");
		glow.addColorStop(0.25, "rgba(255,110,40,0.18)");
		glow.addColorStop(1, "rgba(255,90,30,0)");

		g.fillStyle = glow;
		g.fillRect(FIRE_X - r, FIRE_Y - 30 - r, r * 2, r * 2);

		/* the flames */
		for (var i = 0; i < 7; i++) {
			var f = flame(t, i);

			var grad = g.createLinearGradient(0, FIRE_Y, 0, FIRE_Y - f.h);

			grad.addColorStop(0, "rgba(255,240,190,0.85)");
			grad.addColorStop(0.3, "rgba(255,170,60,0.75)");
			grad.addColorStop(0.75, "rgba(220,70,20,0.45)");
			grad.addColorStop(1, "rgba(160,30,10,0)");

			g.fillStyle = grad;
			g.beginPath();
			g.moveTo(f.x - f.w, FIRE_Y + 4);
			g.bezierCurveTo(f.x - f.w, FIRE_Y - f.h * 0.4, f.x + f.sway - f.w * 0.3, FIRE_Y - f.h * 0.7, f.x + f.sway, FIRE_Y - f.h);
			g.bezierCurveTo(f.x + f.sway + f.w * 0.3, FIRE_Y - f.h * 0.7, f.x + f.w, FIRE_Y - f.h * 0.4, f.x + f.w, FIRE_Y + 4);
			g.closePath();
			g.fill();
		}

		/* embers rising */
		for (var e = 0; e < embers.length; e++) {
			var em = embers[e];

			var a = Math.max(0, 1 - em.age / em.life);

			g.fillStyle = "rgba(255," + Math.floor(120 + 100 * a) + ",40," + (a * 0.9) + ")";
			g.fillRect(em.x, em.y, 2.2, 2.2);
		}

		g.restore();

		/* smoke, a dark haze climbing out of it */
		for (var s = 0; s < smoke.length; s++) {
			var sm = smoke[s];

			var sa = Math.max(0, 1 - sm.age / sm.life);

			var sg = g.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, sm.r);

			sg.addColorStop(0, "rgba(60,60,58," + (0.10 * sa) + ")");
			sg.addColorStop(1, "rgba(60,60,58,0)");

			g.fillStyle = sg;
			g.fillRect(sm.x - sm.r, sm.y - sm.r, sm.r * 2, sm.r * 2);
		}
	}

	function stepLife(dt, t) {
		/* embers */
		if (Math.random() < dt * 14) {
			embers.push({ x: FIRE_X + (Math.random() - 0.5) * 90, y: FIRE_Y - 10, vx: (Math.random() - 0.5) * 30, vy: -60 - Math.random() * 90, age: 0, life: 1.4 + Math.random() * 2 });
		}

		for (var i = embers.length - 1; i >= 0; i--) {
			var e = embers[i];

			e.age += dt;
			e.vx += Math.sin(t * 3 + i) * 20 * dt;
			e.x += e.vx * dt;
			e.y += e.vy * dt;

			if (e.age > e.life) embers.splice(i, 1);
		}

		/* smoke */
		if (Math.random() < dt * 3) {
			smoke.push({ x: FIRE_X + (Math.random() - 0.5) * 40, y: FIRE_Y - 90, r: 30, age: 0, life: 5 + Math.random() * 3 });
		}

		for (var s = smoke.length - 1; s >= 0; s--) {
			var sm = smoke[s];

			sm.age += dt;
			sm.y -= 38 * dt;
			sm.x += Math.sin(t * 0.7 + s) * 10 * dt;
			sm.r += 22 * dt;

			if (sm.age > sm.life) smoke.splice(s, 1);
		}

		/* fireflies wander */
		for (var f = 0; f < flies.length; f++) {
			var fl = flies[f];

			fl.vx += (Math.random() - 0.5) * 30 * dt;
			fl.vy += (Math.random() - 0.5) * 24 * dt;
			fl.vx *= 0.985;
			fl.vy *= 0.985;
			fl.x += fl.vx * dt;
			fl.y += fl.vy * dt;

			if (fl.x < -20) fl.x = W + 20;
			if (fl.x > W + 20) fl.x = -20;
			if (fl.y < 260) fl.vy += 20 * dt;
			if (fl.y > 900) fl.vy -= 20 * dt;
		}
	}

	function drawFlies(g, t) {
		g.save();
		g.globalCompositeOperation = "lighter";

		for (var i = 0; i < flies.length; i++) {
			var fl = flies[i];

			var blink = Math.max(0, Math.sin(t * fl.speed + fl.phase));

			blink = blink * blink;

			if (blink < 0.05) continue;

			var r = fl.size * 5;

			var gl = g.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, r);

			gl.addColorStop(0, "rgba(220,255,140," + (0.85 * blink) + ")");
			gl.addColorStop(0.25, "rgba(170,240,90," + (0.35 * blink) + ")");
			gl.addColorStop(1, "rgba(120,200,60,0)");

			g.fillStyle = gl;
			g.fillRect(fl.x - r, fl.y - r, r * 2, r * 2);
		}

		g.restore();
	}

	/* his strumming hand, in time with the music */
	function drawStrum(g, t, lit) {
		var beat = 60 / (strum.bpm || 72);

		var p = (t % (beat / 2)) / (beat / 2);

		var down = Math.sin(p * Math.PI) * 9;

		var hx = 852 + down * 0.3, hy = 712 + down;

		g.save();

		/* in the dark mostly: the fire only catches it a little */
		var a = lit * 0.55;

		g.fillStyle = "rgba(" + Math.floor(38 + 200 * a) + "," + Math.floor(43 + 170 * a) + "," + Math.floor(46 + 140 * a) + ",1)";
		poly(g, [812, 688, 834, 694, hx + 8, hy - 4, hx - 6, hy + 6]);
		g.fill();

		g.fillStyle = "rgba(" + Math.floor(16 + 42 * a) + "," + Math.floor(19 + 25 * a) + "," + Math.floor(21 + 15 * a) + ",1)";
		ellipse(g, hx + 2, hy + 3, 9, 8);
		g.fill();

		g.restore();
	}

	/*
		DUST IN THE LIGHT, over a picture: specks drifting up and across,
		twinkling as they turn in the sun, and a few big soft ones right in
		front of the lens. Screen space.
	*/
	var dust = [];

	function drawDust(t, dt) {
		if (!dust.length) {
			for (var i = 0; i < 70; i++) {
				var near = i < 9;

				dust.push({
					x: Math.random(), y: Math.random(),
					r: near ? 0.012 + Math.random() * 0.03 : 0.0012 + Math.random() * 0.0025,
					vx: 0.004 + Math.random() * 0.01, vy: -0.004 - Math.random() * 0.01,
					phase: Math.random() * 10, speed: 0.4 + Math.random() * 1.4, near: near
				});
			}
		}

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalCompositeOperation = "lighter";

		for (var k = 0; k < dust.length; k++) {
			var d = dust[k];

			d.x += (d.vx + Math.sin(t * 0.3 + d.phase) * 0.004) * dt;
			d.y += d.vy * dt;

			if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
			if (d.x > 1.05) d.x = -0.05;

			var tw = 0.5 + 0.5 * Math.sin(t * d.speed + d.phase);

			var x = d.x * cw, y = d.y * ch, r = d.r * ch;

			var a = d.near ? 0.05 + 0.05 * tw : 0.25 + 0.55 * tw * tw;

			var g = ctx.createRadialGradient(x, y, 0, x, y, r);

			g.addColorStop(0, "rgba(255,226,170," + a + ")");
			g.addColorStop(d.near ? 0.8 : 0.4, "rgba(255,200,130," + (a * 0.5) + ")");
			g.addColorStop(1, "rgba(255,200,130,0)");

			ctx.fillStyle = g;
			ctx.fillRect(x - r, y - r, r * 2, r * 2);
		}

		ctx.restore();
	}

	/*
		FIREFLIES, for a night picture: dark most of the time, then a slow
		swell of light and out again, each on its own clock, wandering lazily
		through the lower part of the jungle. Most are a green-gold; a few
		take the cyan of the glowing plants. Four drift right past the lens,
		big and out of focus. Screen space.
	*/
	var nightFlies = [];

	function drawFireflies(t, dt) {
		if (!nightFlies.length) {
			for (var i = 0; i < 46; i++) {
				var near = i < 4;

				nightFlies.push({
					x: Math.random(), y: 0.35 + Math.random() * 0.6,
					vx: (Math.random() - 0.5) * 0.02, vy: (Math.random() - 0.5) * 0.01,
					r: near ? 0.02 + Math.random() * 0.025 : 0.0022 + Math.random() * 0.0028,
					phase: Math.random() * 20, rate: 0.22 + Math.random() * 0.33,
					near: near, cyan: Math.random() < 0.3
				});
			}
		}

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalCompositeOperation = "lighter";

		for (var k = 0; k < nightFlies.length; k++) {
			var f = nightFlies[k];

			f.x += (f.vx + Math.sin(t * 0.37 + f.phase) * 0.008) * dt;
			f.y += (f.vy + Math.cos(t * 0.29 + f.phase * 1.3) * 0.005) * dt;

			if (f.x < -0.05) f.x = 1.05;
			if (f.x > 1.05) f.x = -0.05;
			if (f.y < 0.28) f.vy = Math.abs(f.vy);
			if (f.y > 1.0) f.vy = -Math.abs(f.vy);

			var cycle = (t * f.rate + f.phase) % 1;

			var glow = 0.06 + 0.94 * (cycle < 0.35 ? Math.sin(cycle / 0.35 * Math.PI) : 0);

			var x = f.x * cw, y = f.y * ch;

			var r = f.near ? f.r * ch : f.r * ch * 4 * (0.8 + glow * 0.5);

			var a = f.near ? 0.02 + 0.06 * glow : 0.9 * glow;

			var rgb = f.cyan ? "150,255,238" : "210,255,140";

			var g = ctx.createRadialGradient(x, y, 0, x, y, r);

			g.addColorStop(0, "rgba(" + rgb + "," + a + ")");
			g.addColorStop(f.near ? 0.7 : 0.22, "rgba(" + rgb + "," + (a * 0.45) + ")");
			g.addColorStop(1, "rgba(" + rgb + ",0)");

			ctx.fillStyle = g;
			ctx.fillRect(x - r, y - r, r * 2, r * 2);
		}

		ctx.restore();
	}

	/* mist creeping along the ground in a few long, slow banks */
	function drawMist(t) {
		ctx.save();

		for (var i = 0; i < 3; i++) {
			var y = ch * (0.66 + i * 0.12);

			var drift = ((t * (0.005 + i * 0.003) + i * 0.37) % 2) - 0.5;

			for (var copy = -1; copy <= 1; copy++) {
				var x = cw * (drift + copy * 2);

				ctx.setTransform(1, 0, 0, 0.26, x, y);

				var r = cw * 0.6;

				var g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);

				g.addColorStop(0, "rgba(170,190,205," + (0.075 - i * 0.017) + ")");
				g.addColorStop(1, "rgba(170,190,205,0)");

				ctx.fillStyle = g;
				ctx.fillRect(-r, -r, r * 2, r * 2);
			}
		}

		ctx.restore();
	}

	/* embers and dust drifting right past the lens: big, soft, out of focus */
	var bokeh = [];

	function drawBokeh(g, t, dt) {
		if (!bokeh.length) {
			for (var i = 0; i < 16; i++) {
				bokeh.push({
					x: Math.random() * W, y: 300 + Math.random() * 800, r: 14 + Math.random() * 46,
					vx: (Math.random() - 0.5) * 10, vy: -6 - Math.random() * 14, phase: Math.random() * 10,
					warm: Math.random() < 0.8
				});
			}
		}

		g.save();
		g.globalCompositeOperation = "lighter";

		for (var k = 0; k < bokeh.length; k++) {
			var b = bokeh[k];

			b.x += (b.vx + Math.sin(t * 0.4 + b.phase) * 6) * dt;
			b.y += b.vy * dt;

			if (b.y < -80) { b.y = H + 60; b.x = Math.random() * W; }

			var a = 0.06 + 0.06 * Math.sin(t * 0.7 + b.phase);

			var disc = g.createRadialGradient(b.x, b.y, b.r * 0.55, b.x, b.y, b.r);

			disc.addColorStop(0, b.warm ? "rgba(255,170,90," + a + ")" : "rgba(190,240,140," + a + ")");
			disc.addColorStop(0.85, b.warm ? "rgba(255,150,70," + (a * 1.4) + ")" : "rgba(170,230,120," + (a * 1.2) + ")");
			disc.addColorStop(1, "rgba(255,150,70,0)");

			g.fillStyle = disc;
			g.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
		}

		g.restore();
	}

	/*
		THE GRADE, like a film: the night pushed cold and dark, the fire's
		warmth pooled round him and spilling onto everything near it.
	*/
	function grade(flick) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.fillStyle = "rgba(4,16,20,0.14)";
		ctx.fillRect(0, 0, cw, ch);

		var fx = ox + FIRE_X * scale, fy = oy + (FIRE_Y - 140) * scale;

		var r = ch * 0.8;

		var warm = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);

		warm.addColorStop(0, "rgba(255,150,70," + (0.26 * flick) + ")");
		warm.addColorStop(0.45, "rgba(255,120,50," + (0.07 * flick) + ")");
		warm.addColorStop(1, "rgba(255,120,50,0)");

		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		ctx.fillStyle = warm;
		ctx.fillRect(0, 0, cw, ch);
		ctx.restore();
	}

	/* ------------------------------------------------------------------------
	   THE CAMERA: grain, lines, and now and then the signal tearing
	   ------------------------------------------------------------------------ */

	function cameraFX(t, tnow) {
		/* grain */
		var tile = grain[Math.floor(Math.random() * grain.length)];

		if (tile) {
			ctx.save();
			ctx.globalAlpha = 0.075;

			var gx = -Math.floor(Math.random() * 256), gy = -Math.floor(Math.random() * 256);

			for (var x = gx; x < cw; x += 256) {
				for (var y = gy; y < ch; y += 256) ctx.drawImage(tile, x, y);
			}

			ctx.restore();
		}

		/* scan lines */
		if (scan) {
			ctx.save();
			ctx.fillStyle = ctx.createPattern(scan, "repeat");
			ctx.fillRect(0, 0, cw, ch);
			ctx.restore();
		}

		/* THE SIGNAL TEARING: slices of the picture slip sideways, colours split */
		if (tnow > glitch.next) {
			glitch.until = tnow + 140 + Math.random() * 420;
			glitch.next = glitch.until + 5000 + Math.random() * 9000;
			glitch.kind = Math.random() < 0.18 ? 1 : 0;
		}

		if (tnow < glitch.until) {
			if (glitch.kind === 1) {
				/* the picture drops out to static for a moment */
				var tileS = grain[Math.floor(Math.random() * grain.length)];

				ctx.save();
				ctx.globalAlpha = 0.85;

				for (var sx = 0; sx < cw; sx += 256) {
					for (var sy = 0; sy < ch; sy += 256) ctx.drawImage(tileS, sx, sy);
				}

				ctx.restore();
			} else {
				for (var k = 0; k < 7; k++) {
					var y0 = Math.floor(Math.random() * ch), hh = Math.floor(8 + Math.random() * 70);
					var dx = Math.floor((Math.random() - 0.5) * 120);

					try { ctx.drawImage(canvas, 0, y0, cw, hh, dx, y0, cw, hh); } catch (e) {}
				}

				ctx.save();
				ctx.globalCompositeOperation = "lighter";
				ctx.globalAlpha = 0.12;

				try {
					ctx.drawImage(canvas, 6, 0);
					ctx.drawImage(canvas, -6, 0);
				} catch (e2) {}

				ctx.restore();
			}
		}
	}

	/* ------------------------------------------------------------------------
	   EACH FRAME
	   ------------------------------------------------------------------------ */

	var last = now(), lastDraw = 0;

	function frame() {
		var tnow = now();

		raf(frame);

		/* thirty frames a second is plenty, and leaves the game its CPU while it loads */
		if (tnow - lastDraw < 32) return;

		lastDraw = tnow;

		var dt = Math.min((tnow - last) / 1000, 0.1);

		last = tnow;

		var t = (tnow - startedAt) / 1000;

		stepLife(dt, t);

		var flick = 0.78 + 0.14 * Math.sin(t * 9.1) * Math.sin(t * 3.7) + 0.08 * Math.sin(t * 23.0);

		/* the camera breathing: the world moves, the visor does not */
		var swayX = Math.sin(t * 0.37) * 6 + Math.sin(t * 1.1) * 1.5;
		var swayY = Math.sin(t * 0.52) * 4 + Math.sin(t * 1.7) * 1.2;

		/*
			A CLEAN SLATE EVERY FRAME. If anything drawn last frame stopped half
			way (an error between a save and its restore), the canvas would be
			left adding light instead of painting -- and the picture would wash
			out to white a frame at a time. So the mode is put back here, always.
		*/
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalCompositeOperation = "source-over";
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, cw, ch);

		if (photo) {
			/*
				YOUR PICTURE, ALIVE: a slow push in and out over a minute, a
				drift across it, the camera breathing, the sun's haze swelling,
				and dust floating through the light.
			*/
			var zoom = 1.05 + 0.06 * (0.5 - 0.5 * Math.cos(t * 2 * Math.PI / 70));

			var ps = Math.max(cw / photo.width, ch / photo.height) * zoom;

			var pw = photo.width * ps, ph = photo.height * ps;

			var panX = Math.sin(t * 0.045) * cw * 0.012, panY = Math.sin(t * 0.031) * ch * 0.008;

			ctx.drawImage(photo, (cw - pw) / 2 + swayX * 0.6 + panX, (ch - ph) / 2 + swayY * 0.6 + panY, pw, ph);

			/*
				THE LIGHT IN THE PICTURE, breathing: a gold haze for a sunset,
				a pale cold one for a night under the moon (LIGHT in config.js).
			*/
			var moon = LOADING.LIGHT === "moon";

			var lightX = cw * (LOADING.LIGHT_X != null ? LOADING.LIGHT_X : (LOADING.SUN_X || 0.84));
			var lightY = ch * (LOADING.LIGHT_Y != null ? LOADING.LIGHT_Y : (LOADING.SUN_Y || 0.2));

			var haze = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, ch * 0.95);

			if (moon) {
				haze.addColorStop(0, "rgba(180,205,255," + (0.08 + 0.03 * Math.sin(t * 0.4)) + ")");
				haze.addColorStop(0.5, "rgba(140,170,230," + (0.025 + 0.01 * Math.sin(t * 0.4)) + ")");
				haze.addColorStop(1, "rgba(140,170,230,0)");
			} else {
				haze.addColorStop(0, "rgba(255,196,120," + (0.12 + 0.05 * Math.sin(t * 0.55)) + ")");
				haze.addColorStop(0.5, "rgba(255,170,90," + (0.04 + 0.02 * Math.sin(t * 0.55)) + ")");
				haze.addColorStop(1, "rgba(255,170,90,0)");
			}

			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.fillStyle = haze;
			ctx.fillRect(0, 0, cw, ch);
			ctx.restore();

			if (LOADING.MIST) drawMist(t);

			if (moon && LOADING.FIREFLIES !== false) {
				drawFireflies(t, dt);
			} else {
				drawDust(t, dt);
			}
		} else if (wantPhoto) {
			/* the picture is still on its way: dark until it arrives */
		} else {
			/*
				DEPTH: the further away a layer is, the less it moves with the
				camera and the softer it is (soften, in paintBack) -- the lens
				is focused on him.
			*/
			ctx.setTransform(1, 0, 0, 1, swayX * 0.5, swayY * 0.5);
			ctx.drawImage(back, 0, 0);

			var fogShift = (t * 14) % 1024;

			ctx.save();
			ctx.setTransform(scale, 0, 0, scale, ox + swayX * 0.65, oy + swayY * 0.65);
			ctx.globalAlpha = 0.9;

			for (var fx = -1024; fx < W + 1024; fx += 1024) ctx.drawImage(fog, fx + fogShift, 470, 1024, 300);

			ctx.restore();

			ctx.setTransform(1, 0, 0, 1, swayX * 0.8, swayY * 0.8);
			ctx.drawImage(middle, 0, 0);

			ctx.save();
			ctx.setTransform(scale, 0, 0, scale, ox + swayX * 0.9, oy + swayY * 0.9);
			ctx.globalAlpha = 0.55;

			for (var fx2 = -1024; fx2 < W + 1024; fx2 += 1024) ctx.drawImage(fog, fx2 - fogShift * 0.6, 640, 1024, 260);

			ctx.restore();

			/* HIM, in focus: in the dark, and lit by the fire as it flickers */
			var litK = Math.max(0, Math.min(1, 0.25 + 0.55 * flick));

			ctx.setTransform(1, 0, 0, 1, swayX, swayY);
			ctx.drawImage(figDark, 0, 0);

			ctx.globalAlpha = litK;
			ctx.drawImage(figLit, 0, 0);
			ctx.globalAlpha = 1;

			ctx.drawImage(hearth, 0, 0);

			ctx.setTransform(scale, 0, 0, scale, ox + swayX, oy + swayY);

			drawStrum(ctx, t, litK);
			drawFire(ctx, t, flick);
			drawFlies(ctx, t);

			/* the ferns right in front of the lens, and embers drifting past it, blurred */
			ctx.setTransform(1, 0, 0, 1, swayX * 1.4, swayY * 1.4);
			ctx.drawImage(front, 0, 0);

			grade(flick);

			/* the out-of-focus embers last: they are lights, the grade does not dim them */
			ctx.setTransform(scale, 0, 0, scale, ox + swayX * 1.4, oy + swayY * 1.4);
			drawBokeh(ctx, t, dt);
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.drawImage(visor, 0, 0);
		ctx.drawImage(cracks, 0, 0);

		cameraFX(t, tnow);
	}

	var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) { return setTimeout(fn, 16); };

	function resize() {
		cw = window.innerWidth || 1920;
		ch = window.innerHeight || 1080;

		canvas.width = cw;
		canvas.height = ch;

		/* cover the screen with the 1920 x 1080 picture, cropping the edges if the shape differs */
		scale = Math.max(cw / W, ch / H) * 1.03;
		ox = (cw - W * scale) / 2;
		oy = (ch - H * scale) / 2;

		if (!wantPhoto) {
			paintBack();
			figDark = paintFigure(false);
			figLit = paintFigure(true);
			paintFront();
		}

		paintVisor();
		paintCracks();
	}

	function start(el) {
		canvas = el;
		ctx = canvas.getContext("2d");

		paintGrain();
		paintFog();
		seedLife();

		var custom = window.LOADING && LOADING.SCENE_IMAGE;

		if (custom) {
			wantPhoto = true;

			var im = new Image();

			im.onload = function () { photo = im; resize(); };
			im.src = custom;
		}

		resize();

		window.addEventListener("resize", resize, false);

		raf(frame);
	}

	return {
		start: start,

		/* the music tells the hand how fast to strum */
		setTempo: function (bpm) { strum.bpm = bpm || 72; }
	};
})();
