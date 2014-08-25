
prettyPrint();

// line number anchors
(function() {
	var hash = document.location.hash.substring(1),
		code = hash && document.getElementsByClassName('prettyprint source linenums'),
		lines, i;
	if (code && code[0]) {
		lines = code[0].getElementsByTagName('li');
		for (i=lines.length; i--; ) {
			lines[i].id = 'line' + i;
			if (lines[i].id===hash) {
				lines[i].className += ' selected';
			}
		}
	}
})();

// menu updates
(function() {
	function updateNav() {
		var url = location.href,
			links = document.querySelectorAll('nav li a'),
			i;
		for (i=links.length; i--; ) {
			if (links[i].href===url) {
				links[i].className = 'current';
			}
			else if (links[i].href===url.replace(/#.*/g,'')) {
				links[i].className = 'parent';
			}
			else {
				links[i].className = '';
			}
		}
		//links = document.querySelectorAll('.navinner');
		//for (i=links.length; i--; ) {
		//	links[i].style.display = (links[i].previousSibling.querySelector('.current') || links[i].querySelector('.current')) ? 'block' : 'none';
		//}
	}

	updateNav();

	addEventListener('popstate', updateNav);
	addEventListener('hashchange', updateNav);

	// menu link is a toggle, sidebar links are close-only
	function click(e) {
		var op = 'remove';
		if (this.className==='menuLink') {
			op = document.body.classList.contains('menu-open') ? 'remove' : 'add';
			e.preventDefault();
		}
		document.body.classList[op]('menu-open');
	}
	[].forEach.call(document.querySelectorAll('nav a, .menuLink'), function(v) {
		v.addEventListener('click', click);
	});
})();
