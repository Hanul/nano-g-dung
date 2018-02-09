let view = 'home';

let point;
let game_time;
let dung_time;
let dung_interval;
let dungs;
let man_time;
let man_x;
let man_flip_x;
let is_man_dead;

play('sound/bgm.mp3', {loop: true});

// 선로딩
for (let i = 0; i < 7; i += 1) {
	draw('img/man' + i + '.png');
}
draw('img/man_down.png');

let start_game = () => {
	
	point = 0;
	game_time = 0;
	dung_time = 0;
	dung_interval = 0.5;
	dungs = [];
	man_time = 0;
	man_x = 0;
	man_flip_x = false;
	is_man_dead = false;
	
	play('sound/sound_start_game.wav');
	
	view = 'game';
};

g(() => {
	draw('img/bg.png');
	
	// 홈 화면
	if (view === 'home') {
		
		draw('img/title.png', {y: -200});
		draw('제작: 심영재', {y: -120, size: 25});
		draw('img/start_button.png', {y: 110});
		
		if (check_input('mouse') && check_collision('point_rect', {
			x1: mouse_x,
			y1: mouse_y,
			y2: 110,
			width2: 280,
			height2: 100
		})) {
			start_game();
		}
	}
	
	// 게임 화면
	if (view === 'game') {
		
		game_time += delta_time;
		
		// 사람 이동 처리
		if (is_man_dead !== true) {
			
			if (check_input('arrowleft')) {
				man_flip_x = true;
				man_time += delta_time;
				man_x -= delta_time * 300;
				if (man_x < -180) {
					man_x = -180;
				}
			}
			
			if (check_input('arrowright')) {
				man_flip_x = false;
				man_time += delta_time;
				man_x += delta_time * 300;
				if (man_x > 180) {
					man_x = 180;
				}
			}
		}
		
		// 똥 생성
		dung_time += delta_time;
		
		if (dung_time > dung_interval) {
			dung_time -= dung_interval;
			
			dungs.push({x: Math.random() * 360 - 180, y: -320, dy: 0});
		}
		
		dung_interval = 0.5 - game_time / 100;
		if (dung_interval < 0.1) {
			dung_interval = 0.1;
		}
		
		// 똥 처리
		dungs.forEach((dung) => {
			
			// 똥 떨어진다.
			if (dung.y < 235) {
				
				draw('img/dung.png', {x: dung.x, y: dung.y});
				
				dung.y += dung.dy;
				dung.dy += delta_time * 10;
				
				// 떨어지는 똥에 사람이 맞으면
				if (is_man_dead !== true && check_collision('rect_rect', {
					x1: dung.x,
					y1: dung.y,
					width1: 40,
					height1: 40,
					x2: man_x,
					y2: 200,
					width2: 20,
					height2: 90
				})) {
					is_man_dead = true;
					play('sound/sound_game_over.wav');
				}
			}
			
			// 바닥에 도착
			if (dung.y > 235) {
				dung.y = 235;
				
				let rk = Math.floor(Math.random() * 3);
				if (rk === 0) {
					play('sound/sound_drop_dung_1.wav');
				} else if (rk === 1) {
					play('sound/sound_drop_dung_2.wav');
				} else if (rk === 2) {
					play('sound/sound_drop_dung_3.wav');
				}
				
				if (is_man_dead !== true) {
					point += 1;
				}
			}
			
			// 터진 똥
			if (dung.y === 235) {
				draw('img/dung_down.png', {x: dung.x, y: dung.y});
			}
		});
		
		// 사람 드로잉
		if (is_man_dead === true) {
			draw('img/man_down.png', {x: man_x, y: 250, flip_x: man_flip_x});
			
			draw('제작: 심영재', {y: -120, size: 25});
			draw('img/start_button.png', {y: 110});
			
			if (check_input('mouse') && check_collision('point_rect', {
				x1: mouse_x,
				y1: mouse_y,
				y2: 110,
				width2: 280,
				height2: 100
			})) {
				start_game();
			}
		}
		
		else {
			draw('img/man' + parseInt(man_time * 10 % 6) + '.png', {x: man_x, y: 200, flip_x: man_flip_x});
		}
		
		draw('점수: ' + point, {y: -290, size: 25});
	}
});